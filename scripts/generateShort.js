import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

console.log("🎬 Gerando SHORT (2 minutos)...");

// Verifica pasta output
if (!fs.existsSync("output")) {
  console.log("❌ Pasta output não encontrada.");
  process.exit(1);
}

// Pega imagens
const images = fs.readdirSync("output").filter(file => file.endsWith(".png"));

if (images.length === 0) {
  console.log("❌ Nenhuma imagem encontrada.");
  process.exit(1);
}

console.log(`🖼 ${images.length} imagens encontradas`);

// ===============================
// 1️⃣ Criar lista para FFmpeg
// ===============================

let fileContent = "";

images.forEach(image => {
  fileContent += `file '${path.resolve("output", image)}'\n`;
  fileContent += `duration 8\n`; // 8 segundos por imagem → ~2 minutos
});

// repetir última imagem sem duration
fileContent += `file '${path.resolve("output", images[images.length - 1])}'\n`;

fs.writeFileSync("output/list-short.txt", fileContent);

console.log("📄 list-short.txt criado");

// ===============================
// 2️⃣ Criar vídeo vertical base
// ===============================

await execAsync(`
ffmpeg -y \
-f concat \
-safe 0 \
-i output/list-short.txt \
-vf "scale=720:1280,format=yuv420p" \
-c:v libx264 \
-r 30 \
output/short-base.mp4
`);

console.log("✅ Short base criado");

// ===============================
// 3️⃣ Juntar com áudio corretamente
// ===============================

if (!fs.existsSync("output/audio.mp3")) {
  console.log("❌ Áudio não encontrado.");
  process.exit(1);
}

console.log("🎵 Adicionando áudio ao Short...");

await execAsync(`
ffmpeg -y \
-i output/short-base.mp4 \
-i output/audio.mp3 \
-map 0:v:0 \
-map 1:a:0 \
-c:v libx264 \
-c:a aac \
-b:a 192k \
-shortest \
output/short.mp4
`);

console.log("🎉 SHORT final criado com áudio!");