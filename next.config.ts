import type { NextConfig } from "next";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

// Sync service worker from TypeScript source to public JavaScript
const syncServiceWorker = () => {
  try {
    const srcPath = join(process.cwd(), "src/lib/sw-worker.ts");
    const destPath = join(process.cwd(), "public/sw.js");

    // Read the TypeScript source
    let content = readFileSync(srcPath, "utf-8");

    // Strip TypeScript and remove comments
    content = content
      .replace(/\/\/ eslint-disable-next-line no-undef\n/g, "")
      .replace(/: any/g, "")
      .replace(/\/\/ Service Worker.*\n/g, "")
      .replace(/\/\/ This file is copied.*\n/g, "")
      .replace(/\/\/ DO NOT use ES6.*\n/g, "");

    // Write clean JavaScript to public
    writeFileSync(destPath, content);
    console.log("✓ Service worker synced: src/lib/sw-worker.ts → public/sw.js");
  } catch (error) {
    console.warn("⚠ Could not sync service worker:", error);
  }
};

// Sync before Next.js starts
syncServiceWorker();

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {}, // Use Turbopack (default in Next.js 16+)
};

export default nextConfig;
