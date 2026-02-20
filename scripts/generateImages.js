import fs from "fs";
import path from "path";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

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

    const baseDir = process.cwd();
    const outputDir = path.join(baseDir, "output");

    const roteiroPath = path.join(outputDir, "roteiro.txt");

    if (!fs.existsSync(roteiroPath)) {
      console.error("❌ roteiro.txt não encontrado em:", roteiroPath);
      process.exit(1);
    }

    const roteiro = fs.readFileSync(roteiroPath, "utf8");

    const quantidade = tipo === "short" ? 4 : 6;

    for (let i = 1; i <= quantidade; i++) {
      console.log(`🎨 Criando imagem ${i}...`);

      const response = await openai.images.generate({
        model: "gpt-image-1",
        prompt: `Imagem cinematográfica sobre: ${roteiro.substring(0, 800)}`,
        size: "1024x1024"
      });

      const imageBase64 = response.data[0].b64_json;
      const imageBuffer = Buffer.from(imageBase64, "base64");

      const imagePath = path.join(outputDir, `imagem${i}.png`);
      fs.writeFileSync(imagePath, imageBuffer);
    }

    console.log("✅ Imagens geradas com sucesso!");

  } catch (error) {
    console.error("❌ Erro ao gerar imagens:");
    console.error(error.response?.data || error.message);
    process.exit(1);
  }
}

const tipo = process.argv[2] || "long";
gerarImagens(tipo);
