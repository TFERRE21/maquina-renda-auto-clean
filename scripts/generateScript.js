import OpenAI from "openai";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// sobe um nível (sai da pasta scripts)
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

async function gerarRoteiro(tipo = "long") {
  try {
    console.log("🧠 Gerando roteiro...");
    console.log("📂 Salvando em:", ROTEIRO_PATH);

    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const prompt =
      tipo === "short"
        ? "Crie um roteiro curto (2 minutos) sobre investimentos. Texto corrido."
        : "Crie um roteiro de 4 a 5 minutos sobre investimentos. Texto corrido.";

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    });

    const texto = response.choices[0].message.content.trim();

    fs.writeFileSync(ROTEIRO_PATH, texto, "utf8");

    console.log("✅ Roteiro salvo com sucesso!");

  } catch (err) {
    console.error("❌ Erro ao gerar roteiro:", err.message);
    process.exit(1);
  }
}

const tipo = process.argv[2] || "long";
gerarRoteiro(tipo);
