# How Icon Gallery Changes Flow to Preview Pages

## Flow

1. **Icon Gallery** (`icon-gallery.html`)
   - You change colors in the sidebar (Light/Dark)
   - Colors are saved to `localStorage` under key `whitelabel-icon-colors:shared-gradient`

2. **icon-svg-inline.js** (loaded by each preview page)
   - Reads `whitelabel-icon-colors:shared-gradient` from localStorage
   - Injects CSS overrides into `:root` (e.g. `--icon-gradient-1-light`, `--icon-fg-dark`)
   - Finds `<img src="...app-icon/icon/...">` and replaces with inline SVG from the pasted ICONS
   - Inline SVG uses `var(--icon-*)` so it inherits your custom colors

3. **Whitelabel Preview** (`whitelabel-preview.html`)
   - Loads the selected page (e.g. setting.html) in an **iframe**
   - Iframe and Icon Gallery share the same origin → same localStorage
   - When the iframe loads a page, that page runs icon-svg-inline.js → colors appear

## What You Need To Do

**Add this script to every design page that can be previewed and shows icons:**

```html
<script src="../assets/js/icon-svg-inline.js"></script>
```

Place it in `<head>` or before `</body>` on each page.

## Pages With icon-svg-inline.js (all preview pages)

- login.html
- call_history.html
- call_connecting.html
- call_connecting_video.html
- active_call_dtmf.html
- add_group_member.html
- all_contact.html
- contact_detail.html
- group_chat_edit.html
- group_chat_with_admin_alarts.html
- incoming_call_popup.html
- in-coming-call-notification.html
- attachment_preview.html
- loader.html
- chat_loader.html
- autostartup.html
- setting.html
- checkmail.html

logo-gallery.html and icon-gallery.html manage their own assets and don't need it.
