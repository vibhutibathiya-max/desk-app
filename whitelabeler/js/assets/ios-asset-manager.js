/**
 * iOS asset state — imageset uploads and generated AppIcon.appiconset.
 */
(function initIosAssetManager(global) {
  "use strict";

  var ALLOWED_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp"];
  var ALLOWED_MIME_PREFIX = "image/";

  function getRegistry() {
    return global.IOS_ASSET_REGISTRY || [];
  }

  function getRegistryEntry(key) {
    var registry = getRegistry();
    for (var index = 0; index < registry.length; index += 1) {
      if (registry[index].key === key) {
        return registry[index];
      }
    }
    return null;
  }

  function getReferenceRoot() {
    var config = global.EXPORT_PACKAGE_CONFIG || {};
    return config.referenceRoot || "reference/epicrange/";
  }

  function fetchReferenceBlob(relativePath) {
    return fetch(getReferenceRoot() + relativePath).then(function (response) {
      if (!response.ok) {
        throw new Error("Could not load " + relativePath);
      }
      return response.blob();
    });
  }

  function validateImageFile(file) {
    if (!file || typeof file.name !== "string") {
      return "Invalid file.";
    }

    var dot = file.name.lastIndexOf(".");
    var ext = dot === -1 ? "" : file.name.slice(dot).toLowerCase();

    if (ALLOWED_EXTENSIONS.indexOf(ext) === -1) {
      return "Unsupported file type. Use PNG, JPG, or WebP.";
    }

    if (file.type && file.type.indexOf(ALLOWED_MIME_PREFIX) !== 0) {
      return "Unsupported file type.";
    }

    return null;
  }

  function base64ToBlob(base64, mimeType) {
    var binary = atob(base64);
    var length = binary.length;
    var bytes = new Uint8Array(length);
    for (var index = 0; index < length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }
    return new Blob([bytes], { type: mimeType || "image/png" });
  }

  var IOSAssetManager = {
    _state: {},
    _listeners: [],

    init: function () {
      var self = this;
      getRegistry().forEach(function (entry) {
        if (!entry.customizable) {
          return;
        }

        self._state[entry.key] = {
          key: entry.key,
          type: entry.type,
          uploaded: false,
          previewUrl: null,
          sourceFile: null,
          generatedIcons: {},
        };

        if (entry.type === "imageset" && entry.exportPath) {
          self._primeImagesetPreview(entry.key, entry.exportPath);
        } else if (entry.type === "appiconset" && entry.exportPathPrefix) {
          self._primeAppIconPreview(entry);
        }
      });
    },

    _primeImagesetPreview: function (key, exportPath) {
      var self = this;
      fetchReferenceBlob(exportPath).then(function (blob) {
        var state = self._state[key];
        if (!state || state.uploaded) {
          return;
        }
        state.previewUrl = URL.createObjectURL(blob);
        self._notify();
      });
    },

    _primeAppIconPreview: function (entry) {
      var self = this;
      var previewPath = entry.exportPathPrefix + "1024.png";
      fetchReferenceBlob(previewPath).then(function (blob) {
        var state = self._state[entry.key];
        if (!state || state.uploaded) {
          return;
        }
        state.previewUrl = URL.createObjectURL(blob);
        self._notify();
      });
    },

    onChange: function (listener) {
      this._listeners.push(listener);
      return function unsubscribe() {
        IOSAssetManager._listeners = IOSAssetManager._listeners.filter(function (item) {
          return item !== listener;
        });
      };
    },

    _notify: function () {
      this._listeners.forEach(function (listener) {
        listener(IOSAssetManager.getAll());
      });
    },

    getAll: function () {
      var self = this;
      return getRegistry()
        .filter(function (entry) {
          return entry.customizable;
        })
        .map(function (entry) {
          return self.getAsset(entry.key);
        })
        .filter(Boolean);
    },

    getAsset: function (key) {
      var entry = getRegistryEntry(key);
      var state = this._state[key];
      if (!entry || !state) {
        return null;
      }

      return {
        key: entry.key,
        name: entry.name,
        type: entry.type,
        uploaded: state.uploaded,
        previewUrl: state.previewUrl,
        exportPath: entry.exportPath || null,
        exportPathPrefix: entry.exportPathPrefix || null,
        recommendedSourceSize: entry.recommendedSourceSize || null,
        imageFile: entry.imageFile || null,
      };
    },

    uploadImageset: function (key, file) {
      var self = this;
      var entry = getRegistryEntry(key);
      var state = this._state[key];

      if (!entry || entry.type !== "imageset" || !state) {
        return Promise.reject(new Error("Unknown iOS imageset."));
      }

      var validationError = validateImageFile(file);
      if (validationError) {
        return Promise.reject(new Error(validationError));
      }

      if (state.previewUrl && state.uploaded) {
        URL.revokeObjectURL(state.previewUrl);
      }

      state.uploaded = true;
      state.sourceFile = file;
      state.previewUrl = URL.createObjectURL(file);
      self._notify();
      return Promise.resolve(self.getAsset(key));
    },

    uploadAppIconSource: function (file) {
      var self = this;
      var key = "IOS_APP_ICON";
      var state = this._state[key];

      if (!state) {
        return Promise.reject(new Error("App icon set is not configured."));
      }

      var validationError = validateImageFile(file);
      if (validationError) {
        return Promise.reject(new Error(validationError));
      }

      return file
        .arrayBuffer()
        .then(function (buffer) {
          return fetch("/api/ios/generate-app-icons", {
            method: "POST",
            headers: {
              "Content-Type": "application/octet-stream",
              "X-Source-Filename": file.name,
            },
            body: buffer,
          });
        })
        .then(function (response) {
          if (!response.ok) {
            return response.text().then(function (text) {
              throw new Error(text || "Could not generate iOS app icons.");
            });
          }
          return response.json();
        })
        .then(function (payload) {
          if (!payload || !payload.icons) {
            throw new Error("Invalid icon generation response.");
          }

          if (state.previewUrl && state.uploaded) {
            URL.revokeObjectURL(state.previewUrl);
          }

          state.uploaded = true;
          state.sourceFile = file;
          state.previewUrl = URL.createObjectURL(file);
          state.generatedIcons = {};

          Object.keys(payload.icons).forEach(function (filename) {
            state.generatedIcons[filename] = base64ToBlob(payload.icons[filename], "image/png");
          });

          self._notify();
          return self.getAsset(key);
        });
    },

    resetAsset: function (key) {
      var entry = getRegistryEntry(key);
      var state = this._state[key];
      if (!entry || !state) {
        return Promise.reject(new Error("Unknown iOS asset."));
      }

      if (state.previewUrl && state.uploaded) {
        URL.revokeObjectURL(state.previewUrl);
      }

      state.uploaded = false;
      state.sourceFile = null;
      state.generatedIcons = {};
      state.previewUrl = null;

      if (entry.type === "imageset" && entry.exportPath) {
        return fetchReferenceBlob(entry.exportPath).then(
          function (blob) {
            state.previewUrl = URL.createObjectURL(blob);
            IOSAssetManager._notify();
            return IOSAssetManager.getAsset(key);
          }
        );
      }

      if (entry.type === "appiconset") {
        return fetchReferenceBlob(entry.exportPathPrefix + "1024.png").then(
          function (blob) {
            state.previewUrl = URL.createObjectURL(blob);
            IOSAssetManager._notify();
            return IOSAssetManager.getAsset(key);
          }
        );
      }

      IOSAssetManager._notify();
      return Promise.resolve(IOSAssetManager.getAsset(key));
    },

    getExportBlob: function (fileEntry) {
      var registryKey = fileEntry.registryKey;
      var state = registryKey ? this._state[registryKey] : null;

      if (registryKey === "IOS_APP_ICON" && fileEntry.appIconFile && state && state.uploaded) {
        var generated = state.generatedIcons[fileEntry.appIconFile];
        if (generated) {
          return Promise.resolve(generated);
        }
      }

      if (state && state.uploaded && state.sourceFile && fileEntry.path === getRegistryEntry(registryKey).exportPath) {
        return Promise.resolve(state.sourceFile);
      }

      return fetchReferenceBlob(fileEntry.path);
    },
  };

  if (global.IOS_ASSET_REGISTRY) {
    IOSAssetManager.init();
  }

  global.IOSAssetManager = IOSAssetManager;
})(window);
