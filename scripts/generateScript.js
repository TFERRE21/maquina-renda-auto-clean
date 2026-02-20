import OpenAI from "openai";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function gerarRoteiro(tipo = "long") {
  try {
    console.log("🧠 Gerando roteiro...");

    const outputDir = path.resolve("output");

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const prompt =
      tipo === "long"
        ? "Crie um roteiro envolvente de 4 a 5 minutos sobre investimentos e renda passiva. Apenas texto corrido, sem dividir por narrador."
        : "Crie um roteiro curto de até 2 minutos sobre investimentos. Apenas texto corrido.";

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: prompt }
      ]
    });

    const roteiro = response.choices[0].message.content;

    // 🔥 SALVAR SEMPRE COM ESSE NOME
    const roteiroPath = path.resolve("output", "roteiro.txt");

    fs.writeFileSync(roteiroPath, roteiro);

    console.log("✅ Roteiro gerado com sucesso!");

  } catch (error) {
    console.error("❌ Erro ao gerar roteiro:", error.message);
    process.exit(1);
  }
}

const tipo = process.argv[2] || "long";
gerarRoteiro(tipo);
