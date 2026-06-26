/**
 * Generates app/assets/theme.js for the epicrange package export.
 * Uses reference/epicrange/app/assets/theme.js as the structural template.
 */
(function initExportThemePackage(global) {
  "use strict";

  function getThemeTemplateUrl() {
    var config = global.EXPORT_PACKAGE_CONFIG || {};
    var referenceRoot = config.referenceRoot || "reference/epicrange/";
    var themePath = config.themeTemplatePath || "app/assets/theme.js";
    return referenceRoot + themePath;
  }

  var WHITE_LABEL_END_MARKER = "// ❌COLORS THAT DO NOT NEEDS TO BE CHANGED FOR WHITE LABELING";

  var PACKAGE_THEME_REPLACEMENTS = {
    PRIMARY_COLOR: "PRIMARY_COLOR",
    GRADIENT_COLORS: ["GRADIENT_1", "GRADIENT_2", "GRADIENT_3", "GRADIENT_4"],
    BUTTON_GRADIENT_COLOR: ["GRADIENT_1", "GRADIENT_2", "GRADIENT_3"],
    NAVIGATION_GRADIENT_COLOR: ["GRADIENT_1", "GRADIENT_2", "GRADIENT_3", "GRADIENT_4"],
    PRIMARY_THEME_TEXT: "PRIMARY_COLOR",
    PRIMARY_BG: "PRIMARY_COLOR",
    PRIMARY_ICON: "PRIMARY_COLOR",
    CHAT_ICON_COLOR_RECIVER: "CHAT_ICON_COLOR_RECIVER",
    BUTTON_COLOR_BLUE: "GRADIENT_4",
    SEEKBAR_FEEL_CORLOR: "GRADIENT_4",
    PRIMARY_DARK_COLOR: "PRIMARY_DARK_COLOR",
    PRIMARY_DARK_ICON: "PRIMARY_DARK_COLOR",
    PRIMARY_DARK_COLOR_50: "PRIMARY_DARK_COLOR_50",
    WEBVIEW_BG: "PRIMARY_DARK_COLOR",
    CONTACT_AVATAR_PHONE_BG: "CHAT_ICON_COLOR_RECIVER",
    CONTACT_AVATAR_PHONE_BG_NEW: "GRADIENT_4",
    CONTACT_AVATAR_PHONE_USER: "CHAT_ICON_COLOR_RECIVER",
    CONTACT_AVATAR_REMOTE_BG: "CHAT_ICON_COLOR_RECIVER",
    CONTACT_AVATAR_REMOTE_USER: "CHAT_ICON_COLOR_RECIVER",
    FLASH_ICON: "GRADIENT_4",
    IMG_UPLOAD_ICON: "CHAT_ICON_COLOR_RECIVER",
  };

  function getThemeSnapshot(theme) {
    if (theme && typeof theme === "object") {
      return theme;
    }
    if (global.ThemeManager && typeof global.ThemeManager.getTheme === "function") {
      return global.ThemeManager.getTheme() || global.TRAGO_DEFAULT_THEME;
    }
    return global.TRAGO_DEFAULT_THEME || {};
  }

  function resolveReplacementValue(spec, snapshot) {
    if (Array.isArray(spec)) {
      return spec.map(function (key) {
        return snapshot[key];
      });
    }
    return snapshot[spec];
  }

  function formatRnScalar(value) {
    return "'" + String(value) + "'";
  }

  function formatRnValue(value) {
    if (Array.isArray(value)) {
      return (
        "[" +
        value
          .map(function (item) {
            return formatRnScalar(item);
          })
          .join(", ") +
        "]"
      );
    }
    return formatRnScalar(value);
  }

  function replaceThemeProperty(block, key, value) {
    var formatted = formatRnValue(value);
    var pattern = new RegExp("(^\\s*" + key + ":\\s*)([^,\\n]+)", "m");
    if (!pattern.test(block)) {
      return block;
    }
    return block.replace(pattern, "$1" + formatted);
  }

  function applyPackageThemeColors(template, snapshot) {
    var markerIndex = template.indexOf(WHITE_LABEL_END_MARKER);
    if (markerIndex === -1) {
      throw new Error("Reference theme.js is missing the white-label end marker.");
    }

    var whiteLabelBlock = template.slice(0, markerIndex);
    var remainder = template.slice(markerIndex);

    Object.keys(PACKAGE_THEME_REPLACEMENTS).forEach(function (key) {
      var resolved = resolveReplacementValue(PACKAGE_THEME_REPLACEMENTS[key], snapshot);
      if (resolved !== undefined && resolved !== null) {
        whiteLabelBlock = replaceThemeProperty(whiteLabelBlock, key, resolved);
      }
    });

    return whiteLabelBlock + remainder;
  }

  function loadReferenceThemeTemplate() {
    return fetch(getThemeTemplateUrl()).then(function (response) {
      if (!response.ok) {
        throw new Error("Could not load reference theme.js template.");
      }
      return response.text();
    });
  }

  /**
   * @param {object} [theme]
   * @returns {Promise<string>}
   */
  function exportPackageThemeJS(theme) {
    var snapshot = getThemeSnapshot(theme);
    return loadReferenceThemeTemplate().then(function (template) {
      return applyPackageThemeColors(template, snapshot);
    });
  }

  global.exportPackageThemeJS = exportPackageThemeJS;
})(window);
