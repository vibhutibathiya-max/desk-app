/**
 * Injects theme.js values into CSS custom properties on :root.
 * CSS variable names match theme.js keys exactly (e.g. --PRIMARY_COLOR).
 */
(function initThemeManager(global) {
  "use strict";

  function toPercent(fraction) {
    return (fraction * 100).toFixed(2).replace(/\.?0+$/, "") + "%";
  }

  function buildLinearGradient(angle, colors, locations) {
    if (!colors || colors.length === 0) {
      return "none";
    }

    var stops = colors.map(function (color, index) {
      var location = locations && locations[index] != null ? toPercent(locations[index]) : null;
      return location ? color + " " + location : color;
    });

    return "linear-gradient(" + angle + "deg, " + stops.join(", ") + ")";
  }

  var COMPUTED_GRADIENT_KEYS = [
    "CSS_GRADIENT_FULL_SCREEN",
    "CSS_GRADIENT_BUTTON_PRIMARY",
    "CSS_GRADIENT_STATUS_SAVE",
    "CSS_GRADIENT_MAIN",
    "CSS_GRADIENT_ONBOARDING",
    "CSS_GRADIENT_NAVIGATION",
  ];

  var ThemeManager = {
    _currentTheme: null,
    _syncThemeGlobals: function (theme) {
      global.TRAGO_GRADIENT_1 = theme.GRADIENT_1;
      global.TRAGO_GRADIENT_2 = theme.GRADIENT_2;
      global.TRAGO_GRADIENT_3 = theme.GRADIENT_3;
      global.TRAGO_GRADIENT_4 = theme.GRADIENT_4;
      global.TRAGO_DEFAULT_THEME = theme;
    },

    _getOriginalTheme: function () {
      return global.TRAGO_ORIGINAL_THEME || global.TRAGO_DEFAULT_THEME;
    },

    _clearRootThemeStyles: function () {
      var root = document.documentElement;
      var keys = (global.TRAGO_WHITE_LABEL_CSS_KEYS || []).concat(
        ["GRADIENT_1", "GRADIENT_2", "GRADIENT_3", "GRADIENT_4"],
        COMPUTED_GRADIENT_KEYS
      );

      keys.forEach(function (key) {
        root.style.removeProperty("--" + key);
      });
    },

    _listeners: [],

    getTheme: function () {
      return this._currentTheme ? Object.assign({}, this._currentTheme) : null;
    },

    /**
     * Apply a theme object to :root CSS variables.
     * @param {object} theme
     * @param {{ persist?: boolean }} [options]
     */
    apply: function (theme, options) {
      if (!theme || typeof theme !== "object") {
        return;
      }

      var root = document.documentElement;
      var merged = Object.assign({}, global.TRAGO_DEFAULT_THEME, theme);
      this._currentTheme = merged;

      var cssKeys = global.TRAGO_WHITE_LABEL_CSS_KEYS || [];
      cssKeys.forEach(function (key) {
        var value = merged[key];
        if (typeof value === "string") {
          root.style.setProperty("--" + key, value);
        }
      });

      // Gradient stop variables (always sync from theme object)
      ["GRADIENT_1", "GRADIENT_2", "GRADIENT_3", "GRADIENT_4"].forEach(function (key) {
        if (merged[key]) {
          root.style.setProperty("--" + key, merged[key]);
        }
      });

      // Computed gradients for runtime picker updates (preserve Figma stop layout)
      root.style.setProperty(
        "--CSS_GRADIENT_FULL_SCREEN",
        "linear-gradient(" +
          merged.fullScreenGradientAngle +
          "deg, " +
          merged.GRADIENT_1 +
          " 6.23%, " +
          merged.GRADIENT_2 +
          " 35.08%, " +
          merged.GRADIENT_3 +
          " 99.36%, " +
          merged.GRADIENT_4 +
          " 147.44%)"
      );

      root.style.setProperty(
        "--CSS_GRADIENT_BUTTON_PRIMARY",
        "linear-gradient(90deg, " + merged.GRADIENT_3 + " 0%, " + merged.PRIMARY_DARK_COLOR + " 100%)"
      );

      root.style.setProperty(
        "--CSS_GRADIENT_STATUS_SAVE",
        "linear-gradient(" +
          merged.buttonGradientAngle +
          "deg, " +
          merged.GRADIENT_1 +
          " 0.26%, " +
          merged.GRADIENT_2 +
          " 30.28%, " +
          merged.GRADIENT_3 +
          " 97.16%)"
      );

      root.style.setProperty(
        "--CSS_GRADIENT_MAIN",
        "linear-gradient(45deg, " +
          merged.GRADIENT_4 +
          " 0%, " +
          merged.GRADIENT_3 +
          " 28%, " +
          merged.GRADIENT_2 +
          " 62%, " +
          merged.GRADIENT_1 +
          " 100%)"
      );

      root.style.setProperty(
        "--CSS_GRADIENT_ONBOARDING",
        "linear-gradient(180deg, " + merged.PRIMARY_DARK_COLOR + " 0%, #4f2fc4 55%, #4528b0 100%)"
      );

      root.style.setProperty(
        "--CSS_GRADIENT_NAVIGATION",
        buildLinearGradient(
          merged.navigationGradientAngle,
          merged.NAVIGATION_GRADIENT_COLOR,
          merged.navigationGradientLocations
        )
      );

      var metaTheme = document.querySelector('meta[name="theme-color"]');
      if (metaTheme && merged.PRIMARY_DARK_COLOR) {
        metaTheme.setAttribute("content", merged.PRIMARY_DARK_COLOR);
      }

      if (!options || options.persist !== false) {
        try {
          localStorage.setItem("TRAGO_THEME_OVERRIDES", JSON.stringify(this._getOverrides(merged)));
        } catch (error) {
          /* ignore storage errors */
        }
      }

      this._listeners.forEach(function (listener) {
        listener(merged);
      });
    },

    /**
     * Update a single theme key and re-apply.
     * @param {string} key - theme.js key name
     * @param {string} value - new color value
     */
    set: function (key, value) {
      var next = Object.assign({}, this._currentTheme || global.TRAGO_DEFAULT_THEME);
      next[key] = value;

      if (key.indexOf("GRADIENT_") === 0 && /^GRADIENT_[1-4]$/.test(key)) {
        next.GRADIENT_COLORS = [
          next.GRADIENT_1,
          next.GRADIENT_2,
          next.GRADIENT_3,
          next.GRADIENT_4,
        ];
        next.BUTTON_GRADIENT_COLOR = [next.GRADIENT_1, next.GRADIENT_2, next.GRADIENT_3];
        next.NAVIGATION_GRADIENT_COLOR = [
          next.GRADIENT_1,
          next.GRADIENT_2,
          next.GRADIENT_3,
          next.GRADIENT_4,
        ];
        // Keep POLICY_TEXT_COLOR / BUTTON_COLOR_BLUE in sync with GRADIENT_4
        if (key === "GRADIENT_4") {
          next.POLICY_TEXT_COLOR = value;
          next.BUTTON_COLOR_BLUE = value;
          next.SEEKBAR_FEEL_CORLOR = value;
          next.CONTACT_AVATAR_PHONE_BG_NEW = value;
        }
      }

      if (key === "PRIMARY_COLOR") {
        next.PRIMARY_THEME_TEXT = value;
        next.PRIMARY_BG = value;
        next.PRIMARY_ICON = value;
        next.INPUT_BORDER_COLOR = value;
        next.CALL_ICON_ACTIVE = value;
        next.LOADER_COLOR = value;
      }

      if (key === "CHAT_ICON_COLOR_RECIVER") {
        next.AUDIO_PLAYER_BUTTON_COLOR = value;
        next.SECONDARY_COLOR_PRESENCE = value;
        next.CONTACT_AVATAR_PHONE_USER = value;
        next.CONTACT_AVATAR_REMOTE_BG = value;
        next.CONTACT_AVATAR_REMOTE_USER = value;
        next.CONTACT_AVATAR_PHONE_BG = value;
        next.IMG_UPLOAD_ICON = value;
        next.LOTTIE_COLOR = value;
        next.CHAT_RECIVER_ICON_COLOR = value;
        next.CHAT_RECIVER_AUDIO_PLAY_ICON_COLOR = value;
        next.CHAT_SENDER_AUDIO_PLAY_ICON_COLOR = value;
      }

      if (key === "PRIMARY_DARK_COLOR") {
        next.PRIMARY_DARK_ICON = value;
        next.PRIMARY_DARK_COLOR_50 = value.length === 7 ? value + "80" : value;
      }

      this.apply(next);
    },

    reset: function () {
      try {
        localStorage.removeItem("TRAGO_THEME_OVERRIDES");
      } catch (error) {
        /* ignore */
      }

      var original = Object.assign({}, this._getOriginalTheme());
      this._clearRootThemeStyles();
      this._syncThemeGlobals(original);
      this.apply(original, { persist: false });
    },

    onChange: function (listener) {
      this._listeners.push(listener);
      return function unsubscribe() {
        ThemeManager._listeners = ThemeManager._listeners.filter(function (item) {
          return item !== listener;
        });
      };
    },

    _getOverrides: function (theme) {
      var base = global.TRAGO_DEFAULT_THEME;
      var overrides = {};

      Object.keys(base).forEach(function (key) {
        if (theme[key] !== base[key]) {
          overrides[key] = theme[key];
        }
      });

      return overrides;
    },

    _loadPersisted: function () {
      try {
        var raw = localStorage.getItem("TRAGO_THEME_OVERRIDES");
        if (!raw) {
          return null;
        }
        return JSON.parse(raw);
      } catch (error) {
        return null;
      }
    },

    init: function () {
      var persisted = this._loadPersisted();
      var theme = Object.assign({}, global.TRAGO_DEFAULT_THEME, persisted || {});
      this.apply(theme, { persist: false });
    },
  };

  global.ThemeManager = ThemeManager;
})(window);
