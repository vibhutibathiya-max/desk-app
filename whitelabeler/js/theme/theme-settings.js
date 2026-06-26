/**
 * Demo white-label color picker for preview shell.
 * Updates theme.js keys at runtime via ThemeManager.
 */
(function initThemeSettings() {
  "use strict";

  var PICKER_FIELDS = [
    { key: "PRIMARY_COLOR", label: "PRIMARY_COLOR" },
    { key: "GRADIENT_1", label: "GRADIENT_1" },
    { key: "GRADIENT_2", label: "GRADIENT_2" },
    { key: "GRADIENT_3", label: "GRADIENT_3" },
    { key: "GRADIENT_4", label: "GRADIENT_4" },
    { key: "PRIMARY_DARK_COLOR", label: "PRIMARY_DARK_COLOR" },
    { key: "CHAT_ICON_COLOR_RECIVER", label: "CHAT_ICON_COLOR_RECIVER" },
  ];

  function hexForPicker(value) {
    if (!value || typeof value !== "string") {
      return "#000000";
    }
    if (value.charAt(0) === "#" && value.length >= 7) {
      return value.slice(0, 7);
    }
    return "#000000";
  }

  function syncPickers(form) {
    var theme = window.ThemeManager.getTheme() || window.TRAGO_DEFAULT_THEME;
    form.querySelectorAll("input[type=color]").forEach(function (input) {
      var key = input.dataset.themeKey;
      if (theme[key]) {
        input.value = hexForPicker(theme[key]);
      }
    });
  }

  function showThemeMessage(panel, message, type) {
    var status = panel.querySelector(".theme-settings__status");
    if (!status) {
      return;
    }

    status.textContent = message || "";
    status.classList.toggle("theme-settings__status--error", type === "error");
    status.classList.toggle("theme-settings__status--success", type === "success");

    if (message) {
      window.clearTimeout(status._hideTimer);
      status._hideTimer = window.setTimeout(function () {
        status.textContent = "";
        status.classList.remove("theme-settings__status--error", "theme-settings__status--success");
      }, 5000);
    }
  }

  function handleThemeUpload(file, panel) {
    if (!window.ThemeFileParser) {
      showThemeMessage(panel, "Theme upload is not available.", "error");
      return;
    }

    var validationError = window.ThemeFileParser.validateThemeFile(file);
    if (validationError) {
      showThemeMessage(panel, validationError, "error");
      return;
    }

    window.ThemeFileParser.parseThemeFile(file).then(function (result) {
      if (result.error) {
        showThemeMessage(panel, result.error, "error");
        return;
      }

      window.ThemeFileParser.applyParsedTheme(result.values);

      if (typeof window.saveThemeToProject !== "function") {
        showThemeMessage(
          panel,
          "Theme applied to preview. Start the dev server to save js/theme/theme.js.",
          "success"
        );
        return;
      }

      window
        .saveThemeToProject()
        .then(function () {
          showThemeMessage(
            panel,
            "Theme uploaded. Preview and js/theme/theme.js updated (" +
              Object.keys(result.values).length +
              " color(s)).",
            "success"
          );
        })
        .catch(function (error) {
          showThemeMessage(
            panel,
            "Preview updated, but could not save theme.js. Run: npm start — " + error.message,
            "error"
          );
        });
    });
  }

  function buildPanel() {
    var chrome = document.querySelector(".preview-chrome");
    if (!chrome || document.getElementById("theme-settings")) {
      return;
    }

    var panel = document.createElement("aside");
    panel.id = "theme-settings";
    panel.className = "theme-settings";
    panel.setAttribute("aria-label", "Theme settings");

    var title = document.createElement("h2");
    title.className = "theme-settings__title";
    title.textContent = "White-label theme";
    panel.appendChild(title);

    var form = document.createElement("div");
    form.className = "theme-settings__form";

    PICKER_FIELDS.forEach(function (field) {
      var row = document.createElement("label");
      row.className = "theme-settings__row";
      row.htmlFor = "theme-picker-" + field.key;

      var text = document.createElement("span");
      text.className = "theme-settings__label";
      text.textContent = field.label;

      var input = document.createElement("input");
      input.type = "color";
      input.id = "theme-picker-" + field.key;
      input.className = "theme-settings__input";
      input.dataset.themeKey = field.key;
      input.value = hexForPicker(
        (window.ThemeManager.getTheme() || window.TRAGO_DEFAULT_THEME)[field.key]
      );

      input.addEventListener("input", function (event) {
        window.ThemeManager.set(field.key, event.target.value);
      });

      row.appendChild(text);
      row.appendChild(input);
      form.appendChild(row);
    });

    panel.appendChild(form);

    var actions = document.createElement("div");
    actions.className = "theme-settings__actions";

    var fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.id = "upload-theme-input";
    fileInput.className = "theme-settings__file-input";
    fileInput.accept = ".css,.js,text/css,text/javascript,application/javascript";
    fileInput.addEventListener("change", function (event) {
      var file = event.target.files && event.target.files[0];
      if (file) {
        handleThemeUpload(file, panel);
      }
      event.target.value = "";
    });

    var uploadBtn = document.createElement("button");
    uploadBtn.type = "button";
    uploadBtn.id = "upload-theme-btn";
    uploadBtn.className = "theme-settings__upload";
    uploadBtn.textContent = "Upload Theme File";
    uploadBtn.addEventListener("click", function () {
      fileInput.click();
    });

    var downloadBtn = document.createElement("button");
    downloadBtn.type = "button";
    downloadBtn.id = "download-theme-btn";
    downloadBtn.className = "theme-settings__download";
    downloadBtn.textContent = "Download Theme File";
    downloadBtn.addEventListener("click", function () {
      if (typeof window.downloadThemeJS === "function") {
        window.downloadThemeJS();
      }
    });

    actions.appendChild(fileInput);
    actions.appendChild(uploadBtn);
    actions.appendChild(downloadBtn);
    panel.appendChild(actions);

    var resetBtn = document.createElement("button");
    resetBtn.type = "button";
    resetBtn.className = "theme-settings__reset";
    resetBtn.textContent = "Reset theme";
    resetBtn.addEventListener("click", function () {
      window.ThemeManager.reset();
      syncPickers(form);

      if (typeof window.saveThemeToProject !== "function" || typeof window.exportWebThemeJS !== "function") {
        showThemeMessage(panel, "Theme reset to original preview colors.", "success");
        return;
      }

      window
        .saveThemeToProject(window.exportWebThemeJS(window.TRAGO_ORIGINAL_THEME))
        .then(function () {
          showThemeMessage(
            panel,
            "Theme reset to original. Preview and js/theme/theme.js restored.",
            "success"
          );
        })
        .catch(function (error) {
          showThemeMessage(
            panel,
            "Preview reset, but could not restore theme.js on disk. Run: npm start — " + error.message,
            "error"
          );
        });
    });
    panel.appendChild(resetBtn);

    var status = document.createElement("p");
    status.className = "theme-settings__status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    panel.appendChild(status);

    if (typeof window.buildAssetSettingsSection === "function") {
      window.buildAssetSettingsSection(panel, function (message, type) {
        showThemeMessage(panel, message, type);
      });
    }

    chrome.appendChild(panel);

    window.ThemeManager.onChange(function () {
      syncPickers(form);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildPanel);
  } else {
    buildPanel();
  }
})();
