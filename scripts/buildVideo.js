import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const OUTPUT_DIR = path.resolve("output");
const IMAGES_DIR = path.join(OUTPUT_DIR, "images");
const audioPath = path.join(OUTPUT_DIR, "audio.mp3");
const roteiroPath = path.join(OUTPUT_DIR, "roteiro.txt");
const listPath = path.join(OUTPUT_DIR, "list.txt");
const videoPath = path.join(OUTPUT_DIR, "video_final.mp4");

const FINAL_DURATION = 120;
const IMAGE_COUNT = 6;

// ======================
// Validação
// ======================
if (!fs.existsSync(audioPath)) {
  console.error("❌ Áudio não encontrado");
  process.exit(1);
}

for (let i = 1; i <= IMAGE_COUNT; i++) {
  if (!fs.existsSync(path.join(IMAGES_DIR, `img_${i}.png`))) {
    console.error(`❌ img_${i}.png não encontrada`);
    process.exit(1);
  }
}

console.log("🎬 Criando vídeo profissional com zoom + legenda");

// ======================
// Tempo por imagem
// ======================
const timePerImage = FINAL_DURATION / IMAGE_COUNT;

// ======================
// Criar lista concat
// ======================
let listContent = "";

for (let i = 1; i <= IMAGE_COUNT; i++) {
  listContent += `file '${path.join(IMAGES_DIR, `img_${i}.png`)}'\n`;
  listContent += `duration ${timePerImage}\n`;
}

listContent += `file '${path.join(IMAGES_DIR, "img_6.png")}'\n`;

fs.writeFileSync(listPath, listContent);

// ======================
// Filtro profissional
// ======================
const filter = `
scale=720:1280,
zoompan=z='1+0.0005*on':d=125,
drawtext=textfile=${roteiroPath}:
fontcolor=white:
fontsize=38:
x=(w-text_w)/2:
y=h-180:
box=1:
boxcolor=black@0.6:
boxborderw=10
`.replace(/\n/g, "");

// ======================
// Render final
// ======================
execSync(
  `ffmpeg -y -f concat -safe 0 -i "${listPath}" -i "${audioPath}" \
  -vf "${filter}" \
  -t ${FINAL_DURATION} \
  -c:v libx264 -preset ultrafast -crf 28 \
  -pix_fmt yuv420p \
  -c:a aac -b:a 128k \
  -shortest \
  "${videoPath}"`,
  { stdio: "inherit" }
);

console.log("✅ Vídeo profissional criado!");
