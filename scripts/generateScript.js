import fs from "fs";
import path from "path";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function gerarRoteiro() {
  try {
    console.log("🧠 Gerando roteiro...");

    // 🔥 GARANTIR QUE A PASTA OUTPUT EXISTE
    const outputDir = path.resolve("output");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      console.log("📁 Pasta output criada.");
    }

    const prompt = `
Crie um roteiro envolvente de no mínimo 5 minutos
sobre um tema em alta no YouTube.
Use linguagem simples, narrativa envolvente e CTA final.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    });

    const roteiro = response.choices[0].message.content;

    fs.writeFileSync("output/roteiro.txt", roteiro);

    console.log("✅ Roteiro salvo com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao gerar roteiro:", error.message);
    process.exit(1);
  }
}

gerarRoteiro();