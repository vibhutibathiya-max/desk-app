# Tragofone White-Label Studio

One place to brand the Tragofone apps. Two white-label tools — **mobile** and
**desktop** — served by a single local Node server behind a shared sign-in and
a platform chooser.

## Run it

```bash
git clone https://github.com/vibhutibathiya-max/desk-app.git
cd desk-app/whitelabeler && npm install   # installs sharp + jszip
cd ..  && npm start                        # -> http://localhost:8080
```

> `npm install` must run inside `whitelabeler/` — that is where `sharp`
> (iOS app-icon generation) and `jszip` (package export) resolve from. The
> repo root has no dependencies of its own.

Then open **http://localhost:8080**:

1. **Sign in / Sign up** (`index.html`) — accounts are stored client-side in
   `localStorage`. New user → Sign up; returning user → Sign in.
2. **Choose a platform** (`choose.html`) — Mobile or Desktop.
3. Brand, preview, and export. **Switch** / **Logout** are available in both
   tools.

## What's inside

| Path | What it is |
|------|------------|
| `server.mjs` | Single dev server for the whole repo. Endpoints: `POST /api/theme` (saves the mobile `theme.js`), `POST /api/ios/generate-app-icons` (sharp). Sends `no-cache`. |
| `index.html` | Sign in / Sign up entry page. |
| `choose.html` | Platform chooser (guarded — redirects to login without a session). |
| `assets/wl-studio.css` | Shared design tokens (one palette for the whole studio). |
| `whitelabeler/` | **Mobile** tool — 14 RN screens, theme + asset pipeline, exports `tragofone.zip` (Android + iOS). |
| `design_pages_new/` | **Desktop** tool — `whitelabel-preview.html` (38 screens, per-client themes, exports `global.css`) and `logo-gallery.html` (image/logo ZIP export). |

## Auth note

Sign in / sign up is **client-side only** (accounts and passwords live in
`localStorage`, unencrypted). It is a demo/preview gate, not real security.
A public deployment that needs genuine accounts requires a backend with
hashed credentials.
