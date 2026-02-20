import OpenAI from "openai";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// sobe um nível
const ROOT = path.resolve(__dirname, "..");
const OUTPUT_DIR = path.join(ROOT, "output");
const ROTEIRO_PATH = path.join(OUTPUT_DIR, "roteiro.txt");

console.log("📍 __dirname:", __dirname);
console.log("📍 ROOT:", ROOT);
console.log("📍 OUTPUT_DIR:", OUTPUT_DIR);
console.log("📍 ROTEIRO_PATH:", ROTEIRO_PATH);

async function gerarRoteiro() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  fs.writeFileSync(ROTEIRO_PATH, "teste roteiro", "utf8");

  console.log("✅ Arquivo criado?");
  console.log("Existe?", fs.existsSync(ROTEIRO_PATH));
  console.log("Arquivos em output:", fs.readdirSync(OUTPUT_DIR));
}

gerarRoteiro();
