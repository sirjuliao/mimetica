# Idioma PT/EN das apresentações

- `i18n.html`: o seletor PT/EN e o tradutor. É inserido na montagem no lugar do marcador `<!--I18N:nome-->`.
- `destilados.json`, `apoio.json`: dicionários frase em português → frase em inglês.
- A escolha fica no endereço (`?lang=en`) e no navegador. Em inglês, a página troca cada texto que estiver no dicionário,
  inclusive os textos desenhados nas animações e os montados pelo código (o `CONFIG` é traduzido antes de desenhar).
- Ao mudar um texto em português, atualize a frase correspondente no dicionário. Frase fora do dicionário aparece em português.
- Números com vírgula decimal, horários (13h15) e "34 anos · B" são convertidos por regra, sem entrada no dicionário.
