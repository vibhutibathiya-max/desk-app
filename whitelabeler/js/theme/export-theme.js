/**
 * Export RN theme.js (download) and web js/theme/theme.js (project persist).
 */
(function initExportTheme(global) {
  "use strict";

  var RN_PLACEHOLDER_KEYS = [
    "PRIMARY_COLOR",
    "SECONDARY_COLOR",
    "HOLD_STICK_COLOR",
    "HOLD_STICK_COLOR_50",
    "GRADIENT_1",
    "GRADIENT_2",
    "GRADIENT_3",
    "GRADIENT_4",
    "CHAT_ICON_COLOR_RECIVER",
  ];

  var TOP_LEVEL_COLOR_VARS = [
    "GRADIENT_1",
    "GRADIENT_2",
    "GRADIENT_3",
    "GRADIENT_4",
    "PRIMARY_COLOR",
    "CHAT_ICON_COLOR_RECIVER",
    "PRIMARY_DARK_COLOR",
  ];

  var THEME_VAR_REFS = {
    GRADIENT_1: "GRADIENT_1",
    GRADIENT_2: "GRADIENT_2",
    GRADIENT_3: "GRADIENT_3",
    GRADIENT_4: "GRADIENT_4",
    GRADIENT_COLORS: "[GRADIENT_1, GRADIENT_2, GRADIENT_3, GRADIENT_4]",
    BUTTON_GRADIENT_COLOR: "[GRADIENT_1, GRADIENT_2, GRADIENT_3]",
    NAVIGATION_GRADIENT_COLOR: "[GRADIENT_1, GRADIENT_2, GRADIENT_3, GRADIENT_4]",
    PRIMARY_COLOR: "PRIMARY_COLOR",
    PRIMARY_THEME_TEXT: "PRIMARY_COLOR",
    PRIMARY_BG: "PRIMARY_COLOR",
    PRIMARY_ICON: "PRIMARY_COLOR",
    INPUT_BORDER_COLOR: "PRIMARY_COLOR",
    CALL_ICON_ACTIVE: "PRIMARY_COLOR",
    LOADER_COLOR: "PRIMARY_COLOR",
    CHAT_ICON_COLOR_RECIVER: "CHAT_ICON_COLOR_RECIVER",
    AUDIO_PLAYER_BUTTON_COLOR: "CHAT_ICON_COLOR_RECIVER",
    SECONDARY_COLOR_PRESENCE: "CHAT_ICON_COLOR_RECIVER",
    CONTACT_AVATAR_PHONE_USER: "CHAT_ICON_COLOR_RECIVER",
    CONTACT_AVATAR_REMOTE_BG: "CHAT_ICON_COLOR_RECIVER",
    CONTACT_AVATAR_REMOTE_USER: "CHAT_ICON_COLOR_RECIVER",
    CONTACT_AVATAR_PHONE_BG: "CHAT_ICON_COLOR_RECIVER",
    IMG_UPLOAD_ICON: "CHAT_ICON_COLOR_RECIVER",
    LOTTIE_COLOR: "CHAT_ICON_COLOR_RECIVER",
    CHAT_RECIVER_ICON_COLOR: "CHAT_ICON_COLOR_RECIVER",
    CHAT_RECIVER_AUDIO_PLAY_ICON_COLOR: "CHAT_ICON_COLOR_RECIVER",
    CHAT_SENDER_AUDIO_PLAY_ICON_COLOR: "CHAT_ICON_COLOR_RECIVER",
    POLICY_TEXT_COLOR: "GRADIENT_4",
    BUTTON_COLOR_BLUE: "GRADIENT_4",
    SEEKBAR_FEEL_CORLOR: "GRADIENT_4",
    CONTACT_AVATAR_PHONE_BG_NEW: "GRADIENT_4",
    PRIMARY_DARK_COLOR: "PRIMARY_DARK_COLOR",
    PRIMARY_DARK_ICON: "PRIMARY_DARK_COLOR",
    PRIMARY_DARK_COLOR_50: 'PRIMARY_DARK_COLOR + "80"',
  };

  var THEME_ENTRIES = [
    { comment: "full screen gradient" },
    { key: "fullScreenGradientLocations" },
    { key: "fullScreenGradientAngle" },
    { comment: "button gradient" },
    { key: "buttonGradientLocations" },
    { key: "buttonGradientAngle" },
    { comment: "navigation gradient" },
    { key: "navigationGradientLocations" },
    { key: "navigationGradientAngle" },
    { key: "GRADIENT_1" },
    { key: "GRADIENT_2" },
    { key: "GRADIENT_3" },
    { key: "GRADIENT_4" },
    { key: "GRADIENT_COLORS" },
    { key: "BUTTON_GRADIENT_COLOR" },
    { key: "NAVIGATION_GRADIENT_COLOR" },
    { key: "PRIMARY_COLOR" },
    { key: "PRIMARY_THEME_TEXT" },
    { key: "PRIMARY_BG" },
    { key: "PRIMARY_ICON" },
    { key: "CHAT_ICON_COLOR_RECIVER" },
    { key: "AUDIO_PLAYER_BUTTON_COLOR" },
    { key: "SECONDARY_COLOR_PRESENCE" },
    { key: "CONTACT_AVATAR_PHONE_USER" },
    { key: "CONTACT_AVATAR_REMOTE_BG" },
    { key: "CONTACT_AVATAR_REMOTE_USER" },
    { key: "CONTACT_AVATAR_PHONE_BG" },
    { key: "IMG_UPLOAD_ICON" },
    { key: "LOTTIE_COLOR" },
    { key: "INPUT_BORDER_COLOR" },
    { key: "CALL_ICON_ACTIVE" },
    { key: "CHAT_RECIVER_ICON_COLOR" },
    { key: "CHAT_RECIVER_AUDIO_PLAY_ICON_COLOR" },
    { key: "CHAT_SENDER_AUDIO_PLAY_ICON_COLOR" },
    { key: "LOADER_COLOR" },
    { key: "FLASH_ICON" },
    { key: "POLICY_TEXT_COLOR" },
    { key: "BUTTON_COLOR_BLUE" },
    { key: "SEEKBAR_FEEL_CORLOR" },
    { key: "CONTACT_AVATAR_PHONE_BG_NEW" },
    { key: "WEBVIEW_BG" },
    { key: "PRIMARY_DARK_COLOR" },
    { key: "PRIMARY_DARK_ICON" },
    { key: "PRIMARY_DARK_COLOR_50" },
    { key: "GET_STARTED_DISCIMAR_TEXT" },
    { key: "SECONDARY_COLOR" },
    { key: "PERMISSION_GRAY_BACKGROUND" },
    { key: "SEARCH_BAR_TEXT_COLOR" },
    { key: "SEARCH_BAR_COLOR" },
    { key: "SEARCH_BAR_ICON_COLOR" },
    { key: "SEARCH_BAR_TINT_COLOR" },
    { key: "DROPDOWN_BAR_COLOR" },
    { key: "APPLOCK_GREY_LIGHT" },
    { key: "TEXT_COLOR" },
    { key: "MODAL_TITLE" },
    { key: "CALL_ICON_BG" },
    { key: "FAV_SELECTED_COLOR" },
    { key: "HEADER_TINT_COLOR_LIGHT" },
    { key: "CONTACT_ICONS" },
    { key: "LED_AWAY_COLOR" },
    { key: "CHAT_TEXT_SENDER_COLOR" },
    { key: "ICON_COLOR" },
    { key: "SEARCH_BAR_ROASTER" },
    { key: "HINT_TEXT_Y" },
    { key: "CALL_TEXT_COLOR" },
    { key: "CALL_ICON_ACTIVE_BG" },
    { key: "DIALPAD_CONTACT_TEXT_COLOR" },
    { key: "CONNECT_SCREEN_BG" },
    { key: "PRIMARY_WHITE_TEXT" },
    { key: "LANGUAGE_ICON_COLOR" },
    { key: "CANCEL_BUTTON_COLOR" },
    { key: "HEADER_TINT_COLOR" },
    { key: "HEADER_TEXT_COLOR" },
    { key: "HEADER_BACKGROUND_COLOR" },
    { key: "LOG_BUTTON_BACKGROUND" },
    { key: "CHAT_RECIVER_BUBBLE_BACKGROUND" },
    { key: "CHAT_RECIVER_BUBBLE_TEXTCOLOR" },
    { key: "CHAT_RECIVER_BUBBLE_TEXT_LINK_COLOR" },
    { key: "CHAT_RECIVER_MESSAGE_TIME_TEXT_COLOR" },
    { key: "CHAT_RECIVER_ICON_BACKGROUND" },
    { key: "CHAT_SENDER_ICON_COLOR_LIGHT_THEME" },
    { key: "CHAT_SENDER_BUBBLE_BACKGROUND" },
    { key: "CHAT_SENDER_BUBBLE_TEXTCOLOR" },
    { key: "CHAT_SENDER_BUBBLE_TEXT_LINK_COLOR" },
    { key: "CHAT_SENDER_MESSAGE_TIME_TEXT_COLOR" },
    { key: "CHAT_SENDER_ICON_COLOR" },
    { key: "CHAT_SENDER_ICON_BACKGROUND" },
    { key: "SMS_RECIVER_BUBBLE_BACKGROUND" },
    { key: "SMS_RECIVER_BUBBLE_TEXTCOLOR" },
    { key: "SMS_RECIVER_BUBBLE_TEXT_LINK_COLOR" },
    { key: "SMS_RECIVER_AUDIO_TIME_TEXT_COLOR" },
    { key: "SMS_SENDER_BUBBLE_BACKGROUND" },
    { key: "SMS_SENDER_BUBBLE_TEXTCOLOR" },
    { key: "SMS_SENDER_BUBBLE_TEXT_LINK_COLOR" },
    { key: "SMS_SENDER_AUDIO_TIME_TEXT_COLOR" },
    { key: "CHAT_RECEIVED" },
  ];

  function getThemeSnapshot(theme) {
    if (theme && typeof theme === "object") {
      return theme;
    }
    if (global.ThemeManager && typeof global.ThemeManager.getTheme === "function") {
      return global.ThemeManager.getTheme() || global.TRAGO_DEFAULT_THEME;
    }
    return global.TRAGO_DEFAULT_THEME || {};
  }

  function formatThemeValue(value) {
    if (typeof value === "number") {
      return String(value);
    }
    if (Array.isArray(value)) {
      return "[" + value.map(formatThemeValue).join(", ") + "]";
    }
    if (typeof value === "string") {
      return JSON.stringify(value);
    }
    return JSON.stringify(value);
  }

  function formatColorLiteral(value) {
    return JSON.stringify(value);
  }

  function renderThemeEntry(key, snapshot) {
    if (THEME_VAR_REFS[key]) {
      return THEME_VAR_REFS[key];
    }
    return formatThemeValue(snapshot[key]);
  }

  function resolveRNExportColors(snapshot) {
    return {
      PRIMARY_COLOR: snapshot.PRIMARY_COLOR,
      SECONDARY_COLOR: snapshot.GRADIENT_4,
      HOLD_STICK_COLOR: snapshot.PRIMARY_DARK_COLOR,
      HOLD_STICK_COLOR_50: snapshot.PRIMARY_DARK_COLOR_50,
      GRADIENT_1: snapshot.GRADIENT_1,
      GRADIENT_2: snapshot.GRADIENT_2,
      GRADIENT_3: snapshot.GRADIENT_3,
      GRADIENT_4: snapshot.GRADIENT_4,
      CHAT_ICON_COLOR_RECIVER: snapshot.CHAT_ICON_COLOR_RECIVER,
    };
  }

  function applyRNPlaceholders(template, colors) {
    var source = template;

    RN_PLACEHOLDER_KEYS.forEach(function (key) {
      source = source.split("__" + key + "__").join(colors[key]);
    });

    return source;
  }

  /**
   * Build React Native theme.js (BASE_COLORS + defaultTheme + darkTheme).
   * @param {object} [theme]
   * @returns {string}
   */
  function exportRNThemeJS(theme) {
    if (typeof global.getRNThemeTemplate !== "function") {
      throw new Error("RN theme template is not loaded.");
    }

    var snapshot = getThemeSnapshot(theme);
    var colors = resolveRNExportColors(snapshot);
    return applyRNPlaceholders(global.getRNThemeTemplate(), colors);
  }

  /**
   * Build web js/theme/theme.js for preview persistence.
   * @param {object} [theme]
   * @returns {string}
   */
  function exportWebThemeJS(theme) {
    var snapshot = getThemeSnapshot(theme);
    var lines = [
      "/**",
      " * Tragofone theme — web source of truth (mirrors RN Theme.txt white-label section).",
      " * Only colors above the ❌ marker are defined here.",
      " */",
      "",
      "(function initTragofoneTheme(global) {",
      '  "use strict";',
      "",
      "  // Gradient stop variables (white-label)",
    ];

    TOP_LEVEL_COLOR_VARS.forEach(function (key) {
      lines.push("  var " + key + " = " + formatColorLiteral(snapshot[key]) + ";");
    });

    lines.push("");
    lines.push("  var defaultTheme = {");

    THEME_ENTRIES.forEach(function (entry) {
      if (entry.comment) {
        lines.push("    // " + entry.comment);
        return;
      }
      lines.push("    " + entry.key + ": " + renderThemeEntry(entry.key, snapshot) + ",");
    });

    lines.push("  };");
    lines.push("");
    lines.push("  /** Keys eligible for runtime CSS injection (scalar colors only). */");
    lines.push("  var WHITE_LABEL_CSS_KEYS = Object.keys(defaultTheme).filter(function (key) {");
    lines.push("    var value = defaultTheme[key];");
    lines.push("    return (");
    lines.push('      typeof value === "string" &&');
    lines.push('      (value.charAt(0) === "#" || value.indexOf("rgba") === 0 || value === "transparent")');
    lines.push("    );");
    lines.push("  });");
    lines.push("");
    lines.push("  global.TRAGO_GRADIENT_1 = GRADIENT_1;");
    lines.push("  global.TRAGO_GRADIENT_2 = GRADIENT_2;");
    lines.push("  global.TRAGO_GRADIENT_3 = GRADIENT_3;");
    lines.push("  global.TRAGO_GRADIENT_4 = GRADIENT_4;");
    lines.push("  global.TRAGO_DEFAULT_THEME = defaultTheme;");
    lines.push("  global.TRAGO_WHITE_LABEL_CSS_KEYS = WHITE_LABEL_CSS_KEYS;");
    lines.push("})(window);");
    lines.push("");

    return lines.join("\n");
  }

  function downloadThemeJS(theme, filename) {
    var source = exportRNThemeJS(theme);
    var blob = new Blob([source], { type: "text/javascript;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = filename || "theme.js";
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Persist theme.js to the project via the local dev server API.
   * @param {string} [source]
   * @returns {Promise<void>}
   */
  function saveThemeToProject(source) {
    var body = source || exportWebThemeJS();

    return fetch("/api/theme", {
      method: "POST",
      headers: { "Content-Type": "text/javascript; charset=utf-8" },
      body: body,
    }).then(function (response) {
      if (!response.ok) {
        return response.text().then(function (text) {
          throw new Error(text || "Could not save theme.js to project.");
        });
      }
    });
  }

  global.exportRNThemeJS = exportRNThemeJS;
  global.exportWebThemeJS = exportWebThemeJS;
  global.exportThemeJS = exportRNThemeJS;
  global.downloadThemeJS = downloadThemeJS;
  global.saveThemeToProject = saveThemeToProject;
})(window);
