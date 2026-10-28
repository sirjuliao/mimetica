// Função "entrevista": recebe as gravações da tela /experimento/gravar e transcreve com a OpenAI.
// Autenticação própria: cada sócio usa o link pessoal com um código (tabela public.convites).
// Ações (POST):
//   JSON {acao:"quem", token}                         -> nome e respostas já guardadas
//   JSON {acao:"consentir", token, nome}               -> registra o consentimento
//   multipart acao=enviar, token, pergunta_n, tema, principal, pergunta, duracao, arquivo
//   JSON {acao:"enviar_b64", ...mesmos campos, arquivo_b64, mime}
//   JSON {acao:"admin_listar"|"admin_criar"|"admin_ativar", token de administrador, ...}
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (d: unknown, status = 200) =>
  new Response(JSON.stringify(d), { status, headers: { ...CORS, "Content-Type": "application/json" } });

const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
  auth: { persistSession: false },
});

async function usuarioDoToken(token: string) {
  if (!token || !/^[a-f0-9]{24}$/.test(token)) return null;
  const { data: c } = await admin.from("convites").select("*").eq("token", token).maybeSingle();
  if (!c || c.ativo === false) return null;
  const extra = { tipo: c.tipo as string, admin: !!c.admin };
  if (c.user_id) return { id: c.user_id as string, nome: c.nome as string, ...extra };
  // Primeiro uso: cria o usuário (o gatilho cria a linha em participantes).
  let uid: string | null = null;
  const { data: novo, error } = await admin.auth.admin.createUser({ email: c.email, email_confirm: true });
  if (novo?.user) uid = novo.user.id;
  else {
    const { data: lista } = await admin.auth.admin.listUsers({ perPage: 200 });
    uid = lista?.users.find((u) => u.email === c.email)?.id ?? null;
    if (!uid) throw new Error("não foi possível criar o usuário: " + (error?.message ?? ""));
  }
  await admin.from("participantes").upsert({ id: uid, email: c.email, nome: c.nome }, { onConflict: "id" });
  await admin.from("convites").update({ user_id: uid }).eq("token", token);
  return { id: uid, nome: c.nome as string, ...extra };
}

const novoToken = () => Array.from(crypto.getRandomValues(new Uint8Array(12)), (x) => x.toString(16).padStart(2, "0")).join("");

async function listaConvites() {
  const { data: cs } = await admin.from("convites").select("token, nome, empresa, tipo, admin, ativo, user_id, criado_em").order("criado_em");
  const ids = (cs ?? []).map((c) => c.user_id).filter(Boolean);
  const { data: rs } = ids.length
    ? await admin.from("respostas_audio").select("user_id, principal, duracao_seg, transcricao_status, atualizado_em").in("user_id", ids)
    : { data: [] as Record<string, unknown>[] };
  const { data: ps } = ids.length
    ? await admin.from("participantes").select("id, consentimento_em").in("id", ids)
    : { data: [] as Record<string, unknown>[] };
  return (cs ?? []).map((c) => {
    const minhas = (rs ?? []).filter((r) => r.user_id === c.user_id);
    return {
      token: c.token, nome: c.nome, empresa: c.empresa, tipo: c.tipo, admin: c.admin, ativo: c.ativo, criado_em: c.criado_em,
      abriu: !!c.user_id,
      consentiu: !!(ps ?? []).find((p) => p.id === c.user_id && p.consentimento_em),
      respostas: minhas.length,
      principais: minhas.filter((r) => r.principal).length,
      minutos: Math.round(minhas.reduce((t, r) => t + Number(r.duracao_seg || 0), 0) / 6) / 10,
      transcritas: minhas.filter((r) => r.transcricao_status === "ok").length,
      ultimo: minhas.map((r) => r.atualizado_em as string).sort().pop() ?? null,
    };
  });
}

