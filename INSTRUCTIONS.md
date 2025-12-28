# 🚀 Project Setup Protocol (Scaffold v10.0.0)

This document guides the **Initialization of a New Project** using this
scaffold. If you are an LLM, follow this checklist sequentially to configure the
environment.

---

## 🏗️ Phase 1: Initialization

### 1.1 New Page Creation

- [ ] Duplicate the `_template/` folder and rename it to your desired slug.
  - Command: `cp -r _template/ my-new-page`
- [ ] Verify structure:
  ```
  my-new-page/
  ├── index.html   (Contains GSAP + Pico CSS + Analytics pre-configured)
  └── style.css    (For page-specific styles only)
  ```
- [ ] Update `<title>`, `<meta name="description">` and `og:tags` in
      `index.html`.

### 1.2 Global Configuration

- [ ] Open `css/global.css`.
- [ ] Update CSS Variables under `:root` to match client branding:
  - `--pico-primary`: Main brand color.
  - `--pico-primary-hover`: Darker shade for interactions.
  - `--pico-background-color`: Base background color (if overriding Pico
    default).

### 1.3 Tracking Setup

- [ ] Open `js/tracking.js`.
- [ ] Set `GTM_ID` constant with the client's GTM Container ID.
- [ ] Uncomment the initialization block.

---

## 🛠️ Phase 2: Environment & Netlify

### 2.1 Dependencies

- [ ] Run `npm install -g netlify-cli` (if not present).
- [ ] Check `netlify.toml` (standard config should be untouched).

### 2.2 Environment Variables

- [ ] Create `.env.local` for local development secrets:
  ```env
  TURNSTILE_SECRET=0x4AAAAAA... (Get from Cloudflare Dashboard)
  WEBHOOK_URL=https://n8n.webhook...
  ```
- [ ] Configure the same variables in **Netlify Dashboard > Site Configuration >
      Environment Variables**.

### 2.3 Cloudflare Turnstile

- [ ] Open `page-name/index.html` (or your new page).
- [ ] Find `<div class="cf-turnstile" data-sitekey="...">`.
- [ ] Replace `data-sitekey` with the public Site Key.

---

## 🚦 Phase 3: Development Workflow

### 3.1 Start Server

- [ ] Run command:
  ```bash
  npx netlify dev
  ```
- [ ] Access: `http://localhost:8888/your-page-slug/` (Trailing slash is
      mandatory!).

### 3.2 Feature Development

- **Animations:** Use `data-animate="fade-up"` (or fade-left, fade-right,
  scale-in, stagger).
- **Styles:** Build unique themes in `style.css`. Override Pico variables
  locally (`--pico-primary`, etc) to match the specific page style.
- **Layout:** Keep `main`, `header`, `footer` inside `#smooth-content`.

### 3.3 Form Testing

- [ ] Fill the form on localhost.
- [ ] Check console for:
  - `✅ intl-tel-input inicializado`
  - `✅ GTM inicializado`
- [ ] Verify successful submission.

---

## 📦 Phase 4: Production Deployment

### 4.1 Pre-Flight Check

- [ ] **Images:** Are all images using `/.netlify/images` format?
- [ ] **Mobile:** Did you test responsive layout on Chrome DevTools?
- [ ] **Performance:** `intl-tel-input` loading only on interaction?
- [ ] **Console:** No red errors in DevTools console?

### 4.2 Git & Deploy

1. Commit changes to a feature branch.
2. Push to remote.
3. Open Pull Request (Netlify will generate a Deploy Preview).
4. Review Preview URL.
5. Merge to `main` for Production Deploy.

---

## 📚 Component Reference

### Animation (GSAP)

Attributes for `js/animations.js`:

| Attribute                   | Effect                   |
| :-------------------------- | :----------------------- |
| `data-animate="fade-up"`    | Fade in moving up        |
| `data-animate="fade-left"`  | Fade in from left        |
| `data-animate="fade-right"` | Fade in from right       |
| `data-animate="scale-in"`   | Scale up (pop)           |
| `data-animate="stagger"`    | Staggers direct children |

**Smooth Wrapper:**

```html
<div id="smooth-wrapper">
  <div id="smooth-content">
    <!-- ALL VISIBLE CONTENT HERE -->
  </div>
</div>
```

### Forms

- Fields: `name`, `email`, `phone` (Strictly required).
- Redirect: Set `data-redirect="/obrigado/"` on `<form>`.

### Media

- **Images:** `/.netlify/images?url=/local/path.jpg&w=800&q=80`

### External Docs

- [Pico CSS Docs](https://picocss.com/)
- [Netlify Image CDN](https://docs.netlify.com/image-cdn/overview/)
- [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/)

---

**Version:** 10.0.0 **Last Updated:** December 2025
