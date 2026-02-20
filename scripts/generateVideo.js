import { execSync } from "child_process";
import path from "path";
import fs from "fs";

const ROOT = process.cwd();
const OUTPUT_DIR = path.join(ROOT, "output");

const type = process.argv[2] || "short";

const imagePath = path.join(OUTPUT_DIR, "images", "img_1.png");
const audioPath = path.join(OUTPUT_DIR, "audio.mp3");
const outputPath = path.join(OUTPUT_DIR, `video_${type}.mp4`);

if (!fs.existsSync(imagePath)) {
  console.error("❌ Imagem não encontrada.");
  process.exit(1);
}

if (!fs.existsSync(audioPath)) {
  console.error("❌ Áudio não encontrado.");
  process.exit(1);
}

console.log("🎬 Gerando vídeo simples (modo estável)...");

execSync(`
ffmpeg -y \
-loop 1 -i "${imagePath}" \
-i "${audioPath}" \
-c:v libx264 \
-tune stillimage \
-preset ultrafast \
-crf 28 \
-c:a aac \
-b:a 128k \
-shortest \
-pix_fmt yuv420p \
"${outputPath}"
`, { stdio: "inherit" });

console.log("✅ Vídeo gerado com sucesso!");
