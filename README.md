# DevFinder

## Deploying frontend (Vercel) with backend (Railway)

For the deployed app to work, frontend and backend must be wired correctly.

### 1. Vercel (frontend) environment variables

In your Vercel project → **Settings** → **Environment Variables**, add:

| Variable | Value | Notes |
|----------|--------|--------|
| `VITE_BASE_URL` | `https://devgram-production.up.railway.app` | Backend API URL (no trailing slash) |
| `VITE_APP_URL` | `https://www.devfinderapp.com` (optional) | Used for canonical links and Open Graph |

Redeploy after changing env vars so the new values are baked into the build.

### 2. Railway (backend) CORS

In your Railway backend service → **Variables**, add:

| Variable | Value |
|----------|--------|
| `ALLOWED_ORIGINS` | `https://www.devfinderapp.com,https://devfinderapp.com` (comma-separated if you have more domains) |

This allows the browser to call your API from the Vercel frontend. See `backend/railwaydeployment.md` for full backend setup.

---

## SEO

- **Meta & Open Graph:** Per-route titles and descriptions via `react-helmet-async`; default meta and OG tags in `index.html`.
- **Canonical & sitemap:** Set `VITE_APP_URL` in `.env` (e.g. `https://devfinder.app`) so canonical links and sitemap URLs are correct. Update `public/robots.txt` and `public/sitemap.xml` with your production domain.
- **Social image:** Add `public/og-image.png` (1200×630) for link previews; referenced as `/og-image.png` in meta tags.
- **Structured data:** JSON-LD `WebApplication` schema is in `index.html`; update the `url` there to match your domain.
- **Accessibility:** Skip-to-main-content link and semantic `<main>` for better crawlability and a11y.
