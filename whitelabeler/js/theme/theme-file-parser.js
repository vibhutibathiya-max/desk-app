/**
 * Parses uploaded global.css / theme.js files and maps values to preview theme keys.
 */
(function initThemeFileParser(global) {
  "use strict";

  /** Canonical keys controlled by the preview color pickers (source of truth). */
  var SUPPORTED_THEME_KEYS = [
    "PRIMARY_COLOR",
    "GRADIENT_1",
    "GRADIENT_2",
    "GRADIENT_3",
    "GRADIENT_4",
    "PRIMARY_DARK_COLOR",
    "CHAT_ICON_COLOR_RECIVER",
  ];

  var IMPORT_ORDER = [
    "GRADIENT_1",
    "GRADIENT_2",
    "GRADIENT_3",
    "GRADIENT_4",
    "PRIMARY_COLOR",
    "PRIMARY_DARK_COLOR",
    "CHAT_ICON_COLOR_RECIVER",
  ];

  /** Maps aliases from CSS, RN BASE_COLORS, and theme.js to canonical keys. */
  var THEME_KEY_ALIASES = {
    primary: "PRIMARY_COLOR",
    "primary-color": "PRIMARY_COLOR",
    primary_color: "PRIMARY_COLOR",

    secondary: "GRADIENT_4",
    "secondary-color": "GRADIENT_4",
    secondary_color: "GRADIENT_4",

    gradient1: "GRADIENT_1",
    "gradient-1-color": "GRADIENT_1",
    gradient_1: "GRADIENT_1",

    gradient2: "GRADIENT_2",
    "gradient-2-color": "GRADIENT_2",
    gradient_2: "GRADIENT_2",

    gradient3: "GRADIENT_3",
    "gradient-3-color": "GRADIENT_3",
    gradient_3: "GRADIENT_3",

    gradient4: "GRADIENT_4",
    "gradient-4-color": "GRADIENT_4",
    gradient_4: "GRADIENT_4",

    holdstick: "PRIMARY_DARK_COLOR",
    "hold-stick": "PRIMARY_DARK_COLOR",
    "dynamic-bar-color": "PRIMARY_DARK_COLOR",
    dynamic_bar_color: "PRIMARY_DARK_COLOR",

    chaticon: "CHAT_ICON_COLOR_RECIVER",
    "chat-icon": "CHAT_ICON_COLOR_RECIVER",
    "dynamic-bar-icon-color": "CHAT_ICON_COLOR_RECIVER",
    dynamic_bar_icon_color: "CHAT_ICON_COLOR_RECIVER",
  };

  var ALLOWED_EXTENSIONS = [".css", ".js"];
  var HEX_COLOR_RE = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/;

  function normalizeAlias(name) {
    return String(name).replace(/^--/, "").replace(/_/g, "-").toLowerCase();
  }

  function resolveCanonicalKey(name) {
    if (!name) {
      return null;
    }

    if (SUPPORTED_THEME_KEYS.indexOf(name) !== -1) {
      return name;
    }

    var alias = THEME_KEY_ALIASES[normalizeAlias(name)];
    if (alias) {
      return alias;
    }

    return null;
  }

  function expandShortHex(hex) {
    if (hex.length === 4) {
      return (
        "#" +
        hex.charAt(1) +
        hex.charAt(1) +
        hex.charAt(2) +
        hex.charAt(2) +
        hex.charAt(3) +
        hex.charAt(3)
      );
    }
    return hex;
  }

  function normalizeHexColor(value) {
    if (!value || typeof value !== "string") {
      return null;
    }

    var trimmed = value.trim();
    if (!HEX_COLOR_RE.test(trimmed)) {
      return null;
    }

    var hex = trimmed.length === 9 ? trimmed.slice(0, 7) : trimmed;
    return expandShortHex(hex.toUpperCase());
  }

  function assignColor(target, rawKey, rawValue) {
    var canonical = resolveCanonicalKey(rawKey);
    var color = normalizeHexColor(rawValue);

    if (!canonical || !color) {
      return;
    }

    target[canonical] = color;
  }

  function extractBaseColorsBlock(source) {
    var match = source.match(/const\s+BASE_COLORS\s*=\s*\{([\s\S]*?)\n\};/);
    if (!match) {
      return {};
    }

    var result = {};
    var pattern = /(\w+)\s*:\s*['"](#[0-9A-Fa-f]{3,8})['"]/g;
    var entry;

    while ((entry = pattern.exec(match[1]))) {
      assignColor(result, entry[1], entry[2]);
    }

    return result;
  }

  function extractGradientVars(source) {
    var result = {};
    var pattern = /var\s+(GRADIENT_[1-4])\s*=\s*['"](#[0-9A-Fa-f]{3,8})['"]/g;
    var entry;

    while ((entry = pattern.exec(source))) {
      assignColor(result, entry[1], entry[2]);
    }

    return result;
  }

  function extractCssVariables(source) {
    var result = {};
    var pattern = /--([A-Za-z0-9_-]+)\s*:\s*(#[0-9A-Fa-f]{3,8})\s*;/g;
    var entry;

    while ((entry = pattern.exec(source))) {
      assignColor(result, entry[1], entry[2]);
    }

    return result;
  }

  function extractDirectThemeKeys(source) {
    var result = {};
    var pattern =
      /(?:^|\n)\s*(PRIMARY_COLOR|GRADIENT_[1-4]|PRIMARY_DARK_COLOR|CHAT_ICON_COLOR_RECIVER|SECONDARY_COLOR)\s*:\s*['"](#[0-9A-Fa-f]{3,8})['"]/g;
    var entry;

    while ((entry = pattern.exec(source))) {
      assignColor(result, entry[1], entry[2]);
    }

    return result;
  }

  function mergeParsedColors() {
    var merged = {};
    var index;

    for (index = 0; index < arguments.length; index += 1) {
      var chunk = arguments[index];
      Object.keys(chunk).forEach(function (key) {
        merged[key] = chunk[key];
      });
    }

    return merged;
  }

  function getFileExtension(filename) {
    var dot = filename.lastIndexOf(".");
    if (dot === -1) {
      return "";
    }
    return filename.slice(dot).toLowerCase();
  }

  function validateThemeFile(file) {
    if (!file || typeof file.name !== "string") {
      return "No file selected.";
    }

    var extension = getFileExtension(file.name);
    if (ALLOWED_EXTENSIONS.indexOf(extension) === -1) {
      return "Unsupported file type. Please upload a .css or .js file.";
    }

    return null;
  }

  /**
   * Parse theme file content into supported canonical keys.
   * @param {string} content
   * @param {string} [filename]
   * @returns {{ values: Record<string, string>, error: string|null }}
   */
  function parseThemeFileContent(content, filename) {
    if (!content || typeof content !== "string" || !content.trim()) {
      return { values: {}, error: "File is empty or cannot be parsed." };
    }

    var extension = filename ? getFileExtension(filename) : "";
    if (extension && ALLOWED_EXTENSIONS.indexOf(extension) === -1) {
      return { values: {}, error: "Unsupported file type. Please upload a .css or .js file." };
    }

    var values = {};

    if (extension === ".css" || content.indexOf(":root") !== -1 || /--[\w-]+\s*:/.test(content)) {
      values = mergeParsedColors(values, extractCssVariables(content));
    }

    if (extension === ".js" || extension === "") {
      values = mergeParsedColors(
        values,
        extractBaseColorsBlock(content),
        extractGradientVars(content),
        extractDirectThemeKeys(content)
      );
    }

    if (Object.keys(values).length === 0) {
      return {
        values: {},
        error: "No valid theme variables found. Supported keys include PRIMARY_COLOR, GRADIENT_1–4, and CSS aliases like --primary-color.",
      };
    }

    return { values: values, error: null };
  }

  /**
   * Parse a File object.
   * @param {File} file
   * @returns {Promise<{ values: Record<string, string>, error: string|null }>}
   */
  function parseThemeFile(file) {
    var validationError = validateThemeFile(file);
    if (validationError) {
      return Promise.resolve({ values: {}, error: validationError });
    }

    return file.text().then(
      function (content) {
        try {
          return parseThemeFileContent(content, file.name);
        } catch (error) {
          return { values: {}, error: "File cannot be parsed. Please check the format." };
        }
      },
      function () {
        return { values: {}, error: "File could not be read." };
      }
    );
  }

  /**
   * Apply parsed theme values to ThemeManager (partial update only).
   * @param {Record<string, string>} values
   */
  function applyParsedTheme(values) {
    if (!values || typeof values !== "object" || !global.ThemeManager) {
      return;
    }

    IMPORT_ORDER.forEach(function (key) {
      if (values[key]) {
        global.ThemeManager.set(key, values[key]);
      }
    });
  }

  global.ThemeFileParser = {
    SUPPORTED_THEME_KEYS: SUPPORTED_THEME_KEYS.slice(),
    validateThemeFile: validateThemeFile,
    parseThemeFile: parseThemeFile,
    parseThemeFileContent: parseThemeFileContent,
    applyParsedTheme: applyParsedTheme,
    resolveCanonicalKey: resolveCanonicalKey,
    normalizeHexColor: normalizeHexColor,
  };
})(window);
