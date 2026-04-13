# check-mail.svg – Whitelabel Variables Documentation

## Overview

The check-mail icon has **3 whitelabelable colors** controlled from the Icon Gallery. All other colors are fixed and excluded from customization.

---

## 1. Variable List

| Input Label | CSS Variable | Default | Reusable |
|-------------|--------------|---------|----------|
| Badge | `var(--icon-badge, #CEBBFF)` | #CEBBFF | Any icon badge/accent |
| Body | `var(--icon-body, #E8DFFF)` | #E8DFFF | Any icon body/bg |
| Primary (envelope) | `var(--icon-primary, #614B98)` | #614B98 | Any icon primary color |

---

## 2. Where Each Variable Is Used – Inline SVG Code

### Variable 1: `--icon-badge`
**Element:** Notification badge (top-right purple circle). Reusable for other icons with badges.

```html
<path d="M290.902 65.2255H260.113V37.0766..." fill="var(--icon-badge, #CEBBFF)"/>
```

### Variable 2: `--icon-body`
**Element:** Large background area of mail/document body. Reusable for icon body/bg areas.

```html
<path d="M270.379 26.7939C270.159 26.7939..." fill="var(--icon-body, #E8DFFF)"/>
```

### Variable 3: `--icon-primary`
**Element:** Primary envelope color – drives both #614B98 and #7760B0. Reusable as main icon color.

```html
<!-- Left flap, right flap, bottom base -->
<path d="M170.849 156.392..." fill="var(--icon-primary, #614B98)"/>
<!-- Left/right flap folds -->
<path d="M169.705 157.662L118.056..." fill="var(--icon-primary, #7760B0)"/>
```

---

## 3. How the Variable System Works

### Flow (user change → preview → export)

```
1. User changes color in Icon Gallery
   └─> Stored in localStorage under key: whitelabel-icon-colors:check-mail.svg:light
       (or :dark for dark mode)

2. Preview updates
   └─> getPreviewUrl() loads SVG
   └─> getIconColorConfig() returns color config (with merge for envelope)
   └─> applySvgColors() replaces hex values in SVG string
   └─> Blob URL shown in preview

3. Download icon.zip
   └─> downloadIconZip() applies same logic
   └─> applySvgColors() replaces hex in both light & dark SVGs
   └─> Exported SVGs in icon.zip
```

### Code locations (`design_pages_new/icon-gallery.html`)

| Step | Function | Lines |
|------|----------|-------|
| Color config | `EXCLUDED_COLORS_BY_ICON['check-mail.svg']` | ~156 |
| Envelope merge | `getIconColorConfig()` – check-mail special case | ~366-372 |
| Replace logic | `applySvgColors()` | ~300-315 |
| Storage key | `COLORS_PREFIX + key` where key = `check-mail.svg:light` or `check-mail.svg:dark` | ~238-245 |

### applySvgColors logic

```javascript
// For each whitelabel slot:
colorConfig.colors.forEach(slot => {
  const hex = colorValues[slot.id] || slot.default;  // User value or default
  const toReplace = slot.replace || [slot.id];       // For envelope: ['#614B98','#7760B0']
  toReplace.forEach(oldHex => {
    out = out.replace(new RegExp(oldHex, 'gi'), hex); // Case-insensitive replace
  });
});
```

---

## 4. Storage

- **Key:** `whitelabel-icon-colors:check-mail.svg:light` or `whitelabel-icon-colors:check-mail.svg:dark`
- **Value:** JSON object, e.g. `{ "#CEBBFF": "#abc123", "#E8DFFF": "#fff8ff", "#614B98": "#6224ff" }`

---

## 5. Excluded (fixed) colors

These hex values are **not** whitelabelable and stay as in the SVG:

```
#DADADA, #F6F5F5, #102048, #F4EFFF, #ADC3FF, #86A7FF, #7760B0 (merged with #614B98),
#5B4DAD, #26AB23, #4E9AD2, #80C9FF, #F9B384, #EB5D60, #6837E2, #4C17D1, #E28B6D,
#3683BC, #1F3C88, #FBB81D, #FBC343, #32274F, #D9D9D9, #FFFFFF
```

---

## 6. Where Variables Are Defined (CSS)

### global.css
**Source vars** – first `:root` (light), second `:root` (dark):

```css
/* First :root – default/light */
--icon-primary-light: #614B98;
--icon-badge-light: #CEBBFF;
--icon-body-light: #E8DFFF;

/* Second :root – dark */
--icon-primary-dark: #614B98;
--icon-badge-dark: #CEBBFF;
--icon-body-dark: #E8DFFF;
```

### light.css
**Active vars** – `html[data-theme="light"]` and `@media (prefers-color-scheme: light)`:

```css
--icon-primary: var(--icon-primary-light);
--icon-badge: var(--icon-badge-light);
--icon-body: var(--icon-body-light);
```

### dark.css
**Active vars** – `html[data-theme="dark"]` and `@media (prefers-color-scheme: dark)`:

```css
--icon-primary: var(--icon-primary-dark);
--icon-badge: var(--icon-badge-dark);
--icon-body: var(--icon-body-dark);
```

### SVG usage
Use `var(--icon-primary)`, `var(--icon-badge)`, `var(--icon-body)` in any SVG. Same vars work for check-mail and other icons.
