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
// Garantir que roteiro exista
// ======================
if (!fs.existsSync(roteiroPath)) {
  console.log("⚠️ roteiro.txt não encontrado, criando versão automática...");
  fs.writeFileSync(
    roteiroPath,
    "Descubra agora algo incrível sobre investimentos que pode mudar sua visão sobre dinheiro."
  );
}

// ======================
// Validação áudio
// ======================
if (!fs.existsSync(audioPath)) {
  console.error("❌ Áudio não encontrado");
  process.exit(1);
}

// ======================
// Criar lista concat
// ======================
let listContent = "";
const timePerImage = FINAL_DURATION / IMAGE_COUNT;

for (let i = 1; i <= IMAGE_COUNT; i++) {
  const imgPath = path.join(IMAGES_DIR, `img_${i}.png`);

  if (!fs.existsSync(imgPath)) {
    console.error(`❌ ${imgPath} não encontrada`);
    process.exit(1);
  }

  listContent += `file '${imgPath}'\n`;
  listContent += `duration ${timePerImage}\n`;
}

listContent += `file '${path.join(IMAGES_DIR, "img_6.png")}'\n`;

fs.writeFileSync(listPath, listContent);

console.log("🎬 Criando vídeo profissional com zoom + legenda");

// ======================
// Filtro leve para 512MB
// ======================
const filter =
  `scale=720:1280,` +
  `zoompan=z='1+0.0003*on':d=125,` +
  `drawtext=textfile=${roteiroPath}:` +
  `fontcolor=white:` +
  `fontsize=36:` +
  `x=(w-text_w)/2:` +
  `y=h-200:` +
  `box=1:` +
  `boxcolor=black@0.5:` +
  `boxborderw=8`;

// ======================
// Render final
// ======================
execSync(
  `ffmpeg -y -f concat -safe 0 -i "${listPath}" -i "${audioPath}" ` +
  `-vf "${filter}" ` +
  `-t ${FINAL_DURATION} ` +
  `-c:v libx264 -preset ultrafast -crf 30 ` +
  `-pix_fmt yuv420p ` +
  `-c:a aac -b:a 128k ` +
  `-shortest "${videoPath}"`,
  { stdio: "inherit" }
);

console.log("✅ Vídeo profissional criado com sucesso!");
