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

const type = process.argv[2] || "long";

const ROTEIRO_PATH = path.join(OUTPUT_DIR, "roteiro.txt");
const METADATA_PATH = path.join(OUTPUT_DIR, `metadata_${type}.json`);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function gerarMetadata() {
  if (!fs.existsSync(ROTEIRO_PATH)) {
    console.error("❌ roteiro.txt não encontrado.");
    process.exit(1);
  }

  const roteiro = fs.readFileSync(ROTEIRO_PATH, "utf8");

  console.log("🏷 Gerando título e descrição...");

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: `
Baseado no roteiro abaixo, gere:

1) Um título altamente chamativo
2) Uma descrição otimizada para YouTube
3) 10 hashtags relevantes

Roteiro:
${roteiro}
        `
      }
    ],
    temperature: 0.8
  });

  const conteudo = response.choices[0].message.content;

  const metadata = {
    title: conteudo.split("\n")[0],
    description: conteudo,
    tags: ["renda extra", "finanças", "investimentos", "tendência 2026"]
  };

  fs.writeFileSync(METADATA_PATH, JSON.stringify(metadata, null, 2));

  console.log("✅ Metadata criada com sucesso!");
}

gerarMetadata();
