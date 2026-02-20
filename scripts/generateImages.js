import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const OUTPUT_DIR = path.join(ROOT, "output");
const IMAGES_DIR = path.join(OUTPUT_DIR, "images");

if (!fs.existsSync(path.join(OUTPUT_DIR, "script.txt"))) {
  console.error("❌ script.txt não encontrado.");
  process.exit(1);
}

const script = fs.readFileSync(path.join(OUTPUT_DIR, "script.txt"), "utf8");

if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

console.log("🖼 Gerando imagens...");

// Simples geração placeholder leve
for (let i = 1; i <= 6; i++) {
  const filePath = path.join(IMAGES_DIR, `img_${i}.png`);
  fs.writeFileSync(filePath, "placeholder");
  console.log(`✅ Imagem ${i} criada`);
}

console.log("🎉 Imagens geradas com sucesso!");
