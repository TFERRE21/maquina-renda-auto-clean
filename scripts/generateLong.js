import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

console.log("🎬 Gerando vídeo longo (6 minutos)...");

const images = fs.readdirSync("output").filter(file => file.endsWith(".png"));

if (images.length === 0) {
  console.log("❌ Nenhuma imagem encontrada.");
  process.exit(1);
}

let fileContent = "";

images.forEach(image => {
  fileContent += `file '${path.resolve("output", image)}'\n`;
  fileContent += `duration 12\n`; // 12s por imagem
});

fileContent += `file '${path.resolve("output", images[images.length - 1])}'\n`;

fs.writeFileSync("output/list-long.txt", fileContent);

await execAsync(`
ffmpeg -y \
-f concat \
-safe 0 \
-i output/list-long.txt \
-i output/audio.mp3 \
-map 0:v:0 \
-map 1:a:0 \
-c:v libx264 \
-c:a aac \
-b:a 192k \
-shortest \
output/video-long.mp4
`);

console.log("✅ Vídeo longo criado com sucesso!");