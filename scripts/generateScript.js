import fs from "fs";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const type = process.argv[2] || "short";

const niches = [
  "Inteligência Artificial",
  "Curiosidades do Mundo",
  "Tecnologia",
  "Criptomoedas",
  "Notícias do Brasil",
  "Histórias reais",
  "Investimentos",
  "Fatos surpreendentes"
];

async function main() {
  const niche = niches[Math.floor(Math.random() * niches.length)];
  console.log("🎯 Nicho escolhido:", niche);

  const duration = type === "short" ? "60 segundos" : "3 minutos";

  const prompt = `
Crie um roteiro altamente envolvente para YouTube sobre ${niche}.
Duração: ${duration}.
Comece com um gancho forte nos primeiros 3 segundos.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }]
  });

  if (!fs.existsSync("output")) {
    fs.mkdirSync("output");
  }

  fs.writeFileSync("output/script.txt", response.choices[0].message.content);

  console.log("✅ Roteiro criado com sucesso!");
}

// 🔥 ISSO GARANTE QUE O NODE ESPERE TERMINAR
await main();
process.exit(0);
