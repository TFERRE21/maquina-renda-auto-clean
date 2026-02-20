import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const roteiroPath = "./output/roteiro.txt";
const imagesDir = "./output/images";
const listFilePath = "./output/images.txt";

async function gerarImagens() {
  try {
    console.log("🖼 Gerando imagens...");

    if (!fs.existsSync(roteiroPath)) {
      console.log("❌ roteiro.txt não encontrado.");
      process.exit(1);
    }

    // Criar pasta images se não existir
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }

    const roteiro = fs.readFileSync(roteiroPath, "utf-8");

    // Divide o roteiro em partes menores
    const partes = roteiro
      .split(".")
      .map(p => p.trim())
      .filter(p => p.length > 20)
      .slice(0, 5); // gera no máximo 5 imagens

    const imagensGeradas = [];

    for (let i = 0; i < partes.length; i++) {
      console.log(`🎨 Criando imagem ${i + 1}...`);

      const prompt = `
Cena cinematográfica, estilo YouTube automação e dinheiro online,
ilustração moderna, luz dramática, alta qualidade.
Descrição: ${partes[i]}
      `;

      const response = await openai.images.generate({
        model: "gpt-image-1",
        prompt: prompt,
        size: "1024x1024",
      });

      const base64 = response.data[0].b64_json;
      const buffer = Buffer.from(base64, "base64");

      const imagePath = path.join(imagesDir, `img${i + 1}.png`);
      fs.writeFileSync(imagePath, buffer);

      imagensGeradas.push(`file '${path.resolve(imagePath)}'\nduration 4`);
    }

    // Criar arquivo images.txt para ffmpeg
    fs.writeFileSync(listFilePath, imagensGeradas.join("\n"));

    console.log("✅ Imagens criadas com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao gerar imagens:", error.message);
  }
}

gerarImagens();