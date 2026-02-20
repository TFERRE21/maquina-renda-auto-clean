import fs from "fs";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const type = process.argv[2] || "short";

const niches = JSON.parse(fs.readFileSync("niches.json")).niches;
const niche = niches[Math.floor(Math.random() * niches.length)];

console.log("🎯 Nicho escolhido:", niche);

const prompt = `
Crie um roteiro viral para YouTube Shorts (60 segundos)
sobre ${niche}.
Comece com um gancho forte.
`;

const response = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [{ role: "user", content: prompt }]
});

fs.writeFileSync("output/script.txt", response.choices[0].message.content);

console.log("✅ Script criado para nicho:", niche);
