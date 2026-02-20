import OpenAI from "openai";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

// ===============================
// CONFIGURAÇÃO OPENAI
// ===============================

if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY não configurada.");
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ===============================
// FUNÇÃO PRINCIPAL
// ===============================

async function gerarRoteiro(tipo = "long") {
  try {
    console.log("🧠 Gerando roteiro...");

    // 🔥 PADRÃO ABSOLUTO PARA RENDER
    const baseDir = process.cwd();
    const outputDir = path.join(baseDir, "output");

    // Criar pasta se não existir
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      console.log("📁 Pasta output criada.");
    }

    // Definir prompt
    const prompt =
      tipo === "long"
        ? `
Crie um roteiro envolvente de 4 a 5 minutos sobre investimentos,
educação financeira ou renda passiva.

Use linguagem simples e direta.
Apenas texto corrido.
Não dividir por narrador.
Inclua chamada para ação no final.
`
        : `
Crie um roteiro curto de até 2 minutos sobre investimentos
ou dinheiro inteligente.

Apenas texto corrido.
Inclua chamada para ação.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Você é especialista em conteúdo financeiro para YouTube." },
        { role: "user", content: prompt }
      ],
      temperature: 0.8
    });

    const roteiro = response.choices[0].message.content.trim();

    // 🔥 SALVAR SEMPRE AQUI
    const roteiroPath = path.join(outputDir, "roteiro.txt");

    fs.writeFileSync(roteiroPath, roteiro, "utf8");

    console.log("✅ Roteiro gerado com sucesso!");
    console.log("📄 Salvo em:", roteiroPath);

  } catch (error) {
    console.error("❌ Erro ao gerar roteiro:");
    console.error(error.response?.data || error.message);
    process.exit(1);
  }
}

// ===============================
// EXECUÇÃO
// ===============================

const tipo = process.argv[2] || "long";
gerarRoteiro(tipo);
