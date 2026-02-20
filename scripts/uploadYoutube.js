import { google } from "googleapis";
import fs from "fs";
import path from "path";

// ===============================
// VALIDAÇÃO DE VARIÁVEIS
// ===============================

function checkEnv() {
  const required = [
    "YOUTUBE_CLIENT_ID",
    "YOUTUBE_CLIENT_SECRET",
    "YOUTUBE_REFRESH_TOKEN"
  ];

  const missing = required.filter(v => !process.env[v]);

  if (missing.length > 0) {
    console.error("❌ Variáveis faltando no Render:");
    missing.forEach(v => console.error("➡️", v));
    process.exit(1);
  }
}

checkEnv();

// ===============================
// CONFIGURAÇÃO YOUTUBE
// ===============================

const oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET
);

oauth2Client.setCredentials({
  refresh_token: process.env.YOUTUBE_REFRESH_TOKEN
});

const youtube = google.youtube({
  version: "v3",
  auth: oauth2Client
});

// ===============================
// FUNÇÃO DE UPLOAD
// ===============================

async function uploadVideo(videoPath, isShort = false) {
  try {
    console.log("📤 Iniciando upload...");

    if (!fs.existsSync(videoPath)) {
      console.log("⚠️ Vídeo não encontrado:", videoPath);
      return;
    }

    const roteiroPath = path.resolve("output", "roteiro.txt");
    const roteiro = fs.existsSync(roteiroPath)
      ? fs.readFileSync(roteiroPath, "utf8")
      : "Conteúdo sobre investimentos e renda.";

    const tituloBase = roteiro.replace(/\n/g, " ").slice(0, 70);

    const titulo = isShort
      ? `${tituloBase} 💰 #shorts`
      : `${tituloBase} | Estratégia de Investimento 2026 🚀`;

    const descricao = `
🚀 Conteúdo focado em investimentos e renda passiva.

${roteiro.slice(0, 1500)}

#investimentos #rendapassiva #educacaofinanceira #dinheiro #bitcoin
`;

    const response = await youtube.videos.insert({
      part: "snippet,status",
      requestBody: {
        snippet: {
          title: titulo,
          description: descricao,
          tags: [
            "investimentos",
            "renda passiva",
            "educação financeira",
            "dinheiro",
            "bitcoin"
          ],
          categoryId: "22"
        },
        status: {
          privacyStatus: "public"
        }
      },
      media: {
        body: fs.createReadStream(videoPath)
      }
    });

    console.log("✅ Upload concluído!");
    console.log("🎯 ID do vídeo:", response.data.id);

  } catch (error) {
    console.error("❌ ERRO REAL DO YOUTUBE:");
    console.error(error.response?.data || error.message);
    process.exit(1);
  }
}

// ===============================
// EXECUÇÃO PRINCIPAL
// ===============================

async function main() {
  const horizontal = path.resolve("output", "video-horizontal.mp4");
  const vertical = path.resolve("output", "video-vertical.mp4");

  if (fs.existsSync(horizontal)) {
    await uploadVideo(horizontal, false);
  }

  if (fs.existsSync(vertical)) {
    await uploadVideo(vertical, true);
  }

  console.log("🎉 Processo finalizado.");
}

main();
