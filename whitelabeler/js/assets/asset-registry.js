/**
 * Central registry for all white-label branding assets.
 * Screens consume images via data-asset-key; AssetManager resolves URLs.
 */
(function initAssetRegistry(global) {
  "use strict";

  var ASSET_SECTIONS = [
    {
      id: "logo-images",
      title: "LOGO IMAGES",
      hint:
        "Splash, login, and header logos. Allowed sizes vary by asset — upload PNG, JPG, SVG, or WebP.",
    },
    {
      id: "device-laptop",
      title: "DEVICE / LAPTOP IMAGES",
      hint:
        "Large branding graphics used on login and onboarding flows. Recommended 552 × 440px where noted.",
    },
    {
      id: "icons",
      title: "ICONS",
      hint: "App icon, badge, gallery, and notification icons used across Android, iOS, and React Native.",
    },
    {
      id: "other-branding",
      title: "OTHER BRANDING ASSETS",
      hint: "Watermarks, patterns, and placeholder images for offline or decorative use.",
    },
  ];

  var ASSET_REGISTRY = [
    {
      key: "SPLASH_LOGO",
      name: "Splash Logo",
      fileName: "brand-icon.png",
      original: "assets/images/brand-icon.png",
      section: "logo-images",
      platforms: ["android", "ios", "react-native"],
      selectors: ['[data-asset-key="SPLASH_LOGO"]', ".brand-logo"],
      usageScreens: [{ id: "splash", label: "Splash Screen" }],
      expectedDimensions: "160 × 160",
    },
    {
      key: "SPLASH_WORDMARK",
      name: "Splash Wordmark",
      fileName: "brand-wordmark.png",
      original: "assets/images/brand-wordmark.png",
      section: "logo-images",
      platforms: ["android", "ios", "react-native"],
      selectors: ['[data-asset-key="SPLASH_WORDMARK"]', ".brand-wordmark"],
      usageScreens: [{ id: "splash", label: "Splash Screen" }],
      expectedDimensions: "200 × 32",
    },
    {
      key: "HEADER_LOGO_LIGHT",
      name: "Header Logo (Light)",
      fileName: "brand-wordmark.png",
      original: "assets/images/brand-wordmark.png",
      section: "logo-images",
      platforms: ["android", "ios", "react-native"],
      selectors: ['[data-asset-key="HEADER_LOGO_LIGHT"]'],
      usageScreens: [
        { id: "splash", label: "Splash Screen" },
        { id: "home", label: "Home Dialer" },
      ],
      expectedDimensions: "47 × 50",
      variant: "light",
    },
    {
      key: "HEADER_LOGO_DARK",
      name: "Header Logo (Dark)",
      fileName: "company-logo-white.png",
      original: "assets/images/branding/company-logo-white.png",
      section: "logo-images",
      platforms: ["android", "ios", "react-native"],
      selectors: ['[data-asset-key="HEADER_LOGO_DARK"]'],
      usageScreens: [
        { id: "splash", label: "Splash Screen" },
        { id: "login", label: "Login Screen" },
      ],
      expectedDimensions: "294 × 68",
      variant: "dark",
    },
    {
      key: "LOGIN_LOGO",
      name: "Login Logo",
      fileName: "logo.png",
      original: "assets/images/login/logo.png",
      section: "logo-images",
      platforms: ["android", "ios", "react-native"],
      selectors: ['[data-asset-key="LOGIN_LOGO"]', ".login-logo"],
      usageScreens: [{ id: "login", label: "Login Screen" }],
      expectedDimensions: "273 × 89",
    },
    {
      key: "APP_LOGO",
      name: "App Logo",
      fileName: "trago-gradient-logo.png",
      original: "assets/images/branding/trago-gradient-logo.png",
      section: "logo-images",
      platforms: ["react-native"],
      selectors: ['[data-asset-key="APP_LOGO"]'],
      usageScreens: [
        { id: "get-started", label: "Get Started" },
        { id: "home", label: "Home Dialer" },
      ],
      expectedDimensions: "129 × 41",
    },
    {
      key: "ONBOARDING_DEVICE",
      name: "Device / Laptop Image",
      fileName: "onboarding-bg.png",
      original: "assets/images/onboarding-bg.png",
      section: "device-laptop",
      platforms: ["android", "ios", "react-native"],
      selectors: ['[data-asset-key="ONBOARDING_DEVICE"]'],
      usageScreens: [
        { id: "get-started", label: "Get Started" },
        { id: "login", label: "Login Screen" },
      ],
      expectedDimensions: "552 × 440",
    },
    {
      key: "APP_ICON",
      name: "App Icon",
      fileName: "app-icon-squircle.png",
      original: "assets/images/app-icon-squircle.png",
      section: "icons",
      platforms: ["android", "ios", "react-native"],
      selectors: ['[data-asset-key="APP_ICON"]', ".app-icon"],
      usageScreens: [{ id: "get-started", label: "Get Started" }],
      expectedDimensions: "168 × 168",
    },
    {
      key: "APP_BADGE",
      name: "App Badge",
      fileName: "app-badge.svg",
      original: "assets/icons/app-badge.svg",
      section: "icons",
      platforms: ["android", "ios", "react-native"],
      selectors: ['[data-asset-key="APP_BADGE"]', ".app-badge__icon"],
      usageScreens: [
        { id: "splash", label: "Splash Screen" },
        { id: "login", label: "Login Screen" },
      ],
      expectedDimensions: "24 × 24",
    },
    {
      key: "IMAGE_GALLERY_ICON",
      name: "Image Gallery Icon",
      fileName: "image-gallery.png",
      original: "assets/icons/image-gallery.png",
      section: "icons",
      platforms: ["react-native"],
      selectors: ['[data-asset-key="IMAGE_GALLERY_ICON"]'],
      usageScreens: [{ id: "settings", label: "Settings" }],
      expectedDimensions: "48 × 48",
    },
    {
      key: "AUDIO_NOTIFICATION",
      name: "Audio Notification",
      fileName: "audio.png",
      original: "assets/icons/notifications/audio.png",
      section: "icons",
      platforms: ["android", "ios", "react-native"],
      selectors: ['[data-asset-key="AUDIO_NOTIFICATION"]'],
      usageScreens: [{ id: "mms-mp3", label: "MMS — MP3" }],
      expectedDimensions: "48 × 48",
    },
    {
      key: "VIDEO_NOTIFICATION",
      name: "Video Notification",
      fileName: "video.png",
      original: "assets/icons/notifications/video.png",
      section: "icons",
      platforms: ["android", "ios", "react-native"],
      selectors: ['[data-asset-key="VIDEO_NOTIFICATION"]'],
      usageScreens: [{ id: "mms-mp3", label: "MMS — MP3" }],
      expectedDimensions: "48 × 48",
    },
    {
      key: "DOCUMENT_NOTIFICATION",
      name: "Document Notification",
      fileName: "document.png",
      original: "assets/icons/notifications/document.png",
      section: "icons",
      platforms: ["android", "ios", "react-native"],
      selectors: ['[data-asset-key="DOCUMENT_NOTIFICATION"]'],
      usageScreens: [{ id: "mms-doc", label: "MMS — Doc" }],
      expectedDimensions: "48 × 48",
    },
    {
      key: "HOME_WATERMARK",
      name: "Home Watermark",
      fileName: "home-watermark.png",
      original: "assets/images/home-watermark.png",
      section: "other-branding",
      platforms: ["android", "ios", "react-native"],
      selectors: ['[data-asset-key="HOME_WATERMARK"]', ".home-watermark"],
      usageScreens: [{ id: "home", label: "Home Dialer" }],
      expectedDimensions: "330 × 110",
    },
    {
      key: "TECHNOLOGY_PATTERN",
      name: "Technology Pattern",
      fileName: "technology-pattern.png",
      original: "assets/images/branding/technology-pattern.png",
      section: "other-branding",
      platforms: ["react-native"],
      selectors: ['[data-asset-key="TECHNOLOGY_PATTERN"]'],
      usageScreens: [{ id: "get-started", label: "Get Started" }],
      expectedDimensions: "Full bleed",
    },
    {
      key: "BROKEN_CONNECTION",
      name: "Broken Connection Placeholder",
      fileName: "broken-connection.png",
      original: "assets/images/branding/broken-connection.png",
      section: "other-branding",
      platforms: ["react-native"],
      selectors: ['[data-asset-key="BROKEN_CONNECTION"]'],
      usageScreens: [{ id: "settings", label: "Settings" }],
      expectedDimensions: "256 × 256",
    },
  ];

  var exportPathIndex = null;

  function basenameFromPath(filePath) {
    var parts = filePath.split("/");
    return parts[parts.length - 1];
  }

  function applyExportPackageLinks() {
    var config = global.EXPORT_PACKAGE_CONFIG;
    var links = config && config.galleryLinks ? config.galleryLinks : {};

    ASSET_REGISTRY.forEach(function (entry) {
      var exportPath = links[entry.key] || null;
      entry.exportPath = exportPath;
      entry.exportName = exportPath ? basenameFromPath(exportPath) : null;
      entry.customizable = true;
      entry.packageExportable = Boolean(exportPath);
    });

    exportPathIndex = null;
  }

  function buildExportPathIndex() {
    if (exportPathIndex) {
      return exportPathIndex;
    }

    exportPathIndex = {};
    ASSET_REGISTRY.forEach(function (entry) {
      if (entry.exportPath) {
        exportPathIndex[entry.exportPath] = entry;
      }
    });
    return exportPathIndex;
  }

  function getAssetRegistryEntryByExportPath(exportPath) {
    return buildExportPathIndex()[exportPath] || null;
  }

  function getRegistryEntry(key) {
    var index;
    for (index = 0; index < ASSET_REGISTRY.length; index += 1) {
      if (ASSET_REGISTRY[index].key === key) {
        return ASSET_REGISTRY[index];
      }
    }
    return null;
  }

  function getAssetsBySection(sectionId) {
    return ASSET_REGISTRY.filter(function (entry) {
      return entry.section === sectionId;
    });
  }

  function buildAssetMap() {
    var map = {};
    ASSET_REGISTRY.forEach(function (entry) {
      map[entry.key] = entry.original;
    });
    return map;
  }

  applyExportPackageLinks();

  global.ASSET_SECTIONS = ASSET_SECTIONS;
  global.ASSET_REGISTRY = ASSET_REGISTRY;
  global.ASSET_MAP = buildAssetMap();
  global.getAssetRegistryEntry = getRegistryEntry;
  global.getAssetRegistryEntryByExportPath = getAssetRegistryEntryByExportPath;
  global.getAssetsBySection = getAssetsBySection;
})(window);
