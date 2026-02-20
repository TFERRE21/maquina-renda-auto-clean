import OpenAI from "openai";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const ROOT = process.cwd();
const OUTPUT_DIR = path.join(ROOT, "output");
const ROTEIRO_PATH = path.join(OUTPUT_DIR, "roteiro.txt");

if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY não configurada.");
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function gerarRoteiro(tipo = "long") {
  try {
    console.log("🧠 Gerando roteiro...");

    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const prompt =
      tipo === "short"
        ? `Crie um roteiro curto (até 2 minutos) sobre investimentos.
Texto corrido, direto e envolvente.`
        : `Crie um roteiro de 4 a 5 minutos sobre investimentos,
educação financeira ou renda passiva.
Texto corrido, envolvente e com chamada para ação no final.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Especialista em finanças para YouTube." },
        { role: "user", content: prompt }
      ],
      temperature: 0.8
    });

    const texto = response.choices[0].message.content.trim();

    fs.writeFileSync(ROTEIRO_PATH, texto, "utf8");

    console.log("✅ Roteiro salvo em:", ROTEIRO_PATH);

  } catch (err) {
    console.error("❌ Erro ao gerar roteiro:", err.message);
    process.exit(1);
  }
}

const tipo = process.argv[2] || "long";
gerarRoteiro(tipo);
