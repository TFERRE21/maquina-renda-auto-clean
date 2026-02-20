// scripts/generateScript.js
import fs from "fs";
import path from "path";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const OUTPUT_DIR = path.resolve("output");
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

console.log("🧠 Gerando roteiro mínimo 2 minutos...");

const response = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    {
      role: "system",
      content: "Crie roteiros narrados para YouTube Shorts vertical."
    },
    {
      role: "user",
      content: `
Crie um roteiro sobre Tecnologia com no mínimo 900 palavras.
O texto deve durar pelo menos 2 minutos narrado.
Sem marcações, sem tópicos, apenas texto contínuo.
`
    }
  ],
  temperature: 0.7
});

const script = response.choices[0].message.content;

fs.writeFileSync(path.join(OUTPUT_DIR, "script.txt"), script);

console.log("✅ Roteiro 2 minutos salvo!");
