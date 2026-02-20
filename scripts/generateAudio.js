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
const AUDIO_PATH = path.join(OUTPUT_DIR, "audio.mp3");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function gerarAudio() {

  if (!fs.existsSync(ROTEIRO_PATH)) {
    console.error("❌ roteiro.txt não encontrado.");
    process.exit(1);
  }

  const roteiro = fs.readFileSync(ROTEIRO_PATH, "utf8");

  console.log("🎙 Gerando áudio real...");

  const mp3 = await openai.audio.speech.create({
    model: "gpt-4o-mini-tts",
    voice: "alloy",
    input: roteiro,
  });

  const buffer = Buffer.from(await mp3.arrayBuffer());
  fs.writeFileSync(AUDIO_PATH, buffer);

  console.log("✅ Áudio criado com sucesso!");
}

gerarAudio();
