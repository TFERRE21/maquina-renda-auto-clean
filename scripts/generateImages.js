// scripts/generateImages.js
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const IMAGES_DIR = path.resolve("output/images");
fs.mkdirSync(IMAGES_DIR, { recursive: true });

console.log("🖼 Gerando 6 imagens...");

for (let i = 1; i <= 6; i++) {
  const output = path.join(IMAGES_DIR, `img_${i}.png`);

  execSync(
    `ffmpeg -y -f lavfi -i color=c=black:s=720x1280 -frames:v 1 ${output}`,
    { stdio: "inherit" }
  );

  console.log(`✅ Imagem ${i} criada`);
}

console.log("🎉 Imagens geradas!");
