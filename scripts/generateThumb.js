import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const OUTPUT_DIR = path.resolve("output");
const thumbPath = path.join(OUTPUT_DIR, "thumbnail.png");
const roteiroPath = path.join(OUTPUT_DIR, "roteiro.txt");

// Criar pasta se não existir
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Pegar texto do roteiro
let texto = "Descubra Algo Incrível Hoje!";

if (fs.existsSync(roteiroPath)) {
  const roteiro = fs.readFileSync(roteiroPath, "utf8");
  texto = roteiro.split(".")[0].slice(0, 60);
}

console.log("🖼 Criando thumbnail automática...");

// Criar thumbnail com fundo + texto
execSync(
  `ffmpeg -y -f lavfi -i color=c=black:s=720x1280 ` +
  `-vf "drawtext=text='${texto}':` +
  `fontcolor=white:fontsize=60:` +
  `x=(w-text_w)/2:y=(h-text_h)/2:` +
  `box=1:boxcolor=black@0.6:boxborderw=20" ` +
  `-frames:v 1 "${thumbPath}"`,
  { stdio: "inherit" }
);

console.log("✅ Thumbnail criada com sucesso!");
