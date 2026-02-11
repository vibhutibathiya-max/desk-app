# White-Label Theme Preview & Export

## Overview
Full whitelabel solution – customers customize colors **and upload assets** from the portal. No code changes required. Export a ZIP and extract to project root.

## How to Use

### 1. Live Preview
Open **`whitelabel-preview.html`** in a browser:
- Select any design page from the dropdown to preview
- Use **Light** / **Dark** toggle to switch theme mode
- Change colors in the left panel – **changes apply live**
- Upload images/folder – **preview updates immediately**

### 2. Upload Assets
- **Upload Images** – Select one or more files (logo-color.svg, logo.svg, logo-header.svg, etc.)
- **Upload Folder** – Select a folder with structure: `assets/img-new/`, `public/app-icon/logo/`, etc.
- Use same filenames as the project (logo-color.svg, logo.svg, arrow-down.svg, etc.)
- Supported: .svg, .png, .jpg, .jpeg, .gif, .webp

### 3. Export Full Theme (ZIP) – Recommended
Click **Export Full Theme (ZIP)** to download:
- `assets/css/global.css` (your color customizations)
- All uploaded assets in correct folder structure
- Extract ZIP to project root – **no code changes needed**

### 4. Other Exports
- **Export global.css** – CSS only (if no assets)
- **Export Theme JSON** – Backup / alternative format

## Which images can I change?
| Asset | Filename | Where it appears |
|-------|----------|------------------|
| Login logo | logo-color.svg | Login page |
| Header logo | logo-header.svg | Navbar, all pages |
| Device illustration | right-side-vector.svg | Login page |
| Login curves bg | curves.svg | Login background |
| Status icons | online.svg, away.svg, busy.svg, dnd.svg | Contact list |
| Sidebar icons | logout.svg, blind-trasferred.svg, etc. | public/app-icon/icon/light & dark |

## Asset Paths (for folder upload)
| Path | Contents |
|------|----------|
| `assets/img-new/` | Logo, status icons, UI icons |
| `public/app-icon/logo/` | Header logo (logo-header.svg, logo.svg, logo-white.svg) |
| `public/app-icon/icon/light/` | Light mode sidebar & app icons |
| `public/app-icon/icon/dark/` | Dark mode sidebar & app icons |

## GitHub Pages (Live Link)

To share the preview as a live link:

1. Push this repo to GitHub.
2. Go to **Settings > Pages** in the **repo** (not account settings).
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Select branch **gh-pages** and folder **/ (root)**.
5. Save. Push to `main` – the workflow deploys to `gh-pages` automatically.

**Live URL:** `https://<username>.github.io/<repo-name>/`  
The root redirects to the whitelabel preview. Direct link: `.../design_pages_new/whitelabel-preview.html`

## Technical Notes
- Pure HTML/CSS – no build required
- **All 103 CSS variables** from `global.css` are configurable
- **No code changes** – user uploads, previews, exports ZIP, extracts to project
