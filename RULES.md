# CORE RULES !IMPORTANT

These rules are INVARIABLE and must be followed throughout the project's
lifecycle. They prevent critical errors and ensure architectural integrity.

## 🏆 GOLDEN RULE: LANGUAGE

- **User Communication:** ALWAYS communicate with the user in **Brazilian
  Portuguese (pt-BR)**.
- **Application Language:** The website content, HTML `lang` attribute, and
  user-facing text must ALWAYS be in **Brazilian Portuguese (pt-BR)**.
- **Exceptions:** Code comments and commit messages can be in English or
  Portuguese, but user interaction is strictly pt-BR.

## 1. Stack & Technology (Non-Negotiable)

- **Frontend:** HTML5 + CSS3 + Vanilla JavaScript ONLY.
- **CSS Framework:** Pico CSS (Self-hosted @ `css/pico.classless.min.css`). DO
  NOT use CDN for the base CSS.
- **Animations:** GSAP + ScrollTrigger + ScrollSmoother (Use the Free version
  via `jsdelivr` CDN).
- **NEVER Introduce:** React, Vue, Tailwind, Bootstrap, jQuery, or Sass/Less
  preprocessors.

## 2. File Structure & Routing

- **New Pages:** DUPLICATE the `_template/` folder.
- **Routing:** Always use "Pretty URLs" (folders):
  - ✅ Correct: `new-page/index.html` (Accessible via `/new-page/`)
  - ❌ Forbidden: `new-page.html`
- **CSS Imports:** `global.css` -> `components.css` -> `style.css` (local).
- **Mandatory Wrapper:** All visible content (`header`, `main`, `footer`) MUST
  be inside `<div id="smooth-wrapper"><div id="smooth-content">`.

## 3. Performance & Images

- **Images:** MUST use Netlify Image CDN for ALL local images.
  - Syntax: `/.netlify/images?url=/images/file.jpg&w=WIDTH&q=80`
  - Always include `loading="lazy"` (except for LCP/Hero image).
- **Heavy Libs:** `intl-tel-input` must be lazy-loaded (already configured in
  `js/form.js`).
- **Assets:** Use `preconnect` links for external domains (jsdelivr,
  cloudflare).

## 4. Styling & Design

- **Baseline:** Use Pico CSS (`global.css`) only as a starting point (Reset and
  structural).
- **Theming:** Visual customization MUST happen in each page's `style.css`.
- **Flexibility:** It is ALLOWED and ENCOURAGED to override CSS variables and
  create specific Design Systems for each Landing Page (unique themes).
- **Layout:** Header, Main, and Footer inside `#smooth-content` inherit the
  width fix from `global.css`, but can be freely modified in local CSS if
  needed.

## 5. JavaScript & Interactivity

- **Standard Animations:** Use HTML attributes whenever possible
  (`data-animate="fade-up"`). Avoid creating JS Timelines for simple entry
  animations.
- **Forms:**
  - Field names are immutable: `name`, `email`, `phone`.
  - Mandatory attributes: `data-form`, `data-redirect`.
  - Mandatory Captcha: Cloudflare Turnstile.
- **Functions:** Netlify Functions V2 only
  (`export default async function handler(request)...`).

## 6. Development & Deploy

- **Local Command:** `npx netlify dev` (NEVER use live-server or python http).
- **Workflow:** Work on feature branches. NEVER push directly to `main` without
  validation.
- **Environment:** Use `.env.local` for local secrets (`TURNSTILE_SECRET`).

## 7. Tracking & Analytics

- **GTM:** Centralized in `js/tracking.js`. Do not inject tracking scripts
  (Pixel/GA4) directly into HTML.
- **Events:** Use `window.dispatchEvent` or helpers from `tracking.js` for
  custom events.
