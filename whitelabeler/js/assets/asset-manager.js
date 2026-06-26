/**
 * Registry-driven asset state: upload, reset, resolve URLs, apply to DOM.
 */
(function initAssetManager(global) {
  "use strict";

  var ALLOWED_EXTENSIONS = [".png", ".jpg", ".jpeg", ".svg", ".webp"];
  var ALLOWED_MIME_PREFIX = "image/";
  var STORAGE_KEY = "TRAGO_ASSET_OVERRIDES";

  function fetchOriginalAssetBlob(path) {
    return fetch(path).then(function (response) {
      if (!response.ok) {
        throw new Error("Could not load " + path);
      }
      return response.blob();
    });
  }

  var AssetManager = {
    _state: {},
    _listeners: [],

    init: function () {
      if (!global.ASSET_REGISTRY) {
        return;
      }

      global.ASSET_REGISTRY.forEach(
        function (entry) {
          this._state[entry.key] = {
            key: entry.key,
            original: entry.original,
            current: entry.original,
            uploaded: false,
            fileName: entry.fileName,
            fileType: null,
            fileSize: null,
            width: null,
            height: null,
            previewUrl: null,
            originalFile: null,
          };
        }.bind(this)
      );

      this._loadPersistedOverrides();
    },

    onChange: function (listener) {
      this._listeners.push(listener);
      return function unsubscribe() {
        AssetManager._listeners = AssetManager._listeners.filter(function (item) {
          return item !== listener;
        });
      };
    },

    _notify: function () {
      this._listeners.forEach(function (listener) {
        listener(AssetManager.getAll());
      });
    },

    getAll: function () {
      var result = [];
      Object.keys(this._state).forEach(
        function (key) {
          result.push(this.getAsset(key));
        }.bind(this)
      );
      return result;
    },

    getAsset: function (key) {
      var state = this._state[key];
      var entry = global.getAssetRegistryEntry ? global.getAssetRegistryEntry(key) : null;
      if (!state) {
        return null;
      }

      return {
        key: state.key,
        name: entry ? entry.name : state.key,
        fileName: state.uploaded ? state.fileName : entry ? entry.fileName : state.fileName,
        original: state.original,
        current: state.current,
        uploaded: state.uploaded,
        fileType: state.fileType,
        fileSize: state.fileSize,
        width: state.width,
        height: state.height,
        previewUrl: state.previewUrl || state.current,
        section: entry ? entry.section : null,
        usageScreens: entry ? entry.usageScreens : [],
        expectedDimensions: entry ? entry.expectedDimensions : null,
        platforms: entry ? entry.platforms : [],
        variant: entry ? entry.variant : null,
        exportName: entry ? entry.exportName : null,
        exportPath: entry ? entry.exportPath : null,
        customizable: entry ? entry.customizable : false,
      };
    },

    getUrl: function (key) {
      var state = this._state[key];
      return state ? state.current : null;
    },

    validateAssetFile: function (file) {
      if (!file || typeof file.name !== "string") {
        return "Invalid file.";
      }

      var dot = file.name.lastIndexOf(".");
      var ext = dot === -1 ? "" : file.name.slice(dot).toLowerCase();

      if (ALLOWED_EXTENSIONS.indexOf(ext) === -1) {
        return "Unsupported file type. Use PNG, JPG, SVG, or WebP.";
      }

      if (file.type && file.type.indexOf(ALLOWED_MIME_PREFIX) !== 0 && ext !== ".svg") {
        return "Unsupported file type.";
      }

      return null;
    },

    _readImageDimensions: function (file, previewUrl) {
      return new Promise(function (resolve, reject) {
        if (!file.type || file.type.indexOf("svg") !== -1 || /\.svg$/i.test(file.name)) {
          resolve({ width: null, height: null });
          return;
        }

        var img = new Image();
        img.onload = function () {
          if (!img.naturalWidth || !img.naturalHeight) {
            reject(new Error("Corrupted or unreadable image."));
            return;
          }
          resolve({ width: img.naturalWidth, height: img.naturalHeight });
        };
        img.onerror = function () {
          reject(new Error("Corrupted or unreadable image."));
        };
        img.src = previewUrl;
      });
    },

    uploadAsset: function (key, file) {
      var self = this;
      var state = this._state[key];
      var entry = global.getAssetRegistryEntry ? global.getAssetRegistryEntry(key) : null;

      if (!state || !entry) {
        return Promise.reject(new Error("Unknown asset."));
      }

      var validationError = this.validateAssetFile(file);
      if (validationError) {
        return Promise.reject(new Error(validationError));
      }

      var previewUrl = URL.createObjectURL(file);

      return this._readImageDimensions(file, previewUrl).then(
        function (dimensions) {
          if (state.previewUrl && state.uploaded) {
            URL.revokeObjectURL(state.previewUrl);
          }

          state.current = previewUrl;
          state.previewUrl = previewUrl;
          state.uploaded = true;
          state.fileName = file.name;
          state.fileType = file.type || "application/octet-stream";
          state.fileSize = file.size;
          state.width = dimensions.width;
          state.height = dimensions.height;
          state.originalFile = file;

          self.applyToDOM();
          self._persistOverrides();
          self._notify();
          return self.getAsset(key);
        },
        function (error) {
          URL.revokeObjectURL(previewUrl);
          throw error;
        }
      );
    },

    resetAsset: function (key) {
      var state = this._state[key];
      if (!state) {
        return false;
      }

      if (state.previewUrl && state.uploaded) {
        URL.revokeObjectURL(state.previewUrl);
      }

      state.current = state.original;
      state.previewUrl = null;
      state.uploaded = false;
      state.fileName = global.getAssetRegistryEntry(key).fileName;
      state.fileType = null;
      state.fileSize = null;
      state.width = null;
      state.height = null;
      state.originalFile = null;

      this.applyToDOM();
      this._persistOverrides();
      this._notify();
      return true;
    },

    resetAll: function () {
      var self = this;
      Object.keys(this._state).forEach(function (key) {
        if (self._state[key].uploaded) {
          self.resetAsset(key);
        }
      });
    },

    applyToDOM: function () {
      if (!global.ASSET_REGISTRY) {
        return;
      }

      var viewport = document.getElementById("device-viewport");
      if (!viewport) {
        return;
      }

      global.ASSET_REGISTRY.forEach(
        function (entry) {
          var url = this.getUrl(entry.key);
          if (!url) {
            return;
          }

          entry.selectors.forEach(function (selector) {
            viewport.querySelectorAll(selector).forEach(function (node) {
              if (node.tagName === "IMG" || node.tagName === "IMAGE") {
                node.setAttribute("src", url);
              } else {
                node.style.backgroundImage = 'url("' + url + '")';
              }
            });
          });
        }.bind(this)
      );
    },

    /**
     * Blob for export: uploaded file or fetched original.
     * @param {string} key
     * @returns {Promise<Blob|File>}
     */
    getAssetBlob: function (key) {
      var state = this._state[key];
      if (!state) {
        return Promise.reject(new Error("Unknown asset: " + key));
      }

      if (state.uploaded && state.originalFile) {
        return Promise.resolve(state.originalFile);
      }

      return fetchOriginalAssetBlob(state.original);
    },

    getExportableAssets: function () {
      var assets = [];
      Object.keys(this._state).forEach(
        function (key) {
          var state = this._state[key];
          if (state.uploaded && state.originalFile) {
            var entry = global.getAssetRegistryEntry(key);
            assets.push({
              key: key,
              fileName: state.fileName,
              exportName: entry ? entry.fileName : state.fileName,
              fileType: state.fileType,
              fileSize: state.fileSize,
              role: key,
              originalFile: state.originalFile,
            });
          }
        }.bind(this)
      );
      return assets;
    },

    getExportPayload: function () {
      var self = this;
      if (!global.ASSET_REGISTRY) {
        return Promise.resolve([]);
      }

      var tasks = global.ASSET_REGISTRY.map(function (entry) {
        var state = self._state[entry.key];
        if (!state) {
          return Promise.resolve(null);
        }

        if (state.uploaded && state.originalFile) {
          return Promise.resolve({
            key: entry.key,
            exportName: entry.fileName,
            data: state.originalFile,
            uploaded: true,
          });
        }

        return fetchOriginalAssetBlob(state.original)
          .then(function (blob) {
            return {
              key: entry.key,
              exportName: entry.fileName,
              data: blob,
              uploaded: false,
            };
          })
          .catch(function () {
            return null;
          });
      });

      return Promise.all(tasks).then(function (results) {
        return results.filter(function (item) {
          return item !== null;
        });
      });
    },

    _persistOverrides: function () {
      try {
        var payload = {};
        Object.keys(this._state).forEach(
          function (key) {
            if (this._state[key].uploaded) {
              payload[key] = {
                fileName: this._state[key].fileName,
                fileType: this._state[key].fileType,
              };
            }
          }.bind(this)
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch (error) {
        /* session-only if storage unavailable */
      }
    },

    _loadPersistedOverrides: function () {
      /* Blob URLs cannot survive reload — overrides are session-only */
    },
  };

  AssetManager.init();

  global.AssetManager = AssetManager;

  document.addEventListener("screens:loaded", function () {
    AssetManager.applyToDOM();
  });
})(window);
