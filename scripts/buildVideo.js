import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const OUTPUT_DIR = path.resolve("output");
const IMAGES_DIR = path.join(OUTPUT_DIR, "images");
const audioPath = path.join(OUTPUT_DIR, "audio.mp3");
const listPath = path.join(OUTPUT_DIR, "list.txt");
const videoPath = path.join(OUTPUT_DIR, "video_final.mp4");

// =====================
// CONFIG
// =====================
const FINAL_DURATION = 120; // 🔥 FIXO 2 MIN
const IMAGE_COUNT = 6;

// =====================
// VALIDAÇÕES
// =====================
if (!fs.existsSync(audioPath)) {
  console.error("❌ audio.mp3 não encontrado.");
  process.exit(1);
}

for (let i = 1; i <= IMAGE_COUNT; i++) {
  const img = path.join(IMAGES_DIR, `img_${i}.png`);
  if (!fs.existsSync(img)) {
    console.error(`❌ Imagem ${i} não encontrada.`);
    process.exit(1);
  }
}

console.log("🎬 Forçando vídeo para 2 minutos...");

// =====================
// TEMPO POR IMAGEM
// =====================
const timePerImage = (FINAL_DURATION / IMAGE_COUNT).toFixed(2);

console.log(`🖼 Tempo por imagem: ${timePerImage}s`);

// =====================
// CRIA LISTA CONCAT
// =====================
let listContent = "";

for (let i = 1; i <= IMAGE_COUNT; i++) {
  const imgPath = path.join(IMAGES_DIR, `img_${i}.png`);
  listContent += `file '${imgPath}'\n`;
  listContent += `duration ${timePerImage}\n`;
}

listContent += `file '${path.join(IMAGES_DIR, "img_6.png")}'\n`;

fs.writeFileSync(listPath, listContent);

// =====================
// RENDER FINAL OTIMIZADO
// =====================
execSync(
  `ffmpeg -y -f concat -safe 0 -i "${listPath}" -i "${audioPath}" \
  -vf scale=720:1280,fps=25 \
  -t ${FINAL_DURATION} \
  -c:v libx264 -preset ultrafast -crf 30 \
  -pix_fmt yuv420p \
  -c:a aac -b:a 128k \
  -shortest \
  "${videoPath}"`,
  { stdio: "inherit" }
);

console.log("✅ Vídeo final 2 minutos criado com sucesso!");
