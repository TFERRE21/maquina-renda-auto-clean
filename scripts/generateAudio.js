import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";
import OpenAI from "openai";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!process.env.OPENAI_API_KEY) {
    console.error("❌ OPENAI_API_KEY não encontrada no .env");
    process.exit(1);
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function generateAudio() {
    try {
        const outputDir = path.join(__dirname, "../output");
        const scriptPath = path.join(outputDir, "roteiro.txt");
        const audioPath = path.join(outputDir, "audio.mp3");

        if (!fs.existsSync(scriptPath)) {
            console.error("❌ roteiro.txt não encontrado.");
            return;
        }

        const text = fs.readFileSync(scriptPath, "utf8");

        console.log("🎙 Gerando áudio...");

        const mp3 = await openai.audio.speech.create({
            model: "gpt-4o-mini-tts",
            voice: "alloy",
            input: text,
        });

        const buffer = Buffer.from(await mp3.arrayBuffer());
        fs.writeFileSync(audioPath, buffer);

        console.log("✅ Áudio criado com sucesso!");

    } catch (error) {
        console.error("❌ Erro ao gerar áudio:", error.message);
    }
}

generateAudio();