import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import OpenAI from "openai";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, "..");
const OUTPUT_DIR = path.join(ROOT, "output");

const type = process.argv[2] || "long";
const scriptPath = path.join(OUTPUT_DIR, "script.txt");

const text = fs.readFileSync(scriptPath, "utf8");

const voice = type === "short" ? "alloy" : "nova";

const speech = await openai.audio.speech.create({
  model: "gpt-4o-mini-tts",
  voice: voice,
  input: text
});

const voicePath = path.join(OUTPUT_DIR, "voice.mp3");
fs.writeFileSync(voicePath, Buffer.from(await speech.arrayBuffer()));

const musicPath = path.join(ROOT, "assets", "music.mp3");
const finalAudio = path.join(OUTPUT_DIR, "audio.mp3");

execSync(`
ffmpeg -y -i "${voicePath}" -i "${musicPath}" \
-filter_complex "amix=inputs=2:duration=shortest:weights=2 0.4" \
-c:a mp3 "${finalAudio}"
`, { stdio: "inherit" });

console.log("✅ Áudio final pronto!");
