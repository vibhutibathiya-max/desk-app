# White Label Theme Manager

## Features

- Theme color customization
- Live preview
- Upload Theme File (.css/.js)
- Download Theme File (RN `theme.js`)
- **Image Gallery** — centralized branding asset management
- Export assets as `tragofone-assets.zip`
- Dynamic CSS variables
- White-label support

## Run

```bash
npm install
npm start
```

Open [http://localhost:8080/index.html](http://localhost:8080/index.html).

## Theme workflow

Upload Theme → Preview Updates → Download Theme

## Image Gallery workflow

1. Click **Image Gallery** in the white-label panel
2. Browse assets by section (Logos, Device images, Icons, Other)
3. **Upload** — replace a single asset; all screens update instantly
4. **Preview** — jump to screens where that asset is used
5. **Reset** — restore the original static file
6. **Reset All** / **Export Assets** — bulk actions in the gallery header

Supported image types: `.png`, `.jpg`, `.jpeg`, `.svg`, `.webp`

## Architecture

| File | Purpose |
|------|---------|
| `js/assets/asset-registry.js` | `ASSET_MAP` / `ASSET_REGISTRY` — canonical asset definitions |
| `js/assets/asset-manager.js` | Upload, reset, state, DOM application |
| `js/assets/asset-resolver.js` | Binds `data-asset-key` on screen markup |
| `js/assets/image-gallery.js` | Full-page gallery UI |
| `js/assets/asset-export.js` | ZIP export (JSZip) |

Screens use `data-asset-key="ASSET_KEY"` on `<img>` elements. All replacements flow through `AssetManager.getUrl(key)`.

## Supported theme files

- `theme.js` (web or React Native format)
- `.css` with theme variables

## Dependencies

- [JSZip](https://stuk.github.io/jszip/) — asset ZIP export
