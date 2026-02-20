// scripts/buildVideo.js
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const OUTPUT_DIR = path.resolve("output");
const IMAGES_DIR = path.join(OUTPUT_DIR, "images");
const audioPath = path.join(OUTPUT_DIR, "audio.mp3");
const listPath = path.join(OUTPUT_DIR, "list.txt");
const videoPath = path.join(OUTPUT_DIR, "video_final.mp4");

// =============================
// Validações básicas
// =============================
if (!fs.existsSync(audioPath)) {
  console.error("❌ audio.mp3 não encontrado.");
  process.exit(1);
}

for (let i = 1; i <= 6; i++) {
  const img = path.join(IMAGES_DIR, `img_${i}.png`);
  if (!fs.existsSync(img)) {
    console.error(`❌ Imagem ${i} não encontrada.`);
    process.exit(1);
  }
}

console.log("🎬 Obtendo duração do áudio...");

// =============================
// Pega duração real do áudio
// =============================
let audioDuration = parseFloat(
  execSync(
    `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${audioPath}"`
  )
    .toString()
    .trim()
);

// =============================
// Garante mínimo 120 segundos
// =============================
const finalDuration = Math.max(120, audioDuration);

// =============================
// Calcula tempo por imagem
// =============================
const timePerImage = (finalDuration / 6).toFixed(2);

console.log(`⏱ Duração final: ${finalDuration}s`);
console.log(`🖼 Tempo por imagem: ${timePerImage}s`);

// =============================
// Cria lista concat corretamente
// =============================
let listContent = "";

for (let i = 1; i <= 6; i++) {
  const imgPath = path.join(IMAGES_DIR, `img_${i}.png`);
  listContent += `file '${imgPath}'\n`;
  listContent += `duration ${timePerImage}\n`;
}

// IMPORTANTE: repetir última imagem
listContent += `file '${path.join(IMAGES_DIR, "img_6.png")}'\n`;

fs.writeFileSync(listPath, listContent);

console.log("🎥 Renderizando vídeo final...");

// =============================
// Renderização otimizada 512MB
// =============================
execSync(
  `ffmpeg -y -f concat -safe 0 -i "${listPath}" -i "${audioPath}" \
  -vf scale=720:1280 \
  -c:v libx264 -preset ultrafast -crf 30 \
  -pix_fmt yuv420p \
  -c:a aac -b:a 128k \
  -shortest \
  "${videoPath}"`,
  { stdio: "inherit" }
);

console.log("✅ Vídeo final criado com sucesso!");
