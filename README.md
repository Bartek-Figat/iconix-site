# Iconix website

Next.js site that shows every icon from `@iconix/icons`, with search, category filter,
a light theme by default (dark theme toggle in the header) and a popup for each icon:

- **Customize**: color, size, stroke width, shape (none / circle / square), background, rotate, flip
- **Where can I use it?**: tabs for React, Next.js, Vue / Nuxt, HTML, JavaScript, CSS, SVG, CLI with a ready example for that icon
- **Animation**: pick spin, pulse, draw, bounce, heartbeat, shake, ring, float or blink, press **Start** and copy the code
- Download SVG, copy SVG, copy component name; ← / → switch icons, Esc closes; links like `/#icon=valve` open an icon directly

## Run it

```bash
npm install        # Windows PowerShell: npm.cmd install
npm run dev        # http://localhost:3000
```

The site uses `@iconix/icons@^1.1.0`. If 1.1.0 is not on npm yet, install the bundled package first:

```bash
npm install ./iconix-icons-1.1.0.tgz
```

## Publish on GitHub Pages

The project is ready for GitHub Pages: `next.config.ts` exports a static site to `out/`
and `.github/workflows/deploy.yml` builds and deploys it on every push to `main`.

1. Publish `@iconix/icons@1.1.0` to npm first (the build installs it from npm),
   or keep `iconix-icons-1.1.0.tgz` in the repository.
2. Create a new repository on GitHub, for example `iconix-site`.
3. Push this folder:
   ```bash
   git init
   git add .
   git commit -m "Iconix website"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/iconix-site.git
   git push -u origin main
   ```
4. On GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
5. Open the **Actions** tab and wait for "Deploy to GitHub Pages" to finish (about 2 minutes).
   The site is live at `https://YOUR-USERNAME.github.io/iconix-site/`.

The workflow sets the base path (`/iconix-site`) automatically from the repository name.
To use your own domain, add it in Settings → Pages → Custom domain.

## Production (own server)

```bash
npm run build   # static files in ./out
```

The page is fully static, so `out/` can be hosted anywhere: GitHub Pages, Netlify, Cloudflare Pages, Vercel or any web server.

## Files

```
app/layout.tsx                 theme script (light by default, remembers the choice)
app/page.tsx                   hero, gallery, usage, compatibility, options
app/components/IconGallery.tsx search, filters, grid
app/components/IconDialog.tsx  popup: preview, customizer, usage tabs
app/components/AnimationDemo.tsx animation picker with Start/Stop and code
app/lib/snippets.ts            code examples generated from the current options
app/lib/animations.ts          animation CSS
app/globals.css                design tokens for light and dark themes
```
