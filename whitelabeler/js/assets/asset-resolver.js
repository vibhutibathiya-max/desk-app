/**
 * Binds registry assets to screen markup via data-asset-key attributes.
 */
(function initAssetResolver(global) {
  "use strict";

  function bindRegistryToMarkup() {
    if (!global.ASSET_REGISTRY || !global.AssetManager) {
      return;
    }

    global.ASSET_REGISTRY.forEach(function (entry) {
      var nodes = document.querySelectorAll('[data-asset-key="' + entry.key + '"]');
      nodes.forEach(function (node) {
        if (!node.getAttribute("src") && entry.original) {
          node.setAttribute("src", entry.original);
        }
      });
    });

    global.AssetManager.applyToDOM();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindRegistryToMarkup);
  }

  document.addEventListener("screens:loaded", bindRegistryToMarkup);
})(window);
