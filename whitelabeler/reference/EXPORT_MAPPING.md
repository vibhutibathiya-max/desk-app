# Epicrange Package Export — Mapping Report

**Canonical source:** `reference/zips/epicrange.zip` and `reference/zips/epicrange_only_icons.zip`

Regenerate all export metadata from the ZIPs:

```bash
npm run generate:export-manifest
# or with explicit paths:
node scripts/generate-export-manifest.mjs /path/to/epicrange.zip /path/to/epicrange_only_icons.zip
```

This writes:

| Output | Purpose |
|---|---|
| `reference/epicrange/package-manifest.json` | File list parsed from `epicrange.zip` (`app/` scope) |
| `reference/epicrange_only_icons/package-manifest.json` | Full icons zip index (Android/iOS — future export) |
| `reference/epicrange/app/**` | Extracted reference bytes |
| `js/assets/export-config.js` | Runtime export config (auto-generated) |

**Do not hardcode filenames in JS.** Paths and names come from the ZIP via `scripts/generate-export-manifest.mjs`.

---

## Folder hierarchy (exported `tragofone.zip`)

No wrapper folder — paths are at the ZIP root (read from `epicrange.zip`, `app` + `patches` scopes):

```
tragofone.zip
├── app/
│   ├── assets/
│   │   ├── theme.js
│   │   └── images/
│   └── utils/
│       └── GlobalDefines.js
└── patches/
    └── react-native-push-notification+8.1.1.patch
```

Reference bytes are stored under `reference/epicrange/` (source ZIP inner folder name).

---

## Gallery → package links

Semantic mapping lives in `reference/export-asset-links.json` (registry key → path).

**Every path is validated against `epicrange.zip` at generation time.** If a path is not in the ZIP, generation fails.

Current links (paths from ZIP, not invented):

| Registry key | Path in ZIP |
|---|---|
| `HEADER_LOGO_DARK` | `app/assets/images/company_logo_white.png` |
| `LOGIN_LOGO` | `app/assets/images/dialpad_full_logo.png` |
| `APP_LOGO` | `app/assets/images/trago_gradient_logo.png` |
| `AUDIO_NOTIFICATION` | `app/assets/images/audio_notification.png` |
| `VIDEO_NOTIFICATION` | `app/assets/images/video_notification.png` |
| `DOCUMENT_NOTIFICATION` | `app/assets/images/document_notification.png` |
| `TECHNOLOGY_PATTERN` | `app/assets/images/splash_bg_pattern.png` |
| `BROKEN_CONNECTION` | `app/assets/images/no_internet_connected.png` |

All other `app/assets/images/*` files from the ZIP are **static** (copied from reference).

---

## Export rules

| File type | Behavior |
|---|---|
| `app/assets/theme.js` | Generated from ZIP template + color pickers |
| Linked gallery asset | Uploaded blob or preview original; **ZIP filename unchanged** |
| All other manifest files | Copied from `reference/epicrange/` |

---

## Icons ZIP (`epicrange_only_icons.zip`)

Indexed at `reference/epicrange_only_icons/package-manifest.json` (111 files: Android mipmaps, iOS AppIcon, `app/assets/images`, etc.).

Not exported in the app package yet — reserved for a later Android/iOS export task.

---

## Verification

```bash
node scripts/verify-package-export.mjs
```
