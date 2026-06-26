/**
 * Full-page Image Gallery — asset cards with upload, preview, reset.
 */
(function initImageGallery(global) {
  "use strict";

  var galleryEl = null;
  var contentEl = null;
  var fileInput = null;
  var iosFileInput = null;
  var pendingUploadKey = null;
  var pendingIosUploadKey = null;
  var previewModal = null;

  var DEVICE_WIDTH = 540;
  var DEVICE_HEIGHT = 1111;
  var PREVIEW_SCALE = 0.22;

  function formatFileSize(bytes) {
    if (!bytes && bytes !== 0) {
      return "—";
    }
    if (bytes < 1024) {
      return bytes + " B";
    }
    if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(2) + " KB";
    }
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  }

  function formatDimensions(asset) {
    if (asset.width && asset.height) {
      return asset.width + " × " + asset.height;
    }
    return asset.expectedDimensions || "—";
  }

  function navigateToScreen(screenId) {
    if (global.TragoScreenNav && typeof global.TragoScreenNav.setActiveScreenId === "function") {
      global.TragoScreenNav.setActiveScreenId(screenId);
      return;
    }

    var select = document.getElementById("screen-select");
    if (!select) {
      return;
    }
    select.value = screenId;
    select.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function getActiveScreenId() {
    if (global.TragoScreenNav && typeof global.TragoScreenNav.getActiveScreenId === "function") {
      return global.TragoScreenNav.getActiveScreenId();
    }
    var select = document.getElementById("screen-select");
    return select ? select.value : null;
  }

  function showToast(message, type) {
    if (typeof global.showGalleryToast === "function") {
      global.showGalleryToast(message, type);
      return;
    }
    var toast = document.getElementById("image-gallery-toast");
    if (!toast) {
      return;
    }
    toast.textContent = message;
    toast.className = "image-gallery__toast image-gallery__toast--" + (type || "info");
    toast.hidden = false;
    clearTimeout(toast._timer);
    toast._timer = setTimeout(function () {
      toast.hidden = true;
    }, 4000);
  }

  function hideGalleryPanel() {
    if (!galleryEl) {
      return;
    }
    galleryEl.hidden = true;
    galleryEl.setAttribute("hidden", "");
  }

  function showGalleryPanel() {
    if (!galleryEl) {
      buildGalleryShell();
    }
    galleryEl.removeAttribute("hidden");
    galleryEl.hidden = false;
    renderGallery();
  }

  function closeGallery() {
    if (global.TragoScreenNav && typeof global.TragoScreenNav.closeImageGallery === "function") {
      global.TragoScreenNav.closeImageGallery();
      return;
    }
    hideGalleryPanel();
    document.body.classList.remove("is-image-gallery-open");
    var shell = document.querySelector(".preview-shell");
    if (shell) {
      shell.hidden = false;
    }
  }

  function openGallery() {
    if (global.TragoScreenNav && typeof global.TragoScreenNav.openImageGallery === "function") {
      global.TragoScreenNav.openImageGallery();
      return;
    }
    showGalleryPanel();
    document.body.classList.add("is-image-gallery-open");
    var shell = document.querySelector(".preview-shell");
    if (shell) {
      shell.hidden = true;
    }
  }

  function buildPreviewModal() {
    previewModal = document.createElement("div");
    previewModal.className = "asset-usage-modal";
    previewModal.id = "asset-usage-modal";
    previewModal.hidden = true;
    previewModal.innerHTML =
      '<div class="asset-usage-modal__backdrop" data-close="true"></div>' +
      '<div class="asset-usage-modal__panel" role="dialog" aria-modal="true" aria-labelledby="asset-usage-title">' +
      '<header class="asset-usage-modal__header">' +
      '<h2 id="asset-usage-title" class="asset-usage-modal__title">Asset usage preview</h2>' +
      '<button type="button" class="asset-usage-modal__close" data-close="true" aria-label="Close">×</button>' +
      "</header>" +
      '<p class="asset-usage-modal__subtitle" id="asset-usage-subtitle"></p>' +
      '<div class="asset-usage-modal__previews" id="asset-usage-previews"></div>' +
      "</div>";
    document.body.appendChild(previewModal);

    previewModal.addEventListener("click", function (event) {
      if (event.target.dataset.close === "true") {
        closeUsagePreview();
      }
    });
  }

  function closeUsagePreview() {
    if (!previewModal) {
      return;
    }

    previewModal.hidden = true;
    previewModal.setAttribute("hidden", "");

    var previews = document.getElementById("asset-usage-previews");
    if (previews) {
      previews.textContent = "";
    }

    if (galleryEl && !galleryEl.hidden) {
      renderGallery();
    }
  }

  function cloneScreenPreview(screen) {
    var panel = document.querySelector('.screen-panel[data-screen="' + screen.id + '"]');
    if (!panel) {
      return null;
    }

    var item = document.createElement("article");
    item.className = "asset-usage-modal__preview-item";

    var label = document.createElement("h3");
    label.className = "asset-usage-modal__preview-label";
    label.textContent = screen.label;
    item.appendChild(label);

    var frameShell = document.createElement("div");
    frameShell.className = "asset-usage-modal__screen-shell";
    frameShell.style.width = Math.round(DEVICE_WIDTH * PREVIEW_SCALE) + "px";
    frameShell.style.height = Math.round(DEVICE_HEIGHT * PREVIEW_SCALE) + "px";

    var frame = document.createElement("div");
    frame.className = "asset-usage-modal__screen-frame";

    var clone = panel.cloneNode(true);
    clone.removeAttribute("hidden");
    clone.classList.add("screen-panel--active");
    clone.style.display = "flex";
    clone.style.position = "relative";
    clone.style.inset = "auto";
    clone.style.width = DEVICE_WIDTH + "px";
    clone.style.height = DEVICE_HEIGHT + "px";
    clone.style.transform = "scale(" + PREVIEW_SCALE + ")";
    clone.style.transformOrigin = "top left";

    frame.appendChild(clone);

    var liveImgs = panel.querySelectorAll("img");
    var cloneImgs = clone.querySelectorAll("img");
    for (var index = 0; index < liveImgs.length; index += 1) {
      if (cloneImgs[index] && liveImgs[index].getAttribute("src")) {
        cloneImgs[index].setAttribute("src", liveImgs[index].getAttribute("src"));
      }
    }

    frameShell.appendChild(frame);
    item.appendChild(frameShell);

    item.addEventListener("click", function () {
      closeUsagePreview();
      navigateToScreen(screen.id);
      showToast("Showing " + screen.label + " with current branding.", "success");
    });

    item.setAttribute("role", "button");
    item.setAttribute("tabindex", "0");
    item.setAttribute("title", "Open " + screen.label + " in main preview");

    return item;
  }

  function openUsagePreview(assetKey) {
    var asset = global.AssetManager.getAsset(assetKey);
    if (!asset || !asset.usageScreens || !asset.usageScreens.length) {
      showToast("No screen usage defined for this asset.", "error");
      return;
    }

    if (!previewModal) {
      buildPreviewModal();
    }

    global.AssetManager.applyToDOM();

    var subtitle = document.getElementById("asset-usage-subtitle");
    var previews = document.getElementById("asset-usage-previews");
    var title = document.getElementById("asset-usage-title");

    title.textContent = asset.name;
    subtitle.textContent =
      "Screens using this asset with the currently active image. Click a preview to open it in the main viewer.";

    previews.textContent = "";

    asset.usageScreens.forEach(function (screen) {
      var preview = cloneScreenPreview(screen);
      if (preview) {
        previews.appendChild(preview);
      }
    });

    if (!previews.children.length) {
      subtitle.textContent = "Could not render screen previews for this asset.";
      showToast("Screen previews are not available yet.", "error");
      return;
    }

    previewModal.removeAttribute("hidden");
    previewModal.hidden = false;
  }

  function buildAssetCard(asset) {
    var card = document.createElement("article");
    card.className = "image-gallery__card";
    card.dataset.galleryAssetKey = asset.key;

    var variantLabel = asset.variant
      ? '<span class="image-gallery__variant">' + asset.variant.toUpperCase() + "</span>"
      : "";

    card.innerHTML =
      '<div class="image-gallery__card-preview">' +
      '<div class="image-gallery__preview-frame">' +
      variantLabel +
      '<img class="image-gallery__preview-img" alt="" />' +
      "</div>" +
      "</div>" +
      '<div class="image-gallery__card-body">' +
      '<h3 class="image-gallery__card-name">' +
      asset.name +
      "</h3>" +
      '<p class="image-gallery__card-file" data-field="fileName"></p>' +
      '<p class="image-gallery__card-meta"><span data-field="dimensions"></span> · <span data-field="size"></span></p>' +
      '<div class="image-gallery__card-platforms" data-field="platforms"></div>' +
      '<div class="image-gallery__card-actions">' +
      '<button type="button" class="image-gallery__btn image-gallery__btn--primary" data-action="upload">Upload</button>' +
      '<button type="button" class="image-gallery__btn image-gallery__btn--preview" data-action="preview" title="Preview on screens">Preview</button>' +
      '<button type="button" class="image-gallery__btn image-gallery__btn--reset" data-action="reset">Reset</button>' +
      "</div>" +
      "</div>";

    var img = card.querySelector(".image-gallery__preview-img");
    img.src = asset.previewUrl || asset.current;
    img.alt = asset.name;

    card.querySelector('[data-field="fileName"]').textContent = asset.fileName;
    card.querySelector('[data-field="dimensions"]').textContent = formatDimensions(asset);
    card.querySelector('[data-field="size"]').textContent = formatFileSize(asset.fileSize);
    card.querySelector('[data-field="platforms"]').textContent = (asset.platforms || []).join(" · ");

    card.querySelector('[data-action="upload"]').addEventListener("click", function () {
      pendingUploadKey = asset.key;
      fileInput.click();
    });

    card.querySelector('[data-action="preview"]').addEventListener("click", function () {
      openUsagePreview(asset.key);
    });

    card.querySelector('[data-action="reset"]').addEventListener("click", function () {
      if (!asset.uploaded) {
        showToast(asset.name + " is already using the original asset.", "info");
        return;
      }
      global.AssetManager.resetAsset(asset.key);
      showToast(asset.name + " reset to original.", "success");
    });

    if (asset.uploaded) {
      card.classList.add("image-gallery__card--uploaded");
    }

    return card;
  }

  function renderGallery() {
    if (!contentEl || !global.ASSET_SECTIONS || !global.AssetManager) {
      return;
    }

    contentEl.textContent = "";

    global.ASSET_SECTIONS.forEach(function (section) {
      var assets = global.getAssetsBySection(section.id);
      if (!assets.length) {
        return;
      }

      var sectionEl = document.createElement("section");
      sectionEl.className = "image-gallery__section";
      sectionEl.innerHTML =
        '<header class="image-gallery__section-header">' +
        "<h2>" +
        section.title +
        "</h2>" +
        "<p>" +
        section.hint +
        "</p>" +
        "</header>" +
        '<div class="image-gallery__grid"></div>';

      var grid = sectionEl.querySelector(".image-gallery__grid");

      assets.forEach(function (entry) {
        var asset = global.AssetManager.getAsset(entry.key);
        if (asset) {
          grid.appendChild(buildAssetCard(asset));
        }
      });

      contentEl.appendChild(sectionEl);
    });

    renderIosSection();
  }

  function buildIosAssetCard(asset) {
    var card = document.createElement("article");
    card.className = "image-gallery__card";
    if (asset.uploaded) {
      card.classList.add("image-gallery__card--uploaded");
    }

    var isAppIcon = asset.type === "appiconset";
    var uploadLabel = isAppIcon ? "Upload Source Icon" : "Upload";
    var hint = isAppIcon
      ? "Recommended: " + (asset.recommendedSourceSize || "1024×1024") + ". All sizes auto-generated."
      : asset.imageFile || "iOS imageset";

    card.innerHTML =
      '<div class="image-gallery__card-preview">' +
      '<div class="image-gallery__preview-frame">' +
      (asset.previewUrl
        ? '<img class="image-gallery__preview-img" alt="" />'
        : '<span class="image-gallery__card-meta">No preview</span>') +
      "</div>" +
      "</div>" +
      '<div class="image-gallery__card-body">' +
      '<h3 class="image-gallery__card-name">' +
      asset.name +
      "</h3>" +
      '<p class="image-gallery__card-meta">' +
      hint +
      "</p>" +
      '<div class="image-gallery__card-actions">' +
      '<button type="button" class="image-gallery__btn image-gallery__btn--primary" data-action="ios-upload">' +
      uploadLabel +
      "</button>" +
      '<button type="button" class="image-gallery__btn image-gallery__btn--reset" data-action="ios-reset">Reset</button>' +
      "</div>" +
      "</div>";

    if (asset.previewUrl) {
      var img = card.querySelector(".image-gallery__preview-img");
      img.src = asset.previewUrl;
      img.alt = asset.name;
    }

    card.querySelector('[data-action="ios-upload"]').addEventListener("click", function () {
      pendingIosUploadKey = asset.key;
      iosFileInput.click();
    });

    card.querySelector('[data-action="ios-reset"]').addEventListener("click", function () {
      if (!global.IOSAssetManager) {
        return;
      }
      if (!asset.uploaded) {
        showToast(asset.name + " is already using the original asset.", "info");
        return;
      }
      global.IOSAssetManager.resetAsset(asset.key).then(
        function () {
          showToast(asset.name + " reset to original.", "success");
        },
        function (error) {
          showToast(error.message || "Reset failed.", "error");
        }
      );
    });

    return card;
  }

  function renderIosSection() {
    if (!contentEl || !global.IOSAssetManager) {
      return;
    }

    var assets = global.IOSAssetManager.getAll();
    if (!assets.length) {
      return;
    }

    var sectionEl = document.createElement("section");
    sectionEl.className = "image-gallery__section image-gallery__section--ios";
    sectionEl.innerHTML =
      '<header class="image-gallery__section-header">' +
      "<h2>IOS ASSETS</h2>" +
      "<p>Upload iOS imagesets and a single source app icon. AppIcon sizes are generated server-side.</p>" +
      "</header>" +
      '<div class="image-gallery__grid"></div>';

    var grid = sectionEl.querySelector(".image-gallery__grid");
    assets.forEach(function (asset) {
      grid.appendChild(buildIosAssetCard(asset));
    });

    contentEl.appendChild(sectionEl);
  }

  function buildGalleryShell() {
    galleryEl = document.createElement("div");
    galleryEl.id = "image-gallery-app";
    galleryEl.className = "image-gallery";
    galleryEl.hidden = true;

    galleryEl.innerHTML =
      '<header class="image-gallery__header">' +
      '<div class="image-gallery__header-left">' +
      '<button type="button" class="image-gallery__back" id="image-gallery-back">← Back</button>' +
      "</div>" +
      '<h1 class="image-gallery__title">Image Gallery</h1>' +
      '<div class="image-gallery__header-actions">' +
      '<button type="button" class="image-gallery__btn image-gallery__btn--ghost" id="image-gallery-upload-folder" disabled title="Coming soon">Upload Folder</button>' +
      '<button type="button" class="image-gallery__btn image-gallery__btn--ghost" id="image-gallery-reset-all">Reset All</button>' +
      '<button type="button" class="image-gallery__btn image-gallery__btn--accent" id="image-gallery-export">Export Assets</button>' +
      "</div>" +
      "</header>" +
      '<p class="image-gallery__toast" id="image-gallery-toast" hidden role="status"></p>' +
      '<main class="image-gallery__content" id="image-gallery-content"></main>';

    document.body.insertBefore(galleryEl, document.querySelector(".preview-shell"));

    contentEl = document.getElementById("image-gallery-content");

    fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".png,.jpg,.jpeg,.svg,.webp,image/png,image/jpeg,image/svg+xml,image/webp";
    fileInput.className = "theme-settings__file-input";
    fileInput.addEventListener("change", function (event) {
      var file = event.target.files && event.target.files[0];
      event.target.value = "";
      if (!file || !pendingUploadKey) {
        return;
      }

      global.AssetManager.uploadAsset(pendingUploadKey, file).then(
        function (asset) {
          showToast(asset.name + " uploaded. Previews updated.", "success");
          pendingUploadKey = null;
        },
        function (error) {
          showToast(error.message || "Upload failed.", "error");
          pendingUploadKey = null;
        }
      );
    });
    galleryEl.appendChild(fileInput);

    iosFileInput = document.createElement("input");
    iosFileInput.type = "file";
    iosFileInput.accept = ".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp";
    iosFileInput.className = "theme-settings__file-input";
    iosFileInput.addEventListener("change", function (event) {
      var file = event.target.files && event.target.files[0];
      event.target.value = "";
      if (!file || !pendingIosUploadKey || !global.IOSAssetManager) {
        return;
      }

      var uploadKey = pendingIosUploadKey;
      var uploadPromise =
        uploadKey === "IOS_APP_ICON"
          ? global.IOSAssetManager.uploadAppIconSource(file)
          : global.IOSAssetManager.uploadImageset(uploadKey, file);

      uploadPromise.then(
        function (asset) {
          if (uploadKey === "IOS_APP_ICON") {
            showToast("App icon uploaded. All iOS icon sizes generated.", "success");
          } else {
            showToast(asset.name + " uploaded.", "success");
          }
          pendingIosUploadKey = null;
        },
        function (error) {
          showToast(error.message || "Upload failed.", "error");
          pendingIosUploadKey = null;
        }
      );
    });
    galleryEl.appendChild(iosFileInput);

    document.getElementById("image-gallery-back").addEventListener("click", closeGallery);

    document.getElementById("image-gallery-reset-all").addEventListener("click", function () {
      global.AssetManager.resetAll();
      showToast("All assets reset to originals.", "success");
    });

    document.getElementById("image-gallery-export").addEventListener("click", function () {
      if (typeof global.exportAssetsZip !== "function") {
        showToast("Export is not available.", "error");
        return;
      }
      global.exportAssetsZip().then(
        function () {
          var zipName =
            global.EXPORT_PACKAGE_CONFIG && global.EXPORT_PACKAGE_CONFIG.packageZipFilename
              ? global.EXPORT_PACKAGE_CONFIG.packageZipFilename
              : "tragofone.zip";
          showToast("Exported " + zipName, "success");
        },
        function (error) {
          showToast(error.message || "Export failed.", "error");
        }
      );
    });

    global.AssetManager.onChange(renderGallery);
    if (global.IOSAssetManager) {
      global.IOSAssetManager.onChange(renderGallery);
    }
  }

  function buildLauncher(panel) {
    var section = document.createElement("section");
    section.className = "theme-settings__assets";
    section.setAttribute("aria-label", "Image gallery");

    var heading = document.createElement("h3");
    heading.className = "theme-settings__subtitle";
    heading.textContent = "Asset management";
    section.appendChild(heading);

    var btn = document.createElement("button");
    btn.type = "button";
    btn.id = "open-image-gallery-btn";
    btn.className = "theme-settings__download image-gallery-launcher__btn";
    btn.textContent = "Image Gallery";
    btn.addEventListener("click", openGallery);
    section.appendChild(btn);

    var hint = document.createElement("p");
    hint.className = "theme-settings__asset-empty";
    hint.textContent = "Manage logos, icons, and branding images.";
    section.appendChild(hint);

    panel.appendChild(section);
  }

  global.ImageGallery = {
    show: showGalleryPanel,
    hide: hideGalleryPanel,
    open: openGallery,
    close: closeGallery,
    render: renderGallery,
    isOpen: function () {
      return global.TragoScreenNav && global.TragoScreenNav.isImageGalleryActive();
    },
  };

  global.buildAssetSettingsSection = function (panel, showMessage) {
    global.showGalleryToast = function (message, type) {
      if (typeof showMessage === "function") {
        showMessage(message, type);
      }
    };
    buildLauncher(panel);
  };
})(window);
