# BS Graphix — bsgraphix.com

Static, build-free, multi-page marketing site for **B.S. Graphix** — a Delhi/NCR integrated media solutions agency. Designed to be hosted on **GitHub Pages** at the custom domain `bsgraphix.com`.

## Stack

- **HTML5 + CSS3 + vanilla JS** — no build step, no framework runtime.
- **CDN libraries:** Font Awesome 6, Phosphor Icons, Google Fonts (Bricolage Grotesque + Plus Jakarta Sans).
- **Animations:** custom IntersectionObserver reveals, CSS keyframes, RAF-throttled mouse parallax, SVG path-draw, custom lightbox.

## Pages

| File              | Purpose                                                |
|-------------------|--------------------------------------------------------|
| `index.html`      | Home — hero, services preview, pillars, process, marquee, work preview, sectors, CTA |
| `about.html`      | Vision, mission, detailed process, six pillars         |
| `services.html`   | 6 core services (deep) + 5 integrated solution buckets + engagement model |
| `portfolio.html`  | Filterable masonry of work + featured website tiles    |
| `clients.html`    | Client roster grouped by Govt / Education / Corporate  |
| `contact.html`    | Mailto-only form + click-to-call + WhatsApp + maps     |
| `404.html`        | Friendly 404                                           |

## Folder structure

```
.
├── index.html · about.html · services.html · portfolio.html · clients.html · contact.html · 404.html
├── CNAME · .nojekyll · robots.txt · sitemap.xml · README.md
└── assets/
    ├── css/   tokens · reset · base · components · layout · animations · pages/*.css
    ├── js/    main.js · animations.js · portfolio.js · contact.js
    └── img/   logo/ · clients/ · portfolio/ · og/ · bg/
```

The original brand inputs (`B.S. Company Profile 2026.pdf`, `Logo/`, `Client Logos/`) live alongside the site at the project root and are NOT linked from the deployed site (search engines won't index them, but they're publicly reachable if linked — keep this in mind when committing). Move them into `_source/` if you want them out of the deploy root.

## Local preview

No build step. Serve the folder with any static server, e.g.:

```bash
# Python
python3 -m http.server 8080

# Node
npx --yes serve .
```

Then open http://localhost:8080.

## Deploy to GitHub Pages with custom domain

1. Push this directory to a GitHub repo (e.g. `bsgraphix-com` or `bsgraphix.github.io`).
2. In **Settings → Pages**, set source to `main` branch, root.
3. The included `CNAME` file binds the site to **bsgraphix.com**.
4. The included `.nojekyll` skips Jekyll processing so all files in `assets/` are served.
5. At the registrar for **bsgraphix.com**, configure:
   - **A records** for `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - **CNAME record** for `www` → `<your-username>.github.io`
6. Wait for DNS to propagate (usually 5–30 min) and tick **Enforce HTTPS** in Pages settings once the certificate provisions.

## Updating content

- **Client logos** — drop a transparent-BG PNG into `assets/img/clients/` using the existing semantic filenames; cells on `clients.html` and the home marquee will pick it up.
- **Portfolio tiles** — drop a JPG into `assets/img/portfolio/` and reference it in `portfolio.html`.
- **Copy** — search the relevant HTML page directly. Header and footer markup is duplicated across pages; edit each page if a nav/footer link changes (keeps the site framework-free).
- **Brand colors / type** — edit `assets/css/tokens.css` only.

## Asset prep notes (for posterity)

- The original 18 client logos came as Mac screenshots (`SCR-*.png`). They were trimmed, white-keyed to transparent, and renamed semantically by `/tmp/process_logos.py` (kept in repo if you want to re-run).
- The portfolio tiles were rendered from PDF pages 8–11 at 240 DPI and grid-cropped via `/tmp/crop_portfolio.py`.
- The brand mark `bs-graphix-mark.png` was derived from the supplied `Logo/Logo.png` (white background keyed to transparent). White and navy monochrome variants are included.

## Browser support

Modern evergreen browsers (Chrome / Edge / Safari / Firefox, last two versions). Honors `prefers-reduced-motion`. Fully responsive from 360px to 1920+.

---

© B.S. Graphix. *Stand out with B.S Graphix.*
