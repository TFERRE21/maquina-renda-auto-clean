import OpenAI from "openai";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const gerarMetadata = async () => {
  const roteiro = fs.readFileSync("output/roteiro.txt", "utf-8");

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "Você é especialista em viralização no YouTube."
      },
      {
        role: "user",
        content: `Crie título chamativo e descrição SEO para esse vídeo:\n${roteiro}`
      }
    ]
  });

  const texto = response.choices[0].message.content;

  fs.writeFileSync("output/metadata.txt", texto);

  console.log("🧠 Metadata gerada com IA!");
};

gerarMetadata();