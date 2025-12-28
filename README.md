# Template v9.0.0 - Páginas com Netlify

Template para criação de landing pages de conversão com HTML, CSS e JavaScript
puro.

## 🚀 Quick Start

```bash
# 1. Clone ou baixe este template
git clone [URL_DO_REPO]

# 2. Configure GTM (opcional)
# Abra /js/tracking.js
# Substitua GTM_ID = 'GTM-XXXXXXX' pelo seu ID
# Descomente o bloco de inicialização

# 3. Instale Netlify CLI (uma vez só)
npm install -g netlify-cli

# 4. Rode localmente
npx netlify dev

# 5. Acesse (COM barra final):
http://localhost:8888/sua-pagina/
```

## 📁 Estrutura

```
/
├── css/                    # CSS compartilhado
│   ├── global.css          # Reset + variáveis
│   └── components.css      # Componentes reutilizáveis
├── js/                     # JavaScript compartilhado
│   ├── tracking.js         # Google Tag Manager
│   ├── form.js             # Formulários
│   └── components.js       # Componentes (carousel, etc)
├── images/                 # Imagens compartilhadas
├── netlify/functions/      # Serverless functions
├── sua-pagina/             # Suas landing pages
│   ├── index.html
│   └── style.css
└── INSTRUCTIONS.md         # Documentação completa
```

## ⚡ Stack

- **Pico CSS** (classless) como base
- HTML + CSS + JS puro
- Netlify (hosting + functions + image CDN)
- Cloudflare Turnstile (captcha)
- intl-tel-input (validação telefone)
- Google Tag Manager (tracking)

## 🎯 Features

- **Pico CSS classless** - Estilização automática sem classes
- **Ticker Carousel CSS-only** - Loop infinito sem dependências JS
- Otimização automática de imagens
- Formulários com validação em tempo real + captcha
- Captura automática de UTMs e tracking params
- Google Tag Manager para eventos
- Eventos automáticos (page_view + generate_lead)
- Componentes prontos (accordion nativo, ticker)
- Mobile-first e responsivo
- SEO-ready

## 📖 Documentação

**INSTRUCTIONS.md** - Deploy e configuração:

- Deploy no Netlify
- Configurar Google Tag Manager
- Adicionar Facebook Pixel/GA4 via GTM
- Configurar Cloudflare Turnstile
- Troubleshooting

**.agent/rules/template-lp.md** - Regras de desenvolvimento:

- Stack e estrutura
- Ordem de CSS/JS
- Padrões obrigatórios
- Validações

## ⚠️ Importante

- Use `npx netlify dev` para desenvolvimento local
- Sempre acesse com barra final (`/nome-pagina/`)
- Leia `INSTRUCTIONS.md` para setup completo

## 📝 Licença

Template de uso livre.

---

**Versão:** 9.0.0\
**Última atualização:** Dezembro 2025
