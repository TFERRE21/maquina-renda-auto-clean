import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// sobe um nível (raiz do projeto)
const ROOT = path.resolve(__dirname, "..");
const OUTPUT_DIR = path.join(ROOT, "output");

const type = process.argv[2] || "long";

const IMAGES_DIR = path.join(OUTPUT_DIR, "images");
const AUDIO_PATH = path.join(OUTPUT_DIR, `${type}.mp3`);
const VIDEO_PATH = path.join(OUTPUT_DIR, `video_${type}.mp4`);

console.log("📁 ROOT:", ROOT);
console.log("📁 OUTPUT_DIR:", OUTPUT_DIR);

if (!fs.existsSync(AUDIO_PATH)) {
  console.error("❌ Áudio não encontrado:", AUDIO_PATH);
  process.exit(1);
}

if (!fs.existsSync(IMAGES_DIR)) {
  console.error("❌ Pasta de imagens não encontrada:", IMAGES_DIR);
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

// cria lista temporária para ffmpeg
const listFile = path.join(OUTPUT_DIR, "images.txt");
const durationPerImage = type === "short" ? 3 : 5;

let listContent = "";

images.forEach((image) => {
  listContent += `file '${path.join(IMAGES_DIR, image)}'\n`;
  listContent += `duration ${durationPerImage}\n`;
});

// última imagem precisa repetir
listContent += `file '${path.join(IMAGES_DIR, images[images.length - 1])}'\n`;

fs.writeFileSync(listFile, listContent);

console.log("🎬 Gerando vídeo com FFmpeg...");

try {
  execSync(
    `ffmpeg -y -f concat -safe 0 -i "${listFile}" -i "${AUDIO_PATH}" -c:v libx264 -pix_fmt yuv420p -c:a aac -shortest "${VIDEO_PATH}"`,
    { stdio: "inherit" }
  );

  console.log("✅ Vídeo gerado com sucesso:", VIDEO_PATH);
} catch (err) {
  console.error("❌ Erro ao gerar vídeo:", err.message);
  process.exit(1);
}
