# Lúmena Espanhol — proposta de site (mock)

Site estático (HTML/CSS/JS puro, sem build) para a Lúmena Espanhol.

## Páginas
- `index.html` — landing page (foco: lista de espera das aulas particulares)
- `aulas-particulares.html` — formulário da lista de espera
- `curso.html` — Descomplicando o Espanhol (checkout Kiwify atual)
- `lendo-em-espanhol.html` — Lendo em Espanhol (checkout Kiwify atual)
- `admin/` — área da professora (senha demo: `lumena`)

## Rodar
    python3 -m http.server 8000

## Notas do mock
- Formulário e painel usam `localStorage` (dados só no navegador). Versão real: backend + login + banco.
- Painel traz 10 contatos fictícios de exemplo.
- Depoimentos são placeholders: trocar por prints reais.
- Preço do curso copiado do site atual: 12x R$ 79,72 (= R$ 956,64) vs R$ 794 à vista. Confirmar com a Sofia.
- Sem fotos: usar fotos da Sofia na versão final.
