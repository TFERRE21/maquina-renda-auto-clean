import { google } from "googleapis";
import fs from "fs";
import path from "path";

const {
  YOUTUBE_CLIENT_ID,
  YOUTUBE_CLIENT_SECRET,
  YOUTUBE_REFRESH_TOKEN
} = process.env;

if (!YOUTUBE_CLIENT_ID || !YOUTUBE_CLIENT_SECRET || !YOUTUBE_REFRESH_TOKEN) {
  console.error("❌ Variáveis YOUTUBE_* não configuradas no Render.");
  process.exit(1);
}

async function uploadVideo(videoPath, isShort = false) {
  try {
    console.log("📤 Iniciando upload para o YouTube...");

    const oauth2Client = new google.auth.OAuth2(
      YOUTUBE_CLIENT_ID,
      YOUTUBE_CLIENT_SECRET
    );

    oauth2Client.setCredentials({
      refresh_token: YOUTUBE_REFRESH_TOKEN
    });

    const youtube = google.youtube({
      version: "v3",
      auth: oauth2Client
    });

    // Lê roteiro
    const scriptPath = path.resolve("output", "roteiro.txt");
    const roteiro = fs.existsSync(scriptPath)
      ? fs.readFileSync(scriptPath, "utf8")
      : "Aprenda a investir melhor em 2026.";

    const baseTitulo = roteiro
      .replace(/\n/g, " ")
      .slice(0, 70);

    const titulo = isShort
      ? `${baseTitulo} 💰 #shorts`
      : `${baseTitulo} | Estratégia de Investimento 2026 🚀`;

    const descricao = `
🔥 Conteúdo focado em investimentos e renda!

${roteiro.slice(0, 1500)}

📈 Temas:
#investimentos #rendapassiva #educacaofinanceira #dinheiro #bitcoin

Inscreva-se para mais conteúdos!
`;

    const response = await youtube.videos.insert({
      part: "snippet,status",
      requestBody: {
        snippet: {
          title: titulo,
          description: descricao,
          tags: [
            "investimentos",
            "renda extra",
            "educação financeira",
            "dinheiro",
            "bitcoin",
            "empreendedorismo"
          ],
          categoryId: "22"
        },
        status: {
          privacyStatus: "public",
          selfDeclaredMadeForKids: false
        }
      },
      media: {
        body: fs.createReadStream(videoPath)
      }
    });

    console.log("✅ Upload concluído!");
    console.log("🔗 ID do vídeo:", response.data.id);

  } catch (error) {
    console.error("❌ Erro ao enviar vídeo:");
    console.error(error.response?.data || error.message);
    process.exit(1);
  }
}

async function main() {
  const horizontalPath = path.resolve("output", "video-horizontal.mp4");
  const verticalPath = path.resolve("output", "video-vertical.mp4");

  if (fs.existsSync(horizontalPath)) {
    await uploadVideo(horizontalPath, false);
  }

  if (fs.existsSync(verticalPath)) {
    await uploadVideo(verticalPath, true);
  }

  console.log("🎉 Upload finalizado.");
}

main();