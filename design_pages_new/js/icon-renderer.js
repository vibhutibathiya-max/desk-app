/**
 * Icon Renderer - Replaces [data-icon] elements with inline SVG from registry.
 * Icons use currentColor; set color: var(--icon-color, var(--primary-color)) on parent.
 * For icons without inline (complex illustrations), keeps img fallback.
 */
(function () {
    'use strict';
    var ICONS = window.WHITELABEL_ICONS;
    if (!ICONS) return;

    function renderIcons() {
        var containers = document.querySelectorAll('[data-icon]');
        containers.forEach(function (el) {
            var name = el.getAttribute('data-icon');
            if (!name) return;
            var baseName = name.replace(/\.svg$/, '');
            var svg = ICONS.get(baseName);
            if (svg) {
                var wrap = document.createElement('span');
                wrap.className = 'icon-inline icon-' + baseName;
                wrap.style.color = 'var(--icon-color, var(--primary-color))';
                wrap.style.display = 'inline-flex';
                wrap.style.alignItems = 'center';
                wrap.style.justifyContent = 'center';
                wrap.innerHTML = svg;
                var inner = wrap.querySelector('svg');
                if (inner) {
                    inner.style.width = '100%';
                    inner.style.height = '100%';
                    inner.style.display = 'block';
                    var w = el.getAttribute('data-icon-width');
                    var h = el.getAttribute('data-icon-height');
                    if (w) wrap.style.width = w;
                    if (h) wrap.style.height = h;
                }
                el.parentNode.replaceChild(wrap, el);
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderIcons);
    } else {
        renderIcons();
    }
})();
