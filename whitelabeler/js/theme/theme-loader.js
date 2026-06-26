/**
 * Bootstraps ThemeManager before styles paint (sync in head).
 */
(function initThemeLoader() {
  "use strict";

  if (window.ThemeManager && window.TRAGO_DEFAULT_THEME) {
    window.ThemeManager.init();
  }
})();
