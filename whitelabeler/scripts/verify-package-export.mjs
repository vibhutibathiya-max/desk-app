#!/usr/bin/env node
/**
 * Verifies epicrange package export structure matches ZIP-derived config.
 * Usage: node scripts/verify-package-export.mjs [output.zip]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import JSZip from "jszip";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CONFIG_JS = path.join(ROOT, "js", "assets", "export-config.js");
const REFERENCE_ROOT = path.join(ROOT, "reference", "epicrange");

function loadExportConfig() {
  const source = fs.readFileSync(CONFIG_JS, "utf8");
  const match = source.match(/global\.EXPORT_PACKAGE_CONFIG = (\{[\s\S]*\});/);
  if (!match) {
    throw new Error("Could not parse export-config.js");
  }
  return JSON.parse(match[1]);
}

async function buildExportZip(config) {
  const zip = new JSZip();

  for (const entry of config.files) {
    const abs = path.join(REFERENCE_ROOT, entry.path);
    if (entry.dynamic === "theme") {
      zip.file(entry.path, fs.readFileSync(abs, "utf8"));
      continue;
    }
    zip.file(entry.path, fs.readFileSync(abs));
  }

  return zip.generateAsync({ type: "nodebuffer" });
}

function listZipPaths(buffer) {
  return JSZip.loadAsync(buffer).then((zip) =>
    Object.keys(zip.files)
      .filter((name) => !name.endsWith("/"))
      .sort()
  );
}

async function main() {
  const config = loadExportConfig();
  const expected = config.files.map((file) => file.path).sort();

  const buffer = fs.existsSync(process.argv[2])
    ? fs.readFileSync(process.argv[2])
    : await buildExportZip(config);

  const actual = await listZipPaths(buffer);
  const missing = expected.filter((item) => !actual.includes(item));
  const extra = actual.filter((item) => !expected.includes(item));

  if (missing.length || extra.length) {
    console.error("Structure mismatch.");
    if (missing.length) {
      console.error("Missing:", missing);
    }
    if (extra.length) {
      console.error("Extra:", extra);
    }
    process.exit(1);
  }

  console.log(
    "OK — " +
      expected.length +
      " files match " +
      config.sourceZip +
      " (" +
      (config.scopes || ["app"]).join(" + ") +
      " at zip root)."
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
