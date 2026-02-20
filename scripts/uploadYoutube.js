import { google } from "googleapis";
import fs from "fs";
import path from "path";

const {
  YOUTUBE_CLIENT_ID,
  YOUTUBE_CLIENT_SECRET,
  YOUTUBE_REFRESH_TOKEN
} = process.env;

if (!YOUTUBE_CLIENT_ID || !YOUTUBE_CLIENT_SECRET || !YOUTUBE_REFRESH_TOKEN) {
  console.error("❌ Variáveis do YouTube não configuradas no Render.");
  process.exit(1);
}

async function uploadVideo(videoPath, isShort = false) {
  try {
    console.log("📤 Iniciando upload para o YouTube...");

    const oauth2Client = new google.auth.OAuth2(
      YOUTUBE_CLIENT_ID,
      YOUTUBE_CLIENT_SECRET,
      "urn:ietf:wg:oauth:2.0:oob"
    );

    oauth2Client.setCredentials({
      refresh_token: YOUTUBE_REFRESH_TOKEN
    });

    const youtube = google.youtube({
      version: "v3",
      auth: oauth2Client
    });

    // 📖 Ler roteiro para gerar título base
    const scriptPath = path.resolve("output", "roteiro.txt");
    const roteiro = fs.existsSync(scriptPath)
      ? fs.readFileSync(scriptPath, "utf8")
      : "Dicas financeiras para investir melhor";

    const baseTitulo = roteiro.split(".")[0].slice(0, 80);

    const titulo = isShort
      ? `${baseTitulo} 💰 #shorts`
      : `${baseTitulo} | Invista Melhor em 2026 🚀`;

    const descricao = `
🔥 Aprenda a investir melhor e aumentar sua renda!

${roteiro.slice(0, 1500)}

📈 Inscreva-se para mais conteúdos sobre:
#investimentos #rendapassiva #educacaofinanceira #dinheiro #bitcoin

@seucanal
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
          categoryId: "22" // Pessoas e blogs (financeiro funciona bem aqui)
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
    console.error("❌ Erro ao enviar vídeo:", error.message);
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
}

main();