const extDe = (mime: string) =>
  mime.includes("mp4") || mime.includes("m4a") || mime.includes("aac") ? "m4a"
  : mime.includes("ogg") ? "ogg" : mime.includes("mpeg") ? "mp3" : mime.includes("wav") ? "wav" : "webm";

async function transcrever(id: string) {
  const chave = Deno.env.get("OPENAI_API_KEY");
  const { data: r } = await admin.from("respostas_audio").select("*").eq("id", id).maybeSingle();
  if (!r) return;
  if (!chave) {
    await admin.from("respostas_audio").update({ transcricao_status: "sem_chave" }).eq("id", id);
    return;
  }
  await admin.from("respostas_audio").update({ transcricao_status: "processando", transcricao_erro: null }).eq("id", id);
  try {
    const { data: blob, error } = await admin.storage.from("entrevistas").download(r.caminho);
    if (error || !blob) throw new Error("download: " + (error?.message ?? "vazio"));
    const nome = r.caminho.split("/").pop()!;
    const fd = new FormData();
    fd.append("file", new File([blob], nome, { type: r.mime || blob.type || "audio/webm" }));
    fd.append("model", "gpt-4o-transcribe");
    fd.append("language", "pt");
    fd.append("response_format", "json");
    fd.append("prompt", "Entrevista em português do Brasil. A pessoa conta a própria história de vida, trabalho, dinheiro e valores.");
    const resp = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST", headers: { Authorization: `Bearer ${chave}` }, body: fd,
    });
    const corpo = await resp.json().catch(() => ({}));
    if (!resp.ok) throw new Error(`openai ${resp.status}: ${corpo?.error?.message ?? ""}`.slice(0, 500));
    // Só grava se a resposta não foi regravada no meio do caminho.
    await admin.from("respostas_audio").update({
      transcricao: corpo.text ?? "", transcricao_status: "ok", transcrito_em: new Date().toISOString(),
    }).eq("id", id).eq("caminho", r.caminho).eq("atualizado_em", r.atualizado_em);
  } catch (e) {
    await admin.from("respostas_audio").update({
      transcricao_status: "erro", transcricao_erro: String((e as Error).message ?? e).slice(0, 500),
    }).eq("id", id);
  }
}

