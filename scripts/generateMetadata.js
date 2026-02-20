import dotenv from "dotenv";
import OpenAI from "openai";
import fs from "fs";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function gerarMetadata(tipo = "long") {
  try {
    const scriptPath =
      tipo === "short"
        ? "./output/script_short.txt"
        : "./output/script_long.txt";

    const script = fs.readFileSync(scriptPath, "utf-8");

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Você é especialista em SEO e monetização para YouTube no nicho financeiro."
        },
        {
          role: "user",
          content: `
Com base no roteiro abaixo gere:

1️⃣ Título altamente clicável
2️⃣ Descrição otimizada para SEO
3️⃣ 10 hashtags relevantes
4️⃣ 3 menções estratégicas com @

ROTEIRO:
${script}
`
        }
      ]
    });

    const metadata = response.choices[0].message.content;

    const nomeArquivo =
      tipo === "short"
        ? "metadata_short.txt"
        : "metadata_long.txt";

    fs.writeFileSync(`./output/${nomeArquivo}`, metadata);

    console.log("✅ Metadata gerada com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao gerar metadata:", error.message);
  }
}

const tipo = process.argv[2] || "long";
gerarMetadata(tipo);