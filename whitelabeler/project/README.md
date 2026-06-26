# Tragofone Mobile — Splash Screen

Production-quality HTML/CSS implementation of the Tragofone splash screen, extracted from the Figma design file.

## Quick start

Open `index.html` in a browser or serve the `project/` directory with any static file server:

```bash
cd project
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Project structure

```
project/
├── index.html
├── css/
│   ├── variables.css   # Design tokens (colors, spacing, typography)
│   ├── reset.css       # Base reset
│   ├── layout.css      # App shell layout primitives
│   ├── components.css  # Reusable components
│   └── page.css        # Splash-specific overrides
├── assets/
│   ├── images/         # Logo mark and wordmark PNGs
│   └── icons/          # SVG utility icons
└── README.md
```

## Components

| Component        | Class              | Reuse                          |
|------------------|--------------------|--------------------------------|
| App screen shell | `.app-screen`      | Splash, auth, onboarding       |
| Brand logo mark  | `.brand-logo`      | Headers, splash, about         |
| Brand wordmark   | `.brand-wordmark`  | Splash footer, marketing       |
| Corner badge     | `.app-badge`       | Version / utility indicators   |

## Design tokens

Gradient colors are defined in `css/variables.css` and match the Figma **Main Gradient** tokens:

- `#6533E2`, `#7349DE`, `#1F97EF`, `#57A1D7`

## Assets

- `assets/images/logo-mark.png` — central splash icon
- `assets/images/wordmark.png` — bottom lockup
- `assets/icons/app-badge.svg` — placeholder for bottom-left utility icon

Replace `app-badge.svg` with the final Figma export when available.

## Browser support

Modern evergreen browsers with support for CSS custom properties, `100dvh`, and `clamp()`.
