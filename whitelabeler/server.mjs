#!/usr/bin/env node
/**
 * Local dev server: static preview + POST /api/theme to persist js/theme/theme.js.
 * Usage: node server.mjs [port]
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateAppIconSet, readRequestBuffer } from "./server/ios-app-icons.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;
const THEME_FILE = path.join(ROOT, "js", "theme", "theme.js");
const PORT = Number(process.argv[2]) || 8080;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".plist": "application/xml; charset=utf-8",
  ".wav": "audio/wav",
  ".mp3": "audio/mpeg",
  ".swift": "text/plain; charset=utf-8",
  ".sh": "text/x-shellscript; charset=utf-8",
  ".xcconfig": "text/plain; charset=utf-8",
};

function send(res, status, body, contentType) {
  res.writeHead(status, { "Content-Type": contentType || "text/plain; charset=utf-8" });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const relative = decoded === "/" ? "/index.html" : decoded;
  const resolved = path.normalize(path.join(ROOT, relative));

  if (!resolved.startsWith(ROOT)) {
    return null;
  }

  return resolved;
}

async function handleThemeSave(req, res) {
  try {
    const source = await readBody(req);

    if (!source || !source.trim()) {
      send(res, 400, "Empty theme source.");
      return;
    }

    if (!source.includes("TRAGO_DEFAULT_THEME")) {
      send(res, 400, "Invalid theme.js format.");
      return;
    }

    fs.writeFileSync(THEME_FILE, source, "utf8");
    send(res, 200, "theme.js saved.", "text/plain; charset=utf-8");
  } catch (error) {
    send(res, 500, error.message || "Failed to save theme.js.");
  }
}

function serveStatic(req, res) {
  const filePath = safePath(req.url);
  if (!filePath) {
    send(res, 403, "Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      if (error.code === "ENOENT") {
        send(res, 404, "Not found");
        return;
      }
      send(res, 500, "Server error");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    send(res, 200, data, MIME[ext] || "application/octet-stream");
  });
}

async function handleIosAppIcons(req, res) {
  try {
    const sourceBuffer = await readRequestBuffer(req);

    if (!sourceBuffer.length) {
      send(res, 400, "Empty image payload.");
      return;
    }

    const icons = await generateAppIconSet(sourceBuffer);
    send(res, 200, JSON.stringify({ icons }), "application/json; charset=utf-8");
  } catch (error) {
    send(res, 500, error.message || "Failed to generate iOS app icons.");
  }
}

const server = http.createServer(async (req, res) => {
  if (req.method === "POST" && req.url === "/api/theme") {
    await handleThemeSave(req, res);
    return;
  }

  if (req.method === "POST" && req.url === "/api/ios/generate-app-icons") {
    await handleIosAppIcons(req, res);
    return;
  }

  if (req.method === "GET" || req.method === "HEAD") {
    serveStatic(req, res);
    return;
  }

  send(res, 405, "Method not allowed");
});

server.listen(PORT, () => {
  console.log(`Tragofone preview: http://localhost:${PORT}/index.html`);
  console.log(`Theme API: POST http://localhost:${PORT}/api/theme`);
  console.log(`iOS icons API: POST http://localhost:${PORT}/api/ios/generate-app-icons`);
});
