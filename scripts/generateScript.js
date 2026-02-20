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
const ROTEIRO_PATH = path.join(OUTPUT_DIR, "roteiro.txt");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR);
}

const type = process.argv[2] || "short";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function gerarRoteiro() {

  console.log("🔥 Gerando roteiro tendência REAL...");

  const tempo = type === "short" ? "2 minutos (~300 palavras)" : "5 minutos (~750 palavras)";

  const prompt = `
Crie um roteiro para YouTube Shorts no nicho de finanças e renda extra.

Regras obrigatórias:
- Tema deve ser tendência em 2026
- Foco em dinheiro, renda extra, investimentos ou tecnologia financeira
- Duração aproximada: ${tempo}
- NÃO use palavras como "Narrador", "Cena", "Parte"
- Texto contínuo pronto para narração
- Comece com gancho extremamente forte
- Final com CTA chamando para seguir o canal

Escreva no mínimo 280 palavras.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.9,
  });

  const roteiro = response.choices[0].message.content.trim();

  fs.writeFileSync(ROTEIRO_PATH, roteiro);

  console.log("✅ Roteiro salvo!");
  console.log("📏 Tamanho do roteiro:", roteiro.split(" ").length, "palavras");
}

gerarRoteiro();
