import fs from "fs";
import path from "path";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const ROOT = path.resolve(".");
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

    console.log("📍 Procurando roteiro em:", ROTEIRO_PATH);

    if (!fs.existsSync(ROTEIRO_PATH)) {
      console.error("❌ roteiro.txt não encontrado.");
      process.exit(1);
    }

    const roteiro = fs.readFileSync(ROTEIRO_PATH, "utf8");

    const quantidade = tipo === "short" ? 4 : 6;

    for (let i = 1; i <= quantidade; i++) {
      console.log(`🎨 Criando imagem ${i}...`);

      const response = await openai.images.generate({
        model: "gpt-image-1",
        prompt: `Imagem sobre: ${roteiro.substring(0, 500)}`,
        size: "1024x1024"
      });

      const imgBase64 = response.data[0].b64_json;
      const imgBuffer = Buffer.from(imgBase64, "base64");

      const imgPath = path.join(OUTPUT_DIR, `imagem${i}.png`);
      fs.writeFileSync(imgPath, imgBuffer);
    }

    console.log("✅ Imagens geradas com sucesso!");

  } catch (err) {
    console.error("❌ Erro ao gerar imagens:", err.message);
    process.exit(1);
  }
}

const tipo = process.argv[2] || "long";
gerarImagens(tipo);
