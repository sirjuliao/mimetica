# Fonte da apresentação /apoio

Pasta com o arquivo-fonte e as ferramentas da apresentação publicada em mimetica.institute/apoio.
Pastas que começam com "_" não são publicadas pelo GitHub Pages.

## Arquivos
- `fonte.html`: arquivo-fonte do deck. Os textos e números editáveis ficam no bloco `CONFIG`, no topo.
  As duas versões (desktop e celular em pé) saem deste mesmo arquivo. A versão de celular é o bloco
  de CSS `html.retrato`.
- `logo-claro.b64`, `logo-escuro.b64`: logos originais em base64 (não recolorir).
- `montar.py`: gera `apoio/index.html` (site) e `apresentacao.html` (versão solta).
- `pdf/`: gerador do PDF de quadros-chave.
  - `frames.js` (Playwright): lista de quadros `[slide, passo, espera, comQR]`. No slide Equipe, a classe `pdf-eq` troca os botões pelo endereço do LinkedIn. Insere QR na capa e no
    encerramento e o contato no encerramento.
  - `tabela.html`: página extra com a tabela das áreas.
  - Fontes locais via `npm install` (@fontsource/space-grotesk, inter, jetbrains-mono), porque o PDF
    não carrega o Google Fonts.

## Como atualizar
1. Editar `fonte.html` (de preferência só o `CONFIG`).
2. `python3 montar.py`.
3. Conferir no desktop (1600×900) e no celular em pé (390×844 e 360×780).
4. PDF: em `pdf/`, montar `deck.html` a partir de `apoio/index.html`, trocando o link do Google Fonts
   pelos `@font-face` locais de `tabela.html` e desativando o `beforeprint`. Depois rodar
   `node frames.js` e juntar `f01.pdf…fNN.pdf` com pypdf.
5. Commit e push.

## Regras de texto
- Termos fixos: "gêmeo digital" e "população artificial". Sem sinônimos.
- Evitar "pesquisa" e "sintético". Sem travessões.
