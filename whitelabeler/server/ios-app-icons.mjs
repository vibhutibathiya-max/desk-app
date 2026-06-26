import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const IOS_SIZES_FILE = path.join(ROOT, "js", "assets", "ios-asset-config.js");

function loadAppIconSizes() {
  if (!fs.existsSync(IOS_SIZES_FILE)) {
    throw new Error("ios-asset-config.js not found. Run: npm run generate:export-manifest");
  }

  const source = fs.readFileSync(IOS_SIZES_FILE, "utf8");
  const match = source.match(/global\.IOS_APP_ICON_SIZES = (\[[\s\S]*?\]);/);
  if (!match) {
    throw new Error("Could not parse IOS_APP_ICON_SIZES from ios-asset-config.js");
  }

  return JSON.parse(match[1]);
}

export async function generateAppIconSet(sourceBuffer) {
  const iconSizes = loadAppIconSizes();
  const icons = {};

  for (const entry of iconSizes) {
    const pngBuffer = await sharp(sourceBuffer)
      .resize(entry.size, entry.size, {
        fit: "cover",
        position: "centre",
      })
      .png()
      .toBuffer();

    icons[entry.filename] = pngBuffer.toString("base64");
  }

  return icons;
}

export async function readRequestBuffer(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}
