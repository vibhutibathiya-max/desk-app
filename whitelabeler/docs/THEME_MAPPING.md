# White-Label Theme Mapping

Source of truth: `js/theme/theme.js` (derived from RN `Theme.txt`)

## Eligible vs untouched

| Region | Lines in Theme.txt | Action |
|--------|-------------------|--------|
| White-label section | 21–142 (`// ✅ COLORS...` through `CHAT_RECEIVED`) | Theme variables + CSS refactor |
| Below ❌ marker | 145+ (`MAIN_BG`, grays, network badges, etc.) | **Do not modify** |

## Mapping table (white-label colors → CSS)

| Theme Variable | Color | CSS files / usage |
|----------------|-------|-------------------|
| `GRADIENT_1` | `#6533E2` | `variables.css` — `--gradient-home-header`, `--gradient-status-save`, `--color-bottom-nav-active`, `--color-surface-brand` |
| `GRADIENT_2` | `#7349DE` | `variables.css` — contacts header stop (`var(--GRADIENT_2)`), computed gradients |
| `GRADIENT_3` | `#1F97EF` | `variables.css` — gradients, `--color-mms-audio-track`, `--gradient-button-primary` |
| `GRADIENT_4` | `#57A1D7` | `variables.css` — `--gradient-home-header`, `--gradient-main` |
| `PRIMARY_COLOR` | `#604D99` | Theme only (no exact hex in CSS today); picker demo target |
| `PRIMARY_DARK_COLOR` | `#5834D3` | `variables.css` — brand/onboarding; `index.html` `theme-color` via JS |
| `CHAT_ICON_COLOR_RECIVER` | `#614B98` | `variables.css` — login accent, chats FAB/avatar, contacts, SMS send, MMS, settings section; `components.css` — `.btn--secondary` |
| `CHAT_SENDER_BUBBLE_BACKGROUND` | `#C4E5FF` | `variables.css` — SMS/MMS outgoing bubbles |
| `CHAT_RECIVER_BUBBLE_BACKGROUND` | `#E0E0E0` | `variables.css` — MMS incoming bubble |
| `HINT_TEXT_Y` | `#474747` | `variables.css` — chats/messages preview, settings items |
| `POLICY_TEXT_COLOR` | `#57A1D7` | Available via ThemeManager; link accent `#57c4f0` unchanged (not in theme) |
| `HEADER_TINT_COLOR` | `#ffffff` | Available via ThemeManager |
| `PRIMARY_WHITE_TEXT` | `#ffffff` | Maps to existing `--color-foreground-on-brand` pattern |

## Not replaced (below ❌ or no exact match)

| CSS value | Reason |
|-----------|--------|
| `#e8e8ed` | SMS incoming — not exact theme key (`DIALOG_IOS` below ❌) |
| `#57c4f0` | Link accent — not in white-label section |
| `#f53e47`, `#e6404e` | Badges — `LOW_NETWORK` below ❌ |
| `#949494` | Login subtitle — `LED_GRAY_COLOR` below ❌ |
| `#5b4fc9`…`#7a52e3` | Contacts header gradient — custom blend, not `GRADIENT_COLORS` array |

## Runtime flow

1. `theme.js` exports `TRAGO_DEFAULT_THEME` with `GRADIENT_1`…`GRADIENT_4` + white-label keys
2. `ThemeManager.apply()` injects `--KEY: value` on `:root`
3. `variables.css` references `var(--GRADIENT_1)`, `var(--CHAT_ICON_COLOR_RECIVER)`, `var(--CSS_GRADIENT_*)`, etc.
4. `theme-settings.js` color picker panel (right sidebar) updates theme state → `ThemeManager.apply()` → instant UI update
5. `components.css` — `.theme-settings` panel styles; `.btn--secondary` uses `var(--color-login-accent)` → `var(--CHAT_ICON_COLOR_RECIVER)`
