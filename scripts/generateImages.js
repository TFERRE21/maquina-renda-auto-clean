import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const OUTPUT_DIR = path.join(ROOT, "output");
const IMAGES_DIR = path.join(OUTPUT_DIR, "images");

if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

console.log("🖼 Gerando imagem única simples...");

execSync(`
ffmpeg -y -f lavfi -i color=c=black:s=720x1280 -frames:v 1 "${path.join(IMAGES_DIR, "img_1.png")}"
`, { stdio: "inherit" });

console.log("✅ Imagem criada!");
