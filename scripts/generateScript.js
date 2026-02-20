import dotenv from "dotenv";
import OpenAI from "openai";
import fs from "fs";
import path from "path";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function gerarRoteiro(tipo = "long") {
  try {
    console.log("🧠 Gerando roteiro...");

    const outputDir = path.resolve("output");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const duracao =
      tipo === "short"
        ? "Versão curta (até 2 minutos), ritmo acelerado e impacto imediato."
        : "Versão longa (4 a 5 minutos), aprofundada e altamente envolvente.";

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Você é especialista em roteiros virais e monetizáveis para YouTube no nicho de investimentos."
        },
        {
          role: "user",
          content: `
Crie um roteiro sobre um tema atual e em tendência no nicho de investimentos, finanças ou renda extra.

REGRAS:
- Apenas texto corrido.
- Sem títulos.
- Sem tópicos.
- Sem marcações.
- Comece com um gancho forte nos primeiros 5 segundos.
- Use gatilhos psicológicos.
- Inclua CTA estratégico no final (inscreva-se, comente, etc).

${duracao}
`
        }
      ]
    });

    const script = response.choices[0].message.content.trim();

    const nomeArquivo =
      tipo === "short" ? "script_short.txt" : "script_long.txt";

    fs.writeFileSync(path.join(outputDir, nomeArquivo), script);

    console.log("✅ Roteiro gerado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao gerar roteiro:", error.message);
  }
}

const tipo = process.argv[2] || "long";
gerarRoteiro(tipo);