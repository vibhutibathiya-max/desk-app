#!/usr/bin/env node
/**
 * Reads canonical structure from epicrange.zip (+ icons zip) and generates:
 * - reference/epicrange/package-manifest.json
 * - reference/epicrange_only_icons/package-manifest.json
 * - js/assets/export-config.js
 *
 * Usage:
 *   node scripts/generate-export-manifest.mjs [epicrange.zip] [epicrange_only_icons.zip]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import JSZip from "jszip";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DEFAULT_EPICRANGE_ZIP = path.join(ROOT, "reference", "zips", "epicrange.zip");
const DEFAULT_ICONS_ZIP = path.join(ROOT, "reference", "zips", "epicrange_only_icons.zip");
const LINKS_FILE = path.join(ROOT, "reference", "export-asset-links.json");
const IOS_LINKS_FILE = path.join(ROOT, "reference", "export-ios-asset-links.json");
const EXPORT_CONFIG_JS = path.join(ROOT, "js", "assets", "export-config.js");
const IOS_ASSET_CONFIG_JS = path.join(ROOT, "js", "assets", "ios-asset-config.js");
const PACKAGE_ZIP_FILENAME = "tragofone.zip";

const EPICRANGE_ZIP = process.argv[2] || DEFAULT_EPICRANGE_ZIP;
const ICONS_ZIP = process.argv[3] || DEFAULT_ICONS_ZIP;
const EXPORT_SCOPES = ["app", "patches", "ios"];

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function copyZipToReference(zipPath, destName) {
  ensureDir(path.dirname(destName));
  fs.copyFileSync(zipPath, destName);
}

async function readZipEntries(zipPath) {
  const buffer = fs.readFileSync(zipPath);
  const zip = await JSZip.loadAsync(buffer);
  const entries = [];

  zip.forEach((relativePath, file) => {
    if (file.dir) {
      return;
    }
    entries.push({
      relativePath,
      fileName: path.posix.basename(relativePath),
    });
  });

  return { zip, entries };
}

function detectPackageRoot(entries) {
  const roots = new Set(
    entries.map((entry) => entry.relativePath.split("/")[0]).filter(Boolean)
  );
  if (roots.size !== 1) {
    throw new Error("Expected exactly one top-level folder in ZIP: " + [...roots].join(", "));
  }
  return [...roots][0];
}

function listScopeFiles(entries, packageRoot, scopeName) {
  const prefix = packageRoot + "/" + scopeName + "/";
  return entries
    .filter((entry) => entry.relativePath.startsWith(prefix))
    .map((entry) => ({
      zipPath: entry.relativePath,
      path: entry.relativePath.slice(packageRoot.length + 1),
      fileName: entry.fileName,
    }))
    .sort((a, b) => a.path.localeCompare(b.path));
}

function listAppFiles(entries, packageRoot) {
  return listScopeFiles(entries, packageRoot, "app");
}

function findThemePath(appFiles) {
  const theme = appFiles.find((file) => file.path.endsWith("/theme.js") || file.path === "app/assets/theme.js");
  if (!theme) {
    throw new Error("Could not find app/assets/theme.js in ZIP.");
  }
  return theme.path;
}

function loadGalleryLinks() {
  if (!fs.existsSync(LINKS_FILE)) {
    return {};
  }
  return JSON.parse(fs.readFileSync(LINKS_FILE, "utf8"));
}

function validateGalleryLinks(galleryLinks, appFiles) {
  const available = new Set(appFiles.map((file) => file.path));
  const errors = [];

  Object.entries(galleryLinks).forEach(([registryKey, exportPath]) => {
    if (!available.has(exportPath)) {
      errors.push(registryKey + " → " + exportPath + " (missing from ZIP)");
    }
  });

  if (errors.length) {
    throw new Error("Invalid export-asset-links.json paths:\n" + errors.join("\n"));
  }
}

function loadIosGalleryLinks() {
  if (!fs.existsSync(IOS_LINKS_FILE)) {
    return {};
  }
  return JSON.parse(fs.readFileSync(IOS_LINKS_FILE, "utf8"));
}

function validateIosGalleryLinks(iosGalleryLinks, iosFiles) {
  const available = new Set(iosFiles.map((file) => file.path));
  const errors = [];

  Object.entries(iosGalleryLinks).forEach(([registryKey, exportPath]) => {
    if (exportPath.endsWith("AppIcon.appiconset")) {
      const prefix = exportPath + "/";
      const hasIcons = iosFiles.some(
        (file) => file.path.startsWith(prefix) && file.fileName.endsWith(".png")
      );
      if (!hasIcons) {
        errors.push(registryKey + " → " + exportPath + " (no icons in ZIP)");
      }
      return;
    }

    if (!available.has(exportPath)) {
      errors.push(registryKey + " → " + exportPath + " (missing from ZIP)");
    }
  });

  if (errors.length) {
    throw new Error("Invalid export-ios-asset-links.json paths:\n" + errors.join("\n"));
  }
}

function parseAppIconSizes(zip, appIconContentsZipPath) {
  return zip
    .file(appIconContentsZipPath)
    .async("string")
    .then((source) => {
      const contents = JSON.parse(source);
      const sizeByFilename = new Map();

      contents.images.forEach((entry) => {
        if (!entry.filename) {
          return;
        }
        const size = Number(entry["expected-size"] || entry.filename.replace(".png", ""));
        if (!Number.isNaN(size)) {
          sizeByFilename.set(entry.filename, size);
        }
      });

      return [...sizeByFilename.entries()]
        .map(([filename, size]) => ({ filename, size }))
        .sort((a, b) => a.size - b.size);
    });
}

function discoverImagesets(iosFiles) {
  const folders = new Set();

  iosFiles.forEach((file) => {
    const match = file.path.match(/Images\.xcassets\/([^/]+\.imageset)\//);
    if (match) {
      folders.add(match[1]);
    }
  });

  return [...folders].sort();
}

function buildIosAssetRegistry(iosGalleryLinks, iosFiles, appIconSizes) {
  const appIconFolderPath = iosGalleryLinks.IOS_APP_ICON;
  const imagesetFolders = discoverImagesets(iosFiles);
  const registry = [];

  if (appIconFolderPath) {
    registry.push({
      key: "IOS_APP_ICON",
      type: "appiconset",
      name: "AppIcon.appiconset",
      folder: path.posix.basename(appIconFolderPath),
      exportPathPrefix: appIconFolderPath + "/",
      contentsJsonPath: appIconFolderPath + "/Contents.json",
      recommendedSourceSize: "1024×1024",
      iconSizes: appIconSizes,
      customizable: true,
    });
  }

  Object.entries(iosGalleryLinks).forEach(([key, exportPath]) => {
    if (key === "IOS_APP_ICON") {
      return;
    }

    const folderMatch = exportPath.match(/Images\.xcassets\/([^/]+\.imageset)\//);
    const imageFile = path.posix.basename(exportPath);

    registry.push({
      key,
      type: "imageset",
      name: folderMatch ? folderMatch[1] : exportPath,
      folder: folderMatch ? folderMatch[1] : null,
      imageFile,
      exportPath,
      contentsJsonPath: folderMatch
        ? exportPath.replace(imageFile, "Contents.json")
        : null,
      customizable: true,
    });
  });

  imagesetFolders.forEach((folder) => {
    const alreadyListed = registry.some((entry) => entry.folder === folder);
    if (alreadyListed) {
      return;
    }

    const imageFile = iosFiles.find(
      (file) =>
        file.path.includes("/" + folder + "/") &&
        file.fileName.endsWith(".png") &&
        file.fileName !== "Contents.json"
    );

    if (!imageFile) {
      return;
    }

    registry.push({
      key: "IOS_" + folder.replace(".imageset", "").toUpperCase(),
      type: "imageset",
      name: folder,
      folder,
      imageFile: imageFile.fileName,
      exportPath: imageFile.path,
      contentsJsonPath: imageFile.path.replace(imageFile.fileName, "Contents.json"),
      customizable: false,
    });
  });

  return registry;
}

function buildFileManifest(scopeFiles, appGalleryLinks, iosGalleryLinks, themePath) {
  const appLinkedPaths = new Set(Object.values(appGalleryLinks));
  const iosLinkedPaths = new Set(
    Object.values(iosGalleryLinks).filter((exportPath) => !exportPath.endsWith("AppIcon.appiconset"))
  );
  const appIconPrefix = iosGalleryLinks.IOS_APP_ICON
    ? iosGalleryLinks.IOS_APP_ICON + "/"
    : null;

  const registryKeyByPath = Object.fromEntries([
    ...Object.entries(appGalleryLinks).map(([key, exportPath]) => [exportPath, key]),
    ...Object.entries(iosGalleryLinks)
      .filter(([, exportPath]) => !exportPath.endsWith("AppIcon.appiconset"))
      .map(([key, exportPath]) => [exportPath, key]),
  ]);

  return scopeFiles.map((file) => {
    if (file.path === themePath) {
      return {
        path: file.path,
        dynamic: "theme",
        customizable: false,
        registryKey: null,
        platform: "app",
      };
    }

    if (appIconPrefix && file.path.startsWith(appIconPrefix) && file.fileName.endsWith(".png")) {
      return {
        path: file.path,
        dynamic: null,
        customizable: true,
        registryKey: "IOS_APP_ICON",
        appIconFile: file.fileName,
        platform: "ios",
      };
    }

    if (appLinkedPaths.has(file.path)) {
      return {
        path: file.path,
        dynamic: null,
        customizable: true,
        registryKey: registryKeyByPath[file.path],
        platform: "app",
      };
    }

    if (iosLinkedPaths.has(file.path)) {
      return {
        path: file.path,
        dynamic: null,
        customizable: true,
        registryKey: registryKeyByPath[file.path],
        platform: "ios",
      };
    }

    return {
      path: file.path,
      dynamic: null,
      customizable: false,
      registryKey: null,
      platform: file.path.startsWith("ios/") ? "ios" : file.path.startsWith("app/") ? "app" : "patches",
    };
  });
}

function extractScope(zipPath, packageRoot, scopeName, destRoot) {
  const scopePrefix = packageRoot + "/" + scopeName + "/";
  execSync(
    `unzip -qo ${JSON.stringify(zipPath)} ${scopePrefix + "*"} -d ${JSON.stringify(destRoot)}`,
    { stdio: "pipe" }
  );
}

function writePackageManifest(destDir, sourcePackageRoot, scopes, files) {
  ensureDir(destDir);
  const manifest = {
    sourcePackageRoot,
    zipRoot: "",
    scopes,
    source: path.basename(EPICRANGE_ZIP),
    generatedAt: new Date().toISOString(),
    files,
  };
  fs.writeFileSync(path.join(destDir, "package-manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
  return manifest;
}

function writeIconsManifest(entries, packageRoot, destDir) {
  ensureDir(destDir);
  const files = entries
    .filter((entry) => entry.relativePath.startsWith(packageRoot + "/"))
    .map((entry) => ({
      zipPath: entry.relativePath,
      path: entry.relativePath.slice(packageRoot.length + 1),
      fileName: entry.fileName,
    }))
    .sort((a, b) => a.path.localeCompare(b.path));

  const manifest = {
    packageRoot,
    source: path.basename(ICONS_ZIP),
    generatedAt: new Date().toISOString(),
    files,
  };
  fs.writeFileSync(path.join(destDir, "package-manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
  return manifest;
}

function writeExportConfigJs(config) {
  const source = `/* AUTO-GENERATED by scripts/generate-export-manifest.mjs — do not edit */\n(function initExportPackageConfig(global) {\n  "use strict";\n\n  global.EXPORT_PACKAGE_CONFIG = ${JSON.stringify(config, null, 2)};\n})(window);\n`;
  fs.writeFileSync(EXPORT_CONFIG_JS, source);
}

function writeIosAssetConfigJs(iosAssetRegistry, appIconSizes) {
  const source = `/* AUTO-GENERATED by scripts/generate-export-manifest.mjs — do not edit */\n(function initIosAssetConfig(global) {\n  "use strict";\n\n  global.IOS_ASSET_REGISTRY = ${JSON.stringify(iosAssetRegistry, null, 2)};\n  global.IOS_APP_ICON_SIZES = ${JSON.stringify(appIconSizes, null, 2)};\n})(window);\n`;
  fs.writeFileSync(IOS_ASSET_CONFIG_JS, source);
}

async function main() {
  if (!fs.existsSync(EPICRANGE_ZIP)) {
    throw new Error("Missing epicrange.zip at " + EPICRANGE_ZIP);
  }

  copyZipToReference(EPICRANGE_ZIP, DEFAULT_EPICRANGE_ZIP);
  if (fs.existsSync(ICONS_ZIP)) {
    copyZipToReference(ICONS_ZIP, DEFAULT_ICONS_ZIP);
  }

  const { zip, entries: epicEntries } = await readZipEntries(EPICRANGE_ZIP);
  const sourcePackageRoot = detectPackageRoot(epicEntries);
  const appFiles = listScopeFiles(epicEntries, sourcePackageRoot, "app");
  const iosFiles = listScopeFiles(epicEntries, sourcePackageRoot, "ios");
  const scopeFiles = EXPORT_SCOPES.flatMap((scopeName) =>
    listScopeFiles(epicEntries, sourcePackageRoot, scopeName)
  );

  if (!scopeFiles.length) {
    throw new Error("No export scope files found in ZIP.");
  }

  const themePath = findThemePath(appFiles);
  const galleryLinks = loadGalleryLinks();
  const iosGalleryLinks = loadIosGalleryLinks();

  validateGalleryLinks(galleryLinks, appFiles);
  validateIosGalleryLinks(iosGalleryLinks, iosFiles);

  const appIconContentsZipPath =
    sourcePackageRoot + "/" + (iosGalleryLinks.IOS_APP_ICON || "") + "/Contents.json";
  const appIconSizes = iosGalleryLinks.IOS_APP_ICON
    ? await parseAppIconSizes(zip, appIconContentsZipPath)
    : [];

  const iosAssetRegistry = buildIosAssetRegistry(iosGalleryLinks, iosFiles, appIconSizes);
  const files = buildFileManifest(scopeFiles, galleryLinks, iosGalleryLinks, themePath);
  const referenceDest = path.join(ROOT, "reference", sourcePackageRoot);

  EXPORT_SCOPES.forEach((scopeName) => {
    extractScope(EPICRANGE_ZIP, sourcePackageRoot, scopeName, path.join(ROOT, "reference"));
  });
  writePackageManifest(referenceDest, sourcePackageRoot, EXPORT_SCOPES, files);

  let iconsManifest = null;
  if (fs.existsSync(ICONS_ZIP)) {
    const { entries: iconEntries } = await readZipEntries(ICONS_ZIP);
    const iconsRoot = detectPackageRoot(iconEntries);
    iconsManifest = writeIconsManifest(
      iconEntries,
      iconsRoot,
      path.join(ROOT, "reference", "epicrange_only_icons")
    );
  }

  const exportConfig = {
    generatedAt: new Date().toISOString(),
    sourceZip: path.basename(EPICRANGE_ZIP),
    iconsSourceZip: fs.existsSync(ICONS_ZIP) ? path.basename(ICONS_ZIP) : null,
    sourcePackageRoot,
    zipRoot: "",
    packageZipFilename: PACKAGE_ZIP_FILENAME,
    referenceRoot: "reference/" + sourcePackageRoot + "/",
    themeTemplatePath: themePath,
    scopes: EXPORT_SCOPES,
    files,
    galleryLinks,
    iosGalleryLinks,
    iosAssetRegistry,
    iconsManifest: iconsManifest
      ? {
          packageRoot: iconsManifest.packageRoot,
          fileCount: iconsManifest.files.length,
        }
      : null,
  };

  writeExportConfigJs(exportConfig);
  writeIosAssetConfigJs(iosAssetRegistry, appIconSizes);

  console.log("Generated export config from " + path.basename(EPICRANGE_ZIP));
  console.log("  source package root: " + sourcePackageRoot);
  console.log("  export zip root: (flat — no wrapper folder)");
  console.log("  scopes: " + EXPORT_SCOPES.join(", "));
  console.log("  total files: " + files.length);
  console.log("  customizable: " + files.filter((file) => file.customizable).length);
  console.log("  ios assets (gallery): " + iosAssetRegistry.filter((entry) => entry.customizable).length);
  console.log("  app icon sizes: " + appIconSizes.length);
  console.log("  theme: " + themePath);
  if (iconsManifest) {
    console.log("  icons zip files: " + iconsManifest.files.length);
  }
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
