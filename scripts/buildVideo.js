// scripts/buildVideo.js
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const OUTPUT_DIR = path.resolve("output");
const IMAGES_DIR = path.join(OUTPUT_DIR, "images");
const audioPath = path.join(OUTPUT_DIR, "audio.mp3");
const listPath = path.join(OUTPUT_DIR, "list.txt");
const videoPath = path.join(OUTPUT_DIR, "video_final.mp4");

if (!fs.existsSync(audioPath)) {
  console.error("❌ audio.mp3 não encontrado.");
  process.exit(1);
}

console.log("🎬 Obtendo duração do áudio...");

const duration = parseFloat(
  execSync(
    `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${audioPath}`
  )
    .toString()
    .trim()
);

const timePerImage = (duration / 6).toFixed(2);

let listContent = "";

for (let i = 1; i <= 6; i++) {
  listContent += `file '${IMAGES_DIR}/img_${i}.png'\n`;
  listContent += `duration ${timePerImage}\n`;
}

fs.writeFileSync(listPath, listContent);

console.log("🎥 Renderizando vídeo final...");

execSync(
  `ffmpeg -y -f concat -safe 0 -i ${listPath} -i ${audioPath} \
  -vf scale=720:1280 \
  -c:v libx264 -preset ultrafast -crf 30 \
  -pix_fmt yuv420p \
  -c:a aac -b:a 128k -shortest ${videoPath}`,
  { stdio: "inherit" }
);

console.log("✅ Vídeo final criado com sucesso!");
