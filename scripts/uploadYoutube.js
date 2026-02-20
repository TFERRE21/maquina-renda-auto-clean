import { google } from "googleapis";
import fs from "fs";
import path from "path";

function checkEnv() {
  const requiredVars = [
    "YOUTUBE_CLIENT_ID",
    "YOUTUBE_CLIENT_SECRET",
    "YOUTUBE_REFRESH_TOKEN"
  ];

  let missing = [];

  requiredVars.forEach(v => {
    if (!process.env[v]) {
      missing.push(v);
    }
  });

  if (missing.length > 0) {
    console.error("❌ Variáveis faltando no Render:");
    missing.forEach(v => console.error("➡️", v));
    process.exit(1);
  }
}

checkEnv();

async function uploadVideo(videoPath, isShort = false) {
  try {
    console.log("📤 Iniciando upload...");

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

    const scriptPath = path.resolve("output", "roteiro.txt");
    const roteiro = fs.existsSync(scriptPath)
      ? fs.readFileSync(scriptPath, "utf8")
      : "Investimentos e renda passiva.";

    const titulo = isShort
      ? roteiro.slice(0, 60) + " 💰 #shorts"
      : roteiro.slice(0, 70) + " | Estratégia Financeira 2026";

    const descricao = `
🚀 Conteúdo focado em investimento e renda passiva.

${roteiro.slice(0, 1500)}

#investimentos #rendapassiva #educacaofinanceira
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
            "educação financeira"
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

    console.log("✅ Upload feito!");
    console.log("🎯 ID:", response.data.id);

  } catch (error) {
    console.error("❌ ERRO REAL DO YOUTUBE:");
    console.error(error.response?.data || error.message);
    process.exit(1);
  }
}

async function main() {
  const horizontal = path.resolve("output", "video-horizontal.mp4");
  const vertical = path.resolve("output", "video-vertical.mp4");

  if (fs.existsSync(horizontal)) {
    await uploadVideo(horizontal, false);
  }

  if (fs.existsSync(vertical)) {
    await uploadVideo(vertical, true);
  }

  console.log("🎉 Finalizado.");
}

main();