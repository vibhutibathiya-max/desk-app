/**
 * Per-client localStorage isolation for the design preview flow.
 *
 * When `wl-active-client` is set (after common login), these logical keys are stored
 * under a physical prefix so multiple users on the same browser profile do not clobber
 * each other's uploads / icon color state:
 *   - preview-asset:*
 *   - whitelabel-icon-color
 *   - whitelabel-icon-colors:*
 *
 * Session keys (`wl-active-client`, `wl-last-login-time`) and saved panel snapshots
 * (`wl-client-preview-state:*`) are not rewritten here.
 */
(function () {
    'use strict';

    if (window.__wl_ls_namespace_installed) return;
    window.__wl_ls_namespace_installed = true;

    var SESSION_KEY = 'wl-active-client';
    var TIME_KEY = 'wl-last-login-time';
    var NS = 'wl_u:';

    var proto = Storage.prototype;
    var nativeGet = proto.getItem;
    var nativeSet = proto.setItem;
    var nativeRemove = proto.removeItem;

    function activeSlug() {
        try {
            return String(nativeGet.call(localStorage, SESSION_KEY) || '').trim().toLowerCase();
        } catch (e) {
            return '';
        }
    }

    function shouldNamespaceLogical(logicalKey) {
        if (!logicalKey) return false;
        if (logicalKey === SESSION_KEY || logicalKey === TIME_KEY) return false;
        if (logicalKey.indexOf('wl-client-preview-state:') === 0) return false;
        if (logicalKey.indexOf(NS) === 0) return false;
        if (logicalKey.indexOf('preview-asset:') === 0) return true;
        if (logicalKey === 'whitelabel-icon-color') return true;
        if (logicalKey.indexOf('whitelabel-icon-colors:') === 0) return true;
        return false;
    }

    function toPhysical(logicalKey) {
        if (!shouldNamespaceLogical(logicalKey)) return logicalKey;
        var slug = activeSlug();
        if (!slug) return logicalKey;
        return NS + encodeURIComponent(slug) + ':' + logicalKey;
    }

    window.__wl_physicalKeyToLogical = function (physKey) {
        if (!physKey || physKey.indexOf(NS) !== 0) return physKey;
        var rest = physKey.slice(NS.length);
        var i = rest.indexOf(':');
        if (i < 0) return physKey;
        var encUser = rest.slice(0, i);
        try {
            decodeURIComponent(encUser);
        } catch (e) {
            return physKey;
        }
        return rest.slice(i + 1);
    };

    /**
     * Returns logical keys currently visible for this client (namespaced + legacy unprefixed).
     */
    window.__wl_ls_keysMatching = function (logicalPrefix) {
        var out = [];
        var seen = {};
        var slug = activeSlug();
        var userPhysPrefix = slug ? NS + encodeURIComponent(slug) + ':' : '';
        try {
            for (var i = 0; i < localStorage.length; i++) {
                var phys = localStorage.key(i);
                if (!phys) continue;
                var logical = null;
                if (slug && userPhysPrefix && phys.indexOf(userPhysPrefix) === 0) {
                    logical = phys.slice(userPhysPrefix.length);
                } else if (!slug && phys.indexOf(logicalPrefix) === 0 && phys.indexOf(NS) !== 0) {
                    logical = phys;
                } else if (slug && phys.indexOf(logicalPrefix) === 0 && phys.indexOf(NS) !== 0) {
                    logical = phys;
                    var owned = userPhysPrefix + logical;
                    if (nativeGet.call(localStorage, owned) != null) continue;
                }
                if (!logical || logical.indexOf(logicalPrefix) !== 0) continue;
                if (!seen[logical]) {
                    seen[logical] = true;
                    out.push(logical);
                }
            }
        } catch (e) { /* noop */ }
        out.sort();
        return out;
    };

    proto.getItem = function (key) {
        var phys = toPhysical(key);
        var v = nativeGet.call(this, phys);
        if (v == null && phys !== key && shouldNamespaceLogical(key) && activeSlug()) {
            v = nativeGet.call(this, key);
        }
        return v;
    };

    proto.setItem = function (key, value) {
        var phys = toPhysical(key);
        nativeSet.call(this, phys, value);
        if (phys !== key && shouldNamespaceLogical(key) && activeSlug()) {
            try {
                nativeRemove.call(this, key);
            } catch (e2) { /* noop */ }
        }
    };

    proto.removeItem = function (key) {
        var phys = toPhysical(key);
        nativeRemove.call(this, phys);
        if (phys !== key && shouldNamespaceLogical(key)) {
            try {
                nativeRemove.call(this, key);
            } catch (e3) { /* noop */ }
        }
    };

})();
