/**
 * When Icon Gallery has saved shared gradient colors (localStorage), apply the same
 * resolved values on this page so Preview matches the gallery.
 *
 * Why Preview looked "stuck": gallery only mutates previews inside icon-gallery.html;
 * <img src="*.svg"> loads SVG as an external image — CSS variables on the HTML page
 * do not apply to it. Inline SVG (e.g. logout modal) would follow :root vars, but
 * those vars were never updated from gallery storage until this bridge runs.
 */
(function () {
    'use strict';

    var COLORS_PREFIX = 'whitelabel-icon-colors:';
    var SHARED_KEY = 'shared-gradient';

    function toHex6(hex) {
        if (!hex || !/^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(String(hex).trim())) return null;
        var h = String(hex).trim().replace(/^#/, '');
        if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
        return '#' + h.toLowerCase();
    }

    function readStoredShared() {
        try {
            var raw = localStorage.getItem(COLORS_PREFIX + SHARED_KEY);
            if (raw == null) return null;
            var o = JSON.parse(raw);
            return typeof o === 'object' && o !== null ? o : null;
        } catch (e) {
            return null;
        }
    }

    function def(stored, id, defaultHex) {
        var k = Object.keys(stored || {}).find(function (x) {
            return x.toLowerCase() === id.toLowerCase();
        });
        var v = k ? stored[k] : null;
        return toHex6(v) || toHex6(defaultHex) || defaultHex;
    }

    function buildResolvedMap(stored) {
        var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        var g1 = def(stored, '#6533E2', '#6533E2');
        var g2 = def(stored, '#7349DE', '#7349DE');
        var g3 = def(stored, '#1F97EF', '#1F97EF');
        var g4 = def(stored, '#57A1D7', '#57A1D7');
        var bgDone = def(stored, '#E8DFFF', '#E8DFFF');
        var bgWs = def(stored, '#614B98', '#614B98');
        var badge = def(stored, '#CEBBFF', '#CEBBFF');
        var fgDark = def(stored, '#D9D9D9', '#D9D9D9');
        var bgWsDark = def(stored, '#BDBBC4', '#BDBBC4');
        if (isDark) {
            var pD = def(stored, '#614B98', '#614B98');
            return {
                '--icon-gradient-1': fgDark,
                '--icon-gradient-2': fgDark,
                '--icon-gradient-3': fgDark,
                '--icon-gradient-4': fgDark,
                '--icon-bg-done': fgDark,
                '--icon-bg-websocket': bgWsDark,
                '--icon-body': def(stored, '#E8DFFF', '#E8DFFF'),
                '--icon-primary': pD,
                '--icon-badge': def(stored, '#CEBBFF', '#CEBBFF'),
                '--icon-fg-dark': fgDark
            };
        }
        return {
            '--icon-gradient-1': g1,
            '--icon-gradient-2': g2,
            '--icon-gradient-3': g3,
            '--icon-gradient-4': g4,
            '--icon-bg-done': bgDone,
            '--icon-bg-websocket': bgWs,
            '--icon-badge': badge,
            /* Same as icon-gallery getSharedPreviewVars / resolveSvgVars for check-mail (var w/ fallbacks) */
            '--icon-body': bgDone,
            '--icon-primary': bgWs
        };
    }

    function applyRootVars(map) {
        var root = document.documentElement;
        Object.keys(map).forEach(function (k) {
            root.style.setProperty(k, map[k]);
        });
    }

    /**
     * Same shared-gradient slots as icon-gallery.html (SHARED_COLORS_LIGHT + DARK), merged with stored.
     * qr-vector.svg is hex-based; we apply the same replacements as the gallery (ICONS_SAME_LIGHT_DARK → always light palette).
     */
    var BRIDGE_SHARED_COLORS_LIGHT = [
        { id: '#6533E2', default: '#6533E2', replace: ['#6533E2', '#6837E2'] },
        { id: '#7349DE', default: '#7349DE' },
        { id: '#1F97EF', default: '#1F97EF' },
        { id: '#57A1D7', default: '#57A1D7' },
        { id: '#E8DFFF', default: '#E8DFFF' },
        { id: '#614B98', default: '#614B98', replace: ['#614B98', '#7760B0'] },
        { id: '#CEBBFF', default: '#CEBBFF' }
    ];
    var BRIDGE_SHARED_COLORS_DARK = [
        { id: '#D9D9D9', default: '#D9D9D9' },
        { id: '#BDBBC4', default: '#BDBBC4' }
    ];

    function getReplacePatterns(hexId) {
        var h = String(hexId);
        var lower = h.toLowerCase();
        return h === lower ? [h] : [h, lower];
    }
    function getDefaults(config) {
        var o = {};
        (config && config.colors || []).forEach(function (c) { o[c.id] = c.default; });
        return o;
    }
    function getColorValue(colorValues, slotId) {
        if (colorValues[slotId] !== undefined && colorValues[slotId] !== null) return colorValues[slotId];
        var lower = String(slotId).toLowerCase();
        for (var k in colorValues) {
            if (Object.prototype.hasOwnProperty.call(colorValues, k) && String(k).toLowerCase() === lower) {
                return colorValues[k];
            }
        }
        return undefined;
    }
    function applySvgColors(svgText, colorConfig, colorValues) {
        if (!svgText || !colorConfig || !colorConfig.colors) return svgText;
        var out = svgText;
        colorConfig.colors.forEach(function (slot) {
            var val = getColorValue(colorValues, slot.id);
            var hex = val ? toHex6(val) : toHex6(slot.default);
            if (!hex) return;
            var toReplace = slot.replace || [slot.id];
            toReplace.forEach(function (oldHex) {
                var escaped = String(oldHex).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                out = out.replace(new RegExp(escaped, 'gi'), hex);
            });
        });
        return out;
    }
    function resetQrVectorImg() {
        var img = document.getElementById('qrcodeQrVectorImg');
        if (!img) return;
        var b = img.getAttribute('data-qr-blob-url');
        if (b) {
            try { URL.revokeObjectURL(b); } catch (e) { /* noop */ }
            img.removeAttribute('data-qr-blob-url');
        }
        var o = img.getAttribute('data-qr-src-original');
        if (o) img.setAttribute('src', o);
    }

    function resetNoCallsFoundHexImgs() {
        document.querySelectorAll('img.js-icon-bridge-no-calls-found').forEach(function (img) {
            var b = img.getAttribute('data-bridge-hex-blob-url');
            if (b) {
                try { URL.revokeObjectURL(b); } catch (e) { /* noop */ }
                img.removeAttribute('data-bridge-hex-blob-url');
            }
            var o = img.getAttribute('data-bridge-hex-src-original');
            if (o) img.setAttribute('src', o);
        });
    }
    function hydrateQrVectorImg() {
        var img = document.getElementById('qrcodeQrVectorImg');
        if (!img) return;
        if (!img.getAttribute('data-qr-src-original')) {
            img.setAttribute('data-qr-src-original', img.getAttribute('src') || '');
        }
        var stored = readStoredShared() || {};
        var config = {
            colors: BRIDGE_SHARED_COLORS_LIGHT.map(function (c) {
                return { id: c.id, default: c.default, replace: c.replace || getReplacePatterns(c.id) };
            })
        };
        var sharedVals = Object.assign(
            {},
            getDefaults(config),
            getDefaults({ colors: BRIDGE_SHARED_COLORS_DARK }),
            stored
        );
        var srcAttr = img.getAttribute('data-qr-src-original') || img.getAttribute('src') || '';
        var abs = new URL(srcAttr, window.location.href).href;
        fetch(abs)
            .then(function (r) { return r.ok ? r.text() : ''; })
            .then(function (text) {
                if (!text) return;
                var patched = applySvgColors(text, config, sharedVals) || text;
                var blob = new Blob([patched], { type: 'image/svg+xml' });
                var burl = URL.createObjectURL(blob);
                var prev = img.getAttribute('data-qr-blob-url');
                if (prev) { try { URL.revokeObjectURL(prev); } catch (e) { /* noop */ } }
                img.setAttribute('data-qr-blob-url', burl);
                img.setAttribute('src', burl);
            })
            .catch(function () {});
    }

    /**
     * no-calls-found.svg uses hex (same as gallery shared-gradient strip for ICONS_USING_HEX).
     */
    function hydrateNoCallsFoundImgs() {
        document.querySelectorAll('img.js-icon-bridge-no-calls-found').forEach(function (img) {
            if (!img.getAttribute('data-bridge-hex-src-original')) {
                img.setAttribute('data-bridge-hex-src-original', img.getAttribute('src') || '');
            }
            var stored = readStoredShared() || {};
            var config = {
                colors: BRIDGE_SHARED_COLORS_LIGHT.map(function (c) {
                    return { id: c.id, default: c.default, replace: c.replace || getReplacePatterns(c.id) };
                })
            };
            var sharedVals = Object.assign(
                {},
                getDefaults(config),
                getDefaults({ colors: BRIDGE_SHARED_COLORS_DARK }),
                stored
            );
            var srcAttr = img.getAttribute('data-bridge-hex-src-original') || img.getAttribute('src') || '';
            var abs = new URL(srcAttr, window.location.href).href;
            fetch(abs)
                .then(function (r) {
                    return r.ok ? r.text() : '';
                })
                .then(function (text) {
                    if (!text) return;
                    var patched = applySvgColors(text, config, sharedVals) || text;
                    var blob = new Blob([patched], { type: 'image/svg+xml' });
                    var burl = URL.createObjectURL(blob);
                    var prev = img.getAttribute('data-bridge-hex-blob-url');
                    if (prev) {
                        try {
                            URL.revokeObjectURL(prev);
                        } catch (e) {
                            /* noop */
                        }
                    }
                    img.setAttribute('data-bridge-hex-blob-url', burl);
                    img.setAttribute('src', burl);
                })
                .catch(function () {});
        });
    }

    function replaceVarsInSvgText(svgText, map) {
        var out = svgText;
        var keys = Object.keys(map).sort(function (a, b) {
            return b.length - a.length;
        });
        keys.forEach(function (k) {
            var escaped = k.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
            /* Match var(--name) and var(--name, #fallback) (must match after --name, not only before) — same as icon-gallery resolveSvgVars. */
            var re = new RegExp('var\\(' + escaped + '(?:,\\s*[^)]+)?\\)', 'g');
            out = out.replace(re, map[k]);
        });
        return out;
    }

    function dataUrlToSvgText(dataUrl) {
        if (!dataUrl || dataUrl.indexOf('data:') !== 0) return '';
        var comma = dataUrl.indexOf(',');
        if (comma < 0) return '';
        var header = dataUrl.slice(0, comma);
        var payload = dataUrl.slice(comma + 1);
        if (header.toLowerCase().indexOf('svg') === -1 && header.toLowerCase().indexOf('xml') === -1) return '';
        if (header.indexOf('base64') !== -1) {
            try {
                var binary = atob(payload);
                var out = '';
                for (var i = 0; i < binary.length; i++) out += String.fromCharCode(binary.charCodeAt(i) & 0xff);
                return out;
            } catch (e) {
                return '';
            }
        }
        try {
            return decodeURIComponent(payload);
        } catch (e) {
            return '';
        }
    }

    var PREVIEW_L = 'preview-asset:icon-light:';
    var PREVIEW_D = 'preview-asset:icon-dark:';
    function trySvgTextFromPreviewStorage(img) {
        var slot = (img.getAttribute('data-icon-slot') || '').trim();
        if (!slot) return '';
        var theme = (img.getAttribute('data-icon-theme') || 'light').toLowerCase();
        var key = (theme === 'dark' ? PREVIEW_D : PREVIEW_L) + slot;
        var raw;
        try {
            raw = localStorage.getItem(key);
        } catch (e) {
            return '';
        }
        if (!raw || raw.indexOf('data:') !== 0) return '';
        var t = dataUrlToSvgText(raw) || '';
        if (t.indexOf('<svg') === -1) return '';
        return t;
    }
    function trySvgTextFromDataImgSrc(img) {
        var s = (img.getAttribute('src') || img.src || '').trim();
        if (s.indexOf('data:') !== 0) return '';
        var t = dataUrlToSvgText(s) || '';
        if (t.indexOf('<svg') === -1) return '';
        return t;
    }

    var FETCH_OPTS = { cache: 'no-store' };

    function resolveBases() {
        var b = [document.baseURI, window.location.href, window.location.toString()]
            .filter(Boolean);
        return b.filter(function (u, i, a) {
            if (!/^https?:/i.test(u) && u.indexOf('file:') !== 0) return false;
            return a.indexOf(u) === i;
        });
    }

    function withBust(abs) {
        if (abs.indexOf('blob:') === 0 || abs.indexOf('data:') === 0) return abs;
        var c = (abs || '').indexOf('?') >= 0 ? '&' : '?';
        return abs + c + '_=' + Date.now();
    }

    /**
     * Resolve the same on-disk /public/... file against document.baseURI, href, and origin, so Live Server and IDE preview still find the SVG.
     */
    function absoluteSvgFetchTryList(relative) {
        var re = String(relative || '');
        var out = [];
        var bases = resolveBases();
        var o;
        var bi;
        for (bi = 0; bi < bases.length; bi++) {
            try {
                o = new URL(re, bases[bi]).href;
                out.push(o);
            } catch (e) { /* */ }
        }
        re = re.replace(/\\/g, '/');
        var fromPub = re.toLowerCase().indexOf('public/');
        if (fromPub >= 0) {
            var sub = re.slice(fromPub);
            if (location && location.origin) {
                out.push(location.origin + '/' + sub.replace(/^\//, ''));
            }
        }
        if (re.indexOf('check-mail.svg') !== -1 && location && location.origin) {
            out.push(location.origin + '/public/app-icon/icon/light/check-mail.svg');
        }
        return out.filter(function (u, i, a) { return u && a.indexOf(u) === i; });
    }

    function fetchTextFirstUrl(urls) {
        if (!urls || !urls.length) return Promise.resolve(null);
        var first = urls[0];
        if (!first) return fetchTextFirstUrl(urls.slice(1));
        return fetch(withBust(first), FETCH_OPTS)
            .then(function (r) {
                if (r && r.ok) return r.text();
                return null;
            })
            .catch(function () { return null; })
            .then(function (text) {
                if (text) return text;
                return fetchTextFirstUrl(urls.slice(1));
            });
    }

    /**
     * file:// often blocks fetch(); IDE preview may use odd base. Try several absolute URLs and localStorage fallbacks.
     */
    function loadSvgTextForIconBridgeImg(img, fetchSrc) {
        var altRel = tryAlternateSvgUrl(fetchSrc) || null;
        var u1 = absoluteSvgFetchTryList(fetchSrc);
        if (altRel) {
            u1 = u1.concat(absoluteSvgFetchTryList(altRel));
        }
        return fetchTextFirstUrl(u1)
            .then(function (text) {
                if (text) return text;
                var t = trySvgTextFromPreviewStorage(img);
                if (t) return t;
                t = trySvgTextFromDataImgSrc(img);
                if (t) return t;
                if (img && img.id === 'checkMailHeroIcon' && /^https?:/i.test(String(location.protocol || ''))) {
                    var hasColors = null;
                    try { hasColors = localStorage.getItem(COLORS_PREFIX + SHARED_KEY); } catch (e) { /* */ }
                    if (hasColors) {
                        console.warn(
                            '[desk-app icon bridge] check-mail.svg did not load for recolor. Open the repo root in Live Server (e.g. desk-app), or open:',
                            (u1 && u1[0]) || fetchSrc
                        );
                    } else {
                        console.info(
                            '[desk-app icon bridge] Set Shared colors in design_pages_new/icon-gallery.html, same port, then refresh this page.'
                        );
                    }
                }
                return null;
            });
    }

    function tryAlternateSvgUrl(src) {
        var m = src.match(/\/icon\/([^/]+\.svg)$/);
        if (m) return src.replace(/\/icon\/([^/]+\.svg)$/, '/icon/light/$1');
        return null;
    }
    function resetBridgedSvgImages() {
        document.querySelectorAll('img[data-gallery-bridge="1"]').forEach(function (img) {
            var b = img.getAttribute('data-gallery-blob-url');
            if (b) URL.revokeObjectURL(b);
            var orig = img.getAttribute('data-gallery-src-original');
            if (orig) img.setAttribute('src', orig);
            img.removeAttribute('data-gallery-bridge');
            img.removeAttribute('data-gallery-blob-url');
        });
        resetQrVectorImg();
        resetNoCallsFoundHexImgs();
    }

    function shouldProcessIconPath(url) {
        if (!url || url.indexOf('blob:') === 0) return false;
        if (url.indexOf('app-icon') !== -1) return true;
        if (url.indexOf('check-mail.svg') !== -1) return true;
        if (url.indexOf('img-new') !== -1 && url.indexOf('check-mail') !== -1) return true;
        return false;
    }
    function canonicalUrlForIconBridge(img) {
        var s = (img.getAttribute('src') || '');
        if (s.indexOf('blob:') === 0) {
            return img.getAttribute('data-gallery-src-original') || '';
        }
        var o = img.getAttribute('data-gallery-src-original');
        if (!o && s && shouldProcessIconPath(s)) {
            img.setAttribute('data-gallery-src-original', s);
            o = s;
        }
        return o || s;
    }
    function clearImgInlineOnerrorForBridge(img) {
        if (img.getAttribute('data-keep-onerror') === '1') return;
        if (img.hasAttribute('onerror') || img.onerror) {
            try {
                img.onerror = null;
            } catch (e) { /* */ }
            img.removeAttribute('onerror');
        }
    }
    function hydrateSvgImages(map) {
        var seen = new Set();
        var list = document.querySelectorAll('img.js-icon-bridge-mail, img[src$=".svg"], img[data-gallery-src-original]');
        list.forEach(function (img) {
            if (img.id === 'qrcodeQrVectorImg') return;
            if (img.classList && img.classList.contains('js-icon-bridge-no-calls-found')) return;
            if (seen.has(img)) return;
            seen.add(img);
            if (img.classList && img.classList.contains('js-icon-bridge-mail')) {
                clearImgInlineOnerrorForBridge(img);
            }
            var fetchSrc = canonicalUrlForIconBridge(img);
            if (!fetchSrc || !shouldProcessIconPath(fetchSrc)) return;

            loadSvgTextForIconBridgeImg(img, fetchSrc)
                .then(function (text) {
                    if (!text || text.indexOf('var(--icon') === -1) return;
                    var patched = replaceVarsInSvgText(text, map);
                    var blob = new Blob([patched], { type: 'image/svg+xml' });
                    var burl = URL.createObjectURL(blob);
                    var prev = img.getAttribute('data-gallery-blob-url');
                    if (prev) URL.revokeObjectURL(prev);
                    clearImgInlineOnerrorForBridge(img);
                    img.setAttribute('data-gallery-blob-url', burl);
                    img.setAttribute('data-gallery-bridge', '1');
                    img.onerror = null;
                    img.removeAttribute('onerror');
                    img.src = burl;
                })
                .catch(function () {});
        });
    }

    function run(resetImages) {
        var rawShared = localStorage.getItem(COLORS_PREFIX + SHARED_KEY);
        var stored = {};
        if (rawShared != null) {
            try {
                stored = JSON.parse(rawShared);
            } catch (e) {
                stored = {};
            }
        }
        if (!stored || typeof stored !== 'object') stored = {};
        var map = buildResolvedMap(stored);
        if (resetImages) resetBridgedSvgImages();
        /* Run even when shared-gradient storage is empty so app-icon SVGs get var() -> hex
           and match Icon Gallery on first open (rawShared was null before = no refresh). */
        applyRootVars(map);
        hydrateSvgImages(map);
        hydrateQrVectorImg();
        hydrateNoCallsFoundImgs();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            run(false);
        });
    } else {
        run(false);
    }

    window.addEventListener('storage', function (e) {
        if (!e.key || e.key.indexOf(COLORS_PREFIX) !== 0) return;
        if (e.key === COLORS_PREFIX + SHARED_KEY) run(true);
    });

    /* Icon Gallery in another tab cannot dispatch to this page; `storage` usually fires, but
       `BroadcastChannel` is a reliable same-origin extra channel for instant refresh. */
    var deskAppIconBridge;
    try {
        if (typeof BroadcastChannel === 'function') {
            deskAppIconBridge = new BroadcastChannel('desk-app-icon-bridge');
            deskAppIconBridge.addEventListener('message', function () { run(true); });
        }
    } catch (e) { /* */ }

    var resyncT = 0;
    function maybeResyncFromLocalStorage() {
        if (resyncT) clearTimeout(resyncT);
        resyncT = setTimeout(function () { resyncT = 0; run(true); }, 150);
    }
    window.addEventListener('focus', function () { maybeResyncFromLocalStorage(); });
    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'visible') maybeResyncFromLocalStorage();
    });

    /** Same-tab: localStorage does not fire `storage` on the window that set the item. Icon Gallery dispatches this after saves. */
    window.addEventListener('whitelabel-icon-colors-changed', function () {
        run(true);
    });

    new MutationObserver(function () {
        run(true);
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    /* After gallery-preview-assets and other sync scripts, re-apply so img src (e.g. data: from localStorage) is re-colored. */
    window.addEventListener('load', function () {
        setTimeout(function () { run(true); }, 0);
    });
    window.addEventListener('pageshow', function (e) {
        if (e.persisted) setTimeout(function () { run(true); }, 0);
    });
    if (location.protocol === 'file:') {
        console.info(
            '[desk-app icon bridge] For Icon Gallery color sync, open the project over http(s) (not file://). ' +
                'file:// often isolates localStorage per page and may block fetch() to the SVG. ' +
                'From the repo root, run a static server (e.g. npx -y serve .) and use /design_pages_new/checkmail.html'
        );
    }
})();