const emSegundoPlano = (p: Promise<unknown>) => {
  // deno-lint-ignore no-explicit-any
  const er = (globalThis as any).EdgeRuntime;
  if (er?.waitUntil) er.waitUntil(p); else p.catch(() => {});
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ erro: "use POST" }, 405);
  try {
    const tipo = req.headers.get("content-type") ?? "";
    let f: FormData | null = null;
    if (tipo.includes("multipart/form-data")) f = await req.formData();
    const b = f ? {} as Record<string, unknown> : await req.json().catch(() => ({}));
    if (!f && b.acao === "enviar_b64") {
      // Mesmo envio, com o áudio em base64 dentro do JSON (usado em testes e como reserva).
      f = new FormData();
      for (const k of ["token", "pergunta_n", "tema", "principal", "pergunta", "duracao"]) if (b[k] != null) f.append(k, String(b[k]));
      const bytes = Uint8Array.from(atob(String(b.arquivo_b64 ?? "")), (c) => c.charCodeAt(0));
      f.append("arquivo", new File([bytes], "audio", { type: String(b.mime ?? "audio/webm") }));
    }
    if (f) {
      const u = await usuarioDoToken(String(f.get("token") ?? ""));
      if (!u) return json({ erro: "link inválido" }, 401);
      const n = parseInt(String(f.get("pergunta_n")), 10);
      const arq = f.get("arquivo");
      if (!(n >= 1 && n <= 99) || !(arq instanceof File) || arq.size === 0) return json({ erro: "dados incompletos" }, 400);
      if (arq.size > 100 * 1024 * 1024) return json({ erro: "arquivo grande demais" }, 413);
      const mime = arq.type || "audio/webm";
      const caminho = `${u.id}/${String(n).padStart(2, "0")}.${extDe(mime)}`;
      const { data: antiga } = await admin.from("respostas_audio").select("caminho").eq("user_id", u.id).eq("pergunta_n", n).maybeSingle();
      const up = await admin.storage.from("entrevistas").upload(caminho, arq, { contentType: mime, upsert: true });
      if (up.error) return json({ erro: "armazenamento: " + up.error.message }, 500);
      if (antiga && antiga.caminho !== caminho) await admin.storage.from("entrevistas").remove([antiga.caminho]);
      const linha = {
        user_id: u.id, pergunta_n: n, pergunta: String(f.get("pergunta") ?? `Pergunta ${n}`),
        tema: String(f.get("tema") ?? ""), principal: String(f.get("principal")) === "true",
        caminho, mime, bytes: arq.size, duracao_seg: Number(f.get("duracao") ?? 0) || null,
        transcricao: null, transcricao_status: "pendente", transcricao_erro: null, transcrito_em: null,
        atualizado_em: new Date().toISOString(),
      };
      const { data: salva, error } = await admin.from("respostas_audio")
        .upsert(linha, { onConflict: "user_id,pergunta_n" }).select("id").single();
      if (error) return json({ erro: "banco: " + error.message }, 500);
      emSegundoPlano(transcrever(salva.id));
      return json({ ok: true, pergunta_n: n });
    }
    const u = await usuarioDoToken(String(b.token ?? ""));
    if (!u) return json({ erro: "link inválido" }, 401);
    if (String(b.acao ?? "").startsWith("admin_")) {
      if (!u.admin) return json({ erro: "sem permissão" }, 403);
      if (b.acao === "admin_listar") return json({ convites: await listaConvites() });
      if (b.acao === "admin_criar") {
        const nome = String(b.nome ?? "").trim().slice(0, 120);
        if (!nome) return json({ erro: "nome vazio" }, 400);
        const tipo = ["socio", "convidado", "teste"].includes(String(b.tipo)) ? String(b.tipo) : "convidado";
        const token = novoToken();
        const { error } = await admin.from("convites").insert({
          token, nome, empresa: String(b.empresa ?? "").trim().slice(0, 120) || null, tipo,
          email: `${tipo}-${token.slice(0, 10)}@convite.mimetica.institute`,
        });
        if (error) return json({ erro: error.message }, 500);
        return json({ ok: true, token, convites: await listaConvites() });
      }
      if (b.acao === "admin_ativar") {
        const alvo = String(b.alvo ?? "");
        if (alvo === b.token) return json({ erro: "não dá para desativar o próprio link" }, 400);
        await admin.from("convites").update({ ativo: !!b.ativo }).eq("token", alvo);
        return json({ ok: true, convites: await listaConvites() });
      }
      return json({ erro: "ação desconhecida" }, 400);
    }
    if (b.acao === "consentir") {
      await admin.from("participantes").update({ consentimento_em: new Date().toISOString(), nome: String(b.nome || u.nome).slice(0, 120) }).eq("id", u.id);
      return json({ ok: true });
    }
    if (b.acao === "quem") {
      const { data: p } = await admin.from("participantes").select("nome, consentimento_em").eq("id", u.id).maybeSingle();
      const { data: rs } = await admin.from("respostas_audio")
        .select("id, pergunta_n, duracao_seg, transcricao_status").eq("user_id", u.id).order("pergunta_n");
      // Tenta de novo as transcrições que ficaram para trás.
      for (const r of rs ?? []) if (["sem_chave", "erro", "pendente"].includes(r.transcricao_status)) emSegundoPlano(transcrever(r.id));
      return json({
        nome: p?.nome || u.nome, consentiu: !!p?.consentimento_em, tipo: u.tipo,
        respostas: (rs ?? []).map((r) => ({ n: r.pergunta_n, dur: Number(r.duracao_seg), status: r.transcricao_status })),
      });
    }
    return json({ erro: "ação desconhecida" }, 400);
  } catch (e) {
    return json({ erro: String((e as Error).message ?? e) }, 500);
  }
});
