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
const imagesListPath = path.join(OUTPUT_DIR, "images.txt");

console.log("📁 ROOT:", ROOT);
console.log("📁 OUTPUT_DIR:", OUTPUT_DIR);

if (!fs.existsSync(AUDIO_PATH)) {
  console.error("❌ Áudio não encontrado.");
  process.exit(1);
}

if (!fs.existsSync(IMAGES_DIR)) {
  console.error("❌ Pasta images não encontrada.");
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

// Criar arquivo images.txt para concat
const concatContent = images
  .map((img) => `file '${path.join(IMAGES_DIR, img)}'`)
  .join("\n");

fs.writeFileSync(imagesListPath, concatContent);

const isShort = type === "short";

// 🔥 DIFERENCIAÇÃO CORRETA
const scale = isShort ? "720:1280" : "1280:720";

console.log("🎬 Gerando vídeo respeitando duração do áudio...");

try {
  const ffmpegCommand = `
  ffmpeg -y \
  -f concat -safe 0 -i "${imagesListPath}" \
  -i "${AUDIO_PATH}" \
  -vf "scale=${scale},format=yuv420p" \
  -c:v libx264 \
  -preset veryfast \
  -crf 28 \
  -pix_fmt yuv420p \
  -c:a aac \
  -b:a 128k \
  -shortest \
  -movflags +faststart \
  "${VIDEO_PATH}"
  `;

  execSync(ffmpegCommand, { stdio: "inherit" });

  console.log("✅ Vídeo gerado com sucesso:", VIDEO_PATH);

} catch (error) {
  console.error("❌ Erro ao gerar vídeo:", error.message);
  process.exit(1);
}
