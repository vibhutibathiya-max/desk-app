# Whitelabel Color Variables Reference

## How to Find Which Icons/Elements Use Which Variable

### Inline Icon Icons (use `--icon-color` → fallback `--primary-color`)

These icons change when you set **Icon Color** in Icon Gallery or Theme panel:

| Icon Name | Variable | Where Used |
|-----------|----------|------------|
| done | `--icon-color` | setting.html (re-register done state) |
| logout | `--icon-color` | call_connecting.html (logout modal) |
| autoStartup | `--icon-color` | call_connecting.html (autoStartup modal) |
| blind-trasferred | `--icon-color` | call_connecting.html (blind transfer modal) |
| re-register | `--icon-color` | setting.html |
| clear-history | `--icon-color` | (when data-icon used) |
| export-icon | `--icon-color` | (when data-icon used) |
| import-icon | `--icon-color` | (when data-icon used) |
| web-socket-connection | `--icon-color` | (when data-icon used) |

**Value changed:** `--icon-color` (or `--primary-color` if icon color not set)  
**Where to change:** Icon Gallery → Icon Color picker, OR Theme panel → Icon Color

---

## Theme Panel Variables (whitelabel-config.json)

| Config Key | CSS Variable(s) | Affects |
|------------|-----------------|---------|
| primaryColor | `--primary-color`, `--sidebar-active-icon`, `--received-chat-bubble-file-icon-light` | Brand color, sidebar icons, chat file icons |
| iconColor | `--icon-color` | Inline SVG icons (done, logout, etc.) |
| secondaryColor | `--secondary-color` | Secondary accents |
| mainGradientStart | `--main-gradient-color` | Main gradient backgrounds |
| headerGradient | `--header-gadient-color` | Header backgrounds |
| buttonGradient | `--button-gradient` | Button backgrounds |
| dynamicBarColor | `--dynamic-bar-color` | Dynamic bar element |
| dynamicBarIconColor | `--dynamic-bar-icon-color` | Dynamic bar icons |
| crmPrimaryLight | `--crm-primary-light` | CRM primary background |
| tertiary | `--tertiary-light` | Tertiary accents |
| inputIconColor | `--input-icon` | Input field icons (settings, contact, chat) |
| labelColor | `--label-color` | Labels, links (--label-icon derives from this) |
| hoverIconColor | `--hover-icon` | Icon hover background |

---

## Other Colors in global.css (optional extras)

Add these to `whitelabel-config.json` if you want users to customize them:

| Variable | Default | Affects |
|----------|---------|---------|
| `--input-icon` | var(--primary-color) | Input field icons |
| `--label-icon` | var(--label-color) | Label icons |
| `--hover-icon` | #e3e3e3 | Hover icon background |
| `--sidebar-active-icon` | #614b98 | Sidebar active state icon |
| `--received-chat-bubble-file-icon-light` | #614b98 | Received chat file icon |

---

## Complex Icons (use img, not variables)

These load from `public/app-icon/icon/light/` and `dark/` – replace via Icon Gallery **Upload**:
- check-mail, no-calls-found, no-contacts-found, no-favoritecontact-found
- qr-vector, cloud-contact-banner, start-chat, api-test-connection

---

## Adding a New Customizable Color

1. Add to `whitelabel-config.json`:
```json
"myNewColor": { "var": "--my-new-var", "value": "#hex", "label": "My Label" }
```

2. Add to `GLOBAL_CSS_MAP` in whitelabel-preview.html (for export).
3. Add default in `assets/css/global.css` if needed.
