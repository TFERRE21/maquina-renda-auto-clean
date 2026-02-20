import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, "..");
const OUTPUT_DIR = path.join(ROOT, "output");
const IMAGES_DIR = path.join(OUTPUT_DIR, "images");

const type = process.argv[2] || "long";
const THUMB_PATH = path.join(OUTPUT_DIR, `thumb_${type}.jpg`);

console.log("🖼 Gerando thumbnail...");

const images = fs
  .readdirSync(IMAGES_DIR)
  .filter((file) => file.endsWith(".png"))
  .sort();

if (images.length === 0) {
  console.error("❌ Nenhuma imagem encontrada.");
  process.exit(1);
}

const firstImage = path.join(IMAGES_DIR, images[0]);

try {
  execSync(
    `ffmpeg -y -i "${firstImage}" -frames:v 1 -update 1 -vf "scale=720:720" "${THUMB_PATH}"`,
    { stdio: "inherit" }
  );

  console.log("✅ Thumbnail criada com sucesso:", THUMB_PATH);
} catch (err) {
  console.error("❌ Erro ao gerar thumbnail:", err.message);
  process.exit(1);
}
