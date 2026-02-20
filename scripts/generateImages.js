import OpenAI from "openai";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, "..");
const OUTPUT_DIR = path.join(ROOT, "output");
const IMAGES_DIR = path.join(OUTPUT_DIR, "images");
const ROTEIRO_PATH = path.join(OUTPUT_DIR, "roteiro.txt");

const type = process.argv[2] || "long";

console.log("📁 ROOT:", ROOT);
console.log("📁 OUTPUT_DIR:", OUTPUT_DIR);

if (!fs.existsSync(ROTEIRO_PATH)) {
  console.error("❌ roteiro.txt não encontrado.");
  process.exit(1);
}

// cria pasta images se não existir
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
  console.log("📁 Pasta images criada.");
}

// limpa imagens antigas
fs.readdirSync(IMAGES_DIR).forEach(file => {
  fs.unlinkSync(path.join(IMAGES_DIR, file));
});

const roteiro = fs.readFileSync(ROTEIRO_PATH, "utf8");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function gerarImagens() {
  console.log("🖼 Gerando imagens...");

  for (let i = 1; i <= 6; i++) {
    console.log(`🎨 Criando imagem ${i}...`);

    const prompt = `Crie uma imagem realista sobre investimentos financeiros relacionada ao seguinte roteiro:\n\n${roteiro}\n\nEstilo moderno, profissional, YouTube.`;

    const response = await openai.images.generate({
      model: "gpt-image-1",
      prompt: prompt,
      size: "1024x1024"
    });

    const imageBase64 = response.data[0].b64_json;
    const imageBuffer = Buffer.from(imageBase64, "base64");

    const imagePath = path.join(IMAGES_DIR, `img_${i}.png`);
    fs.writeFileSync(imagePath, imageBuffer);

    console.log(`✅ Imagem ${i} salva em ${imagePath}`);
  }

  console.log("🎉 Imagens geradas com sucesso!");
}

gerarImagens();
