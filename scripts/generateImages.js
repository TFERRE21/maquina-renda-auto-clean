import fs from "fs";
import path from "path";
import OpenAI from "openai";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// sobe um nível
const ROOT = path.resolve(__dirname, "..");
const OUTPUT_DIR = path.join(ROOT, "output");
const ROTEIRO_PATH = path.join(OUTPUT_DIR, "roteiro.txt");

if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY não configurada.");
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function gerarImagens(tipo = "long") {
  try {
    console.log("🖼 Gerando imagens...");
    console.log("📂 Lendo roteiro em:", ROTEIRO_PATH);

    if (!fs.existsSync(ROTEIRO_PATH)) {
      console.error("❌ roteiro.txt NÃO encontrado!");
      process.exit(1);
    }

    const roteiro = fs.readFileSync(ROTEIRO_PATH, "utf8");

    const quantidade = tipo === "short" ? 4 : 6;

    for (let i = 1; i <= quantidade; i++) {
      console.log(`🎨 Criando imagem ${i}...`);

      const response = await openai.images.generate({
        model: "gpt-image-1",
        prompt: `Imagem sobre investimentos baseada no texto: ${roteiro.substring(0, 500)}`,
        size: "1024x1024"
      });

      const base64 = response.data[0].b64_json;
      const buffer = Buffer.from(base64, "base64");

      const imgPath = path.join(OUTPUT_DIR, `imagem${i}.png`);
      fs.writeFileSync(imgPath, buffer);
    }

    console.log("✅ Imagens geradas com sucesso!");

  } catch (err) {
    console.error("❌ Erro ao gerar imagens:", err.message);
    process.exit(1);
  }
}

const tipo = process.argv[2] || "long";
gerarImagens(tipo);
