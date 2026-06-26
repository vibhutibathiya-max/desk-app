/**
 * Builds tragofone.zip from ZIP-derived export config + live white-label state.
 */
(function initPackageExport(global) {
  "use strict";

  function ensureJSZip() {
    if (typeof global.JSZip !== "function") {
      throw new Error("JSZip is not loaded. Reload the page.");
    }
    return global.JSZip;
  }

  function getExportConfig() {
    var config = global.EXPORT_PACKAGE_CONFIG;
    if (!config || !config.files || !config.files.length) {
      throw new Error("Export package config is not loaded. Run: npm run generate:export-manifest");
    }
    return config;
  }

  function triggerBlobDownload(blob, filename) {
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function fetchReferenceBlob(relativePath) {
    var config = getExportConfig();
    var referenceRoot = config.referenceRoot || "reference/epicrange/";
    return fetch(referenceRoot + relativePath).then(function (response) {
      if (!response.ok) {
        throw new Error("Missing reference file: " + relativePath);
      }
      return response.blob();
    });
  }

  function resolvePackageFileData(fileEntry) {
    if (fileEntry.dynamic === "theme") {
      if (typeof global.exportPackageThemeJS !== "function") {
        return Promise.reject(new Error("Package theme export is not available."));
      }
      return global.exportPackageThemeJS();
    }

    if (fileEntry.platform === "ios" && global.IOSAssetManager) {
      return global.IOSAssetManager.getExportBlob(fileEntry);
    }

    if (fileEntry.customizable && fileEntry.registryKey && global.AssetManager) {
      return global.AssetManager.getAssetBlob(fileEntry.registryKey);
    }

    return fetchReferenceBlob(fileEntry.path);
  }

  /**
   * Export white-label package (app + patches + ios at ZIP root).
   * @returns {Promise<void>}
   */
  function exportEpicrangePackage() {
    var JSZip = ensureJSZip();
    var config = getExportConfig();

    var tasks = config.files.map(function (fileEntry) {
      return resolvePackageFileData(fileEntry).then(function (data) {
        return { path: fileEntry.path, data: data };
      });
    });

    return Promise.all(tasks).then(function (resolvedFiles) {
      var zip = new JSZip();

      resolvedFiles.forEach(function (file) {
        zip.file(file.path, file.data);
      });

      return zip.generateAsync({ type: "blob" }).then(function (blob) {
        triggerBlobDownload(blob, config.packageZipFilename || "tragofone.zip");
      });
    });
  }

  global.exportEpicrangePackage = exportEpicrangePackage;
})(window);
