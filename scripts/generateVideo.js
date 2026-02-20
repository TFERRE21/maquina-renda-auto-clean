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
const IMAGES_TXT = path.join(OUTPUT_DIR, "images.txt");

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

// 🔥 cada imagem fica 10 segundos
const imageDuration = 10;

let concatFile = "";
images.forEach((img) => {
  concatFile += `file '${path.join(IMAGES_DIR, img)}'\n`;
  concatFile += `duration ${imageDuration}\n`;
});

// repete última imagem
concatFile += `file '${path.join(IMAGES_DIR, images[images.length - 1])}'\n`;

fs.writeFileSync(IMAGES_TXT, concatFile);

console.log("🎬 Gerando vídeo com múltiplas imagens...");

try {
  execSync(
    `ffmpeg -y \
    -f concat -safe 0 -i "${IMAGES_TXT}" \
    -i "${AUDIO_PATH}" \
    -vf "scale=720:1280,format=yuv420p" \
    -c:v libx264 \
    -preset ultrafast \
    -profile:v baseline \
    -level 3.0 \
    -pix_fmt yuv420p \
    -threads 1 \
    -crf 32 \
    -c:a aac -b:a 96k \
    -shortest \
    "${VIDEO_PATH}"`,
    { stdio: "inherit" }
  );

  console.log("✅ Vídeo gerado:", VIDEO_PATH);

} catch (err) {
  console.error("❌ Erro ao gerar vídeo:", err.message);
  process.exit(1);
}
