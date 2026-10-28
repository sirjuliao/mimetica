-- Aplicado em 28/10/2026 no projeto experimento-gemeo (owsqgufiaexenvgflvqe).
-- Links pessoais (cada sócio recebe um link com um código) e transcrição automática.

alter table public.participantes add column if not exists consentimento_em timestamptz;

create table public.convites (
  token      text primary key,
  nome       text not null,
  email      text not null unique,
  user_id    uuid unique references public.participantes(id) on delete set null,
  criado_em  timestamptz not null default now()
);
alter table public.convites enable row level security;
-- Sem políticas: só a função do servidor (chave de serviço) lê esta tabela.

alter table public.respostas_audio
  add column if not exists pergunta_n int,
  add column if not exists tema text,
  add column if not exists principal boolean,
  add column if not exists transcricao text,
  add column if not exists transcricao_status text not null default 'pendente'
    check (transcricao_status in ('pendente','processando','ok','erro','sem_chave')),
  add column if not exists transcricao_erro text,
  add column if not exists transcrito_em timestamptz;

create unique index if not exists respostas_audio_user_pergunta_n
  on public.respostas_audio (user_id, pergunta_n);

-- 003: create extension if not exists pg_net with schema extensions;  (usado para testar a função pelo banco)
-- Convites: um por sócio, código aleatório de 24 caracteres. Os códigos ficam só no banco.

-- 004_convites_admin (aplicado em 28/10/2026)
alter table public.convites
  add column if not exists tipo text not null default 'socio' check (tipo in ('socio','convidado','teste')),
  add column if not exists empresa text,
  add column if not exists admin boolean not null default false,
  add column if not exists ativo boolean not null default true;
-- O link do Fernando é o de administrador (admin = true).
