/**
 * Screen preview navigator — switches visible screen inside the device frame.
 */

function initScreenNav() {
  const viewport = document.getElementById("device-viewport");
  const select = document.getElementById("screen-select");
  const previewShell = document.querySelector(".preview-shell");
  const galleryId = window.IMAGE_GALLERY_SCREEN_ID || "image-gallery";

  if (!viewport || !select) {
    return;
  }

  const panels = Array.from(viewport.querySelectorAll(".screen-panel"));
  let lastRealScreenId =
    window.TRAGO_SCREENS.find((screen) => screen.default)?.id || panels[0]?.dataset.screen || "splash";
  let previousSelectValue = select.value;

  function showGalleryView() {
    if (previewShell) {
      previewShell.hidden = true;
    }
    document.body.classList.add("is-image-gallery-open");
    if (window.ImageGallery && typeof window.ImageGallery.show === "function") {
      window.ImageGallery.show();
    }
  }

  function hideGalleryView() {
    document.body.classList.remove("is-image-gallery-open");
    if (window.ImageGallery && typeof window.ImageGallery.hide === "function") {
      window.ImageGallery.hide();
    }
    if (previewShell) {
      previewShell.hidden = false;
      previewShell.removeAttribute("hidden");
    }
  }

  function showScreenPanels(screenId) {
    const isChangeStatus = screenId === "chats-change-status";
    const activeScreenId = isChangeStatus ? "chats" : screenId;
    let found = false;

    panels.forEach((panel) => {
      const isActive = panel.dataset.screen === activeScreenId;
      panel.classList.toggle("screen-panel--active", isActive);
      panel.hidden = !isActive;

      if (isActive) {
        found = true;
      }
    });

    viewport.classList.toggle("is-change-status-open", isChangeStatus);

    const statusSheet = viewport.querySelector(".status-sheet");
    if (statusSheet) {
      statusSheet.setAttribute("aria-hidden", String(!isChangeStatus));
    }

    if (!found && panels.length > 0) {
      const fallbackId = panels[0].dataset.screen;
      select.value = fallbackId;
      showScreen(fallbackId);
      return;
    }

    if (window.AssetManager && typeof window.AssetManager.applyToDOM === "function") {
      window.AssetManager.applyToDOM();
    }
  }

  function showScreen(screenId) {
    if (screenId === galleryId) {
      showGalleryView();
      return;
    }

    hideGalleryView();
    lastRealScreenId = screenId;
    showScreenPanels(screenId);
  }

  select.addEventListener("change", () => {
    const newValue = select.value;

    if (newValue === galleryId && previousSelectValue !== galleryId) {
      lastRealScreenId = previousSelectValue;
    }

    showScreen(newValue);
    previousSelectValue = newValue;
  });

  previousSelectValue = select.value;
  showScreen(select.value);

  window.TragoScreenNav = {
    showScreen: showScreen,
    getActiveScreenId: function () {
      return select.value;
    },
    setActiveScreenId: function (screenId) {
      if (screenId === galleryId && select.value !== galleryId) {
        lastRealScreenId = select.value;
      }
      previousSelectValue = screenId;
      select.value = screenId;
      showScreen(screenId);
    },
    getLastRealScreenId: function () {
      return lastRealScreenId;
    },
    openImageGallery: function () {
      if (select.value !== galleryId) {
        lastRealScreenId = select.value;
      }
      previousSelectValue = galleryId;
      select.value = galleryId;
      showScreen(galleryId);
    },
    closeImageGallery: function () {
      previousSelectValue = lastRealScreenId;
      select.value = lastRealScreenId;
      showScreen(lastRealScreenId);
    },
    isImageGalleryActive: function () {
      return select.value === galleryId;
    },
  };
}

function bootstrapScreenNav() {
  if (window.__screensLoaded) {
    initScreenNav();
    return;
  }

  document.addEventListener("screens:loaded", initScreenNav, { once: true });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrapScreenNav);
} else {
  bootstrapScreenNav();
}
