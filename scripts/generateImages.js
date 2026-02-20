import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const ROOT = process.cwd();
const OUTPUT_DIR = path.join(ROOT, "output");
const IMAGES_DIR = path.join(OUTPUT_DIR, "images");

if (!fs.existsSync(path.join(OUTPUT_DIR, "script.txt"))) {
  console.error("❌ script.txt não encontrado.");
  process.exit(1);
}

// 🔥 LIMPAR IMAGENS ANTIGAS
if (fs.existsSync(IMAGES_DIR)) {
  fs.rmSync(IMAGES_DIR, { recursive: true, force: true });
}

fs.mkdirSync(IMAGES_DIR, { recursive: true });

console.log("🖼 Gerando imagens reais...");

// Gerar PNG válido real
for (let i = 1; i <= 6; i++) {
  const filePath = path.join(IMAGES_DIR, `img_${i}.png`);

  execSync(`
    ffmpeg -f lavfi -i color=c=blue:s=720x1280:d=1 -frames:v 1 ${filePath} -y
  `);

  console.log(`✅ Imagem ${i} criada`);
}

console.log("🎉 Imagens válidas geradas com sucesso!");
