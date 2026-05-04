/**
 * Applies Logo Gallery / Icon Gallery "preview" uploads from localStorage so
 * static design pages show the same assets as the galleries. Fixes matching for
 * keys like preview-asset:icon-light:check-mail.svg (old inline scripts only
 * used preview-asset:filename and could not find icons).
 */
(function () {
    'use strict';
    var PREFIX = 'preview-asset:';
    var ICON_L = 'preview-asset:icon-light:';
    var ICON_D = 'preview-asset:icon-dark:';

    function apply() {
        try {
            var keys = (window.__wl_ls_keysMatching
                ? window.__wl_ls_keysMatching(PREFIX)
                : Object.keys(localStorage).filter(function (k) {
                    return k.indexOf(PREFIX) === 0;
                }));
            keys.sort(function (a, b) {
                var oa = a.indexOf(ICON_L) === 0 ? 0 : a.indexOf(ICON_D) === 0 ? 1 : 2;
                var ob = b.indexOf(ICON_L) === 0 ? 0 : b.indexOf(ICON_D) === 0 ? 1 : 2;
                if (oa !== ob) return oa - ob;
                return a.localeCompare(b);
            });
            keys.forEach(function (key) {
                var dataUrl = localStorage.getItem(key);
                if (!dataUrl) return;
                if (key.indexOf(ICON_L) === 0) {
                    var b = key.slice(ICON_L.length);
                    var n = document.querySelectorAll('img[src*="/light/"][src*="' + b + '"],img[src*="/icon/light/"][src*="' + b + '"]');
                    if (!n || n.length === 0) {
                        n = document.querySelectorAll('img[src*="' + b + '"]');
                    }
                    n.forEach(function (img) {
                        if (img.classList && img.classList.contains('js-icon-bridge-mail')) return;
                        img.setAttribute('src', dataUrl);
                    });
                    return;
                }
                if (key.indexOf(ICON_D) === 0) {
                    var b2 = key.slice(ICON_D.length);
                    var d = document.querySelectorAll('img[src*="/dark/"][src*="' + b2 + '"],img[src*="/icon/dark/"][src*="' + b2 + '"]');
                    if (!d || d.length === 0) {
                        if (localStorage.getItem(ICON_L + b2)) return;
                        d = document.querySelectorAll('img[src*="' + b2 + '"]');
                    }
                    d.forEach(function (img) {
                        if (img.classList && img.classList.contains('js-icon-bridge-mail')) return;
                        img.setAttribute('src', dataUrl);
                    });
                    return;
                }
                var filename = key.slice(PREFIX.length);
                if (filename.indexOf('icon-') === 0 && filename.indexOf(':') !== -1) return;
                document.querySelectorAll('img[src*="' + filename + '"]').forEach(function (img) {
                    img.setAttribute('src', dataUrl);
                });
            });
        } catch (e) { /* noop */ }
    }

    apply();
    window.addEventListener('storage', function (e) {
        var logical = window.__wl_physicalKeyToLogical ? window.__wl_physicalKeyToLogical(e.key || '') : (e.key || '');
        if (logical && logical.indexOf(PREFIX) === 0) apply();
    });
})();
