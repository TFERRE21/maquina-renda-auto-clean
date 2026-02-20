import fs from "fs";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function generateMetadata() {
  const roteiro = fs.readFileSync("./output/roteiro.txt", "utf8");
  const niche = JSON.parse(fs.readFileSync("./output/niche.json", "utf8"));

  const prompt = `
Crie um título extremamente chamativo para YouTube sobre:
${roteiro}

Nicho: ${niche.name}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }]
  });

  const title = response.choices[0].message.content;

  const description = `
${title}

🚀 Quer aprender mais sobre ${niche.name}?

👉 Acesse agora:
${niche.affiliateLink}

#${niche.name.replace(" ", "")} #RendaOnline #Automação
`;

  fs.writeFileSync("./output/metadata.txt", `${title}\n\n${description}`);

  console.log("🧠 Título e descrição gerados com afiliado.");
}

generateMetadata();