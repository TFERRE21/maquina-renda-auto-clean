import fs from "fs";
import path from "path";
import googleTrends from "google-trends-api";
import OpenAI from "openai";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, "..");
const OUTPUT_DIR = path.join(ROOT, "output");
const usedPath = path.join(OUTPUT_DIR, "usedThemes.json");

const type = process.argv[2] || "long";

let used = [];
if (fs.existsSync(usedPath)) {
  used = JSON.parse(fs.readFileSync(usedPath));
}

console.log("📈 Buscando tendência Brasil...");

const trends = await googleTrends.dailyTrends({ geo: "BR" });
const parsed = JSON.parse(trends);
const topic =
  parsed.default.trendingSearchesDays[0].trendingSearches[0].title.query;

if (used.includes(topic)) {
  console.log("Tema já usado. Abortando.");
  process.exit(1);
}

used.push(topic);
fs.writeFileSync(usedPath, JSON.stringify(used));

const durationText =
  type === "short"
    ? "Crie um roteiro para 2 minutos exatos."
    : "Crie um roteiro para 4 minutos.";

const prompt = `
Crie um roteiro envolvente sobre: ${topic}.
${durationText}
`;

const response = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [{ role: "user", content: prompt }]
});

const script = response.choices[0].message.content;

fs.writeFileSync(path.join(OUTPUT_DIR, "script.txt"), script);

console.log("✅ Roteiro criado:", topic);
