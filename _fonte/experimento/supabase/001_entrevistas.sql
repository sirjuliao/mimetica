-- Experimento "O gêmeo contra o original" · 001_entrevistas
-- Participantes, respostas em áudio (uma por pergunta) e bucket privado "entrevistas".
-- RLS: cada participante vê só o que é seu; o construtor lê tudo.

-- 1. Participantes (uma linha por usuário do Auth, criada no primeiro login)
create table public.participantes (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text not null,
  nome       text,
  papel      text not null default 'participante'
             check (papel in ('participante', 'construtor')),
  criado_em  timestamptz not null default now()
);

create or replace function public.cria_participante()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.participantes (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger ao_criar_usuario
  after insert on auth.users
  for each row execute function public.cria_participante();

-- Quem é construtor (security definer para não cair em recursão de RLS)
create or replace function public.eh_construtor()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.participantes
    where id = (select auth.uid()) and papel = 'construtor'
  );
$$;

revoke execute on function public.eh_construtor() from public, anon;
grant execute on function public.eh_construtor() to authenticated;
revoke execute on function public.cria_participante() from public, anon, authenticated;

-- 2. Respostas em áudio: uma por pergunta. Regravar substitui (upsert).
create table public.respostas_audio (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null default auth.uid()
                 references public.participantes(id) on delete cascade,
  pergunta       text not null,
  caminho        text not null,          -- caminho no bucket: <user_id>/<arquivo>
  mime           text,
  bytes          bigint,
  duracao_seg    numeric(8,2),
  criado_em      timestamptz not null default now(),
  atualizado_em  timestamptz not null default now(),
  constraint uma_resposta_por_pergunta unique (user_id, pergunta),
  constraint caminho_na_pasta_do_dono check (split_part(caminho, '/', 1) = user_id::text)
);

create or replace function public.marca_atualizacao()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.atualizado_em := now();
  return new;
end;
$$;

create trigger respostas_audio_atualizado
  before update on public.respostas_audio
  for each row execute function public.marca_atualizacao();

-- 3. RLS das tabelas
alter table public.participantes   enable row level security;
alter table public.respostas_audio enable row level security;

create policy "participante ve o proprio cadastro; construtor ve todos"
  on public.participantes for select to authenticated
  using (id = (select auth.uid()) or (select public.eh_construtor()));

create policy "participante edita o proprio cadastro"
  on public.participantes for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- O participante só pode mudar o nome. O papel é marcado pelo painel ou pela chave de serviço.
revoke update on public.participantes from authenticated, anon;
grant update (nome) on public.participantes to authenticated;

create policy "participante ve as proprias respostas; construtor ve todas"
  on public.respostas_audio for select to authenticated
  using (user_id = (select auth.uid()) or (select public.eh_construtor()));

create policy "participante grava as proprias respostas"
  on public.respostas_audio for insert to authenticated
  with check (user_id = (select auth.uid()));

create policy "participante regrava as proprias respostas"
  on public.respostas_audio for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "participante apaga as proprias respostas"
  on public.respostas_audio for delete to authenticated
  using (user_id = (select auth.uid()));

-- 4. Bucket privado "entrevistas", uma pasta por user_id
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'entrevistas', 'entrevistas', false,
  104857600,  -- 100 MB por arquivo
  array['audio/webm', 'audio/mp4', 'audio/mpeg', 'audio/ogg', 'audio/wav',
        'audio/x-m4a', 'audio/aac', 'video/mp4', 'video/webm', 'application/zip']
)
on conflict (id) do nothing;

create policy "entrevistas: ler a propria pasta; construtor le tudo"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'entrevistas'
    and ((storage.foldername(name))[1] = (select auth.uid())::text
         or (select public.eh_construtor()))
  );

create policy "entrevistas: enviar na propria pasta"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'entrevistas'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "entrevistas: substituir na propria pasta"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'entrevistas'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
  with check (
    bucket_id = 'entrevistas'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "entrevistas: apagar na propria pasta"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'entrevistas'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create index respostas_audio_user_idx on public.respostas_audio (user_id);
