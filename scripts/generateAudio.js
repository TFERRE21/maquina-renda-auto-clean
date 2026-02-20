// scripts/generateAudio.js
import fs from "fs";
import path from "path";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const OUTPUT_DIR = path.resolve("output");
const scriptPath = path.join(OUTPUT_DIR, "script.txt");
const audioPath = path.join(OUTPUT_DIR, "audio.mp3");

if (!fs.existsSync(scriptPath)) {
  console.error("❌ script.txt não encontrado.");
  process.exit(1);
}

const text = fs.readFileSync(scriptPath, "utf-8");

console.log("🎙 Gerando áudio narrado...");

const speech = await openai.audio.speech.create({
  model: "gpt-4o-mini-tts",
  voice: "alloy",
  input: text,
});

const buffer = Buffer.from(await speech.arrayBuffer());
fs.writeFileSync(audioPath, buffer);

console.log("✅ Áudio criado com sucesso!");
