/**
 * ZIP export — full epicrange/app white-label package.
 */
(function initAssetExport(global) {
  "use strict";

  /**
   * Export complete epicrange/app package (theme + all assets).
   * @returns {Promise<void>}
   */
  function exportAssetsZip() {
    if (typeof global.exportEpicrangePackage !== "function") {
      return Promise.reject(new Error("Package export is not available."));
    }
    return global.exportEpicrangePackage();
  }

  /** @deprecated Use exportAssetsZip — exports the full epicrange package. */
  function exportWhiteLabelPackage() {
    return exportAssetsZip();
  }

  global.exportAssetsZip = exportAssetsZip;
  global.exportWhiteLabelPackage = exportWhiteLabelPackage;
})(window);
