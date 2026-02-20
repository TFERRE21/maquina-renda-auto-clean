import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, "..");
const OUTPUT_DIR = path.join(ROOT, "output");
const IMAGES_DIR = path.join(OUTPUT_DIR, "images");

const type = process.argv[2] || "short";

const AUDIO_PATH = path.join(OUTPUT_DIR, "audio.mp3");
const VIDEO_PATH = path.join(OUTPUT_DIR, `video_${type}.mp4`);

console.log("📁 ROOT:", ROOT);
console.log("📁 OUTPUT_DIR:", OUTPUT_DIR);

if (!fs.existsSync(AUDIO_PATH)) {
  console.error("❌ Áudio não encontrado.");
  process.exit(1);
}

const images = fs
  .readdirSync(IMAGES_DIR)
  .filter((file) => file.endsWith(".png"))
  .sort();

if (images.length === 0) {
  console.error("❌ Nenhuma imagem encontrada.");
  process.exit(1);
}

// usa primeira imagem como base visual
const firstImage = path.join(IMAGES_DIR, images[0]);

console.log("🎬 Gerando vídeo sincronizado com áudio...");

try {
  execSync(
    `ffmpeg -y -loop 1 -i "${firstImage}" -i "${AUDIO_PATH}" \
    -vf "scale=720:1280" \
    -c:v libx264 -preset veryfast -crf 28 \
    -c:a aac -b:a 128k \
    -shortest \
    "${VIDEO_PATH}"`,
    { stdio: "inherit" }
  );

  console.log("✅ Vídeo gerado com sucesso:", VIDEO_PATH);

} catch (err) {
  console.error("❌ Erro ao gerar vídeo:", err.message);
  process.exit(1);
}
