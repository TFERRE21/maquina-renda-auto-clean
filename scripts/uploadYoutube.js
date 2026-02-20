import { google } from "googleapis";
import fs from "fs";
import path from "path";

const OUTPUT_DIR = path.resolve("output");
const videoPath = path.join(OUTPUT_DIR, "video_final.mp4");
const thumbPath = path.join(OUTPUT_DIR, "thumbnail.png");

async function upload() {
  try {
    if (!fs.existsSync(videoPath)) {
      console.log("❌ Vídeo não encontrado.");
      process.exit(1);
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.YOUTUBE_CLIENT_ID,
      process.env.YOUTUBE_CLIENT_SECRET,
      "http://localhost"
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.YOUTUBE_REFRESH_TOKEN,
    });

    const youtube = google.youtube({
      version: "v3",
      auth: oauth2Client,
    });

    const title = `🔥 ${new Date().toLocaleDateString()} Descubra Algo Surpreendente!`;

    const description = `
🚀 Vídeo automático gerado pelo sistema

📌 Inscreva-se para mais conteúdos!
📈 Conteúdo diário automatizado

#Shorts #Investimentos #Curiosidades
`;

    console.log("📤 Enviando vídeo para YouTube...");

    const response = await youtube.videos.insert({
      part: ["snippet", "status"],
      requestBody: {
        snippet: {
          title,
          description,
          tags: ["curiosidades", "investimentos", "automático"],
          categoryId: "27"
        },
        status: {
          privacyStatus: "public"
        }
      },
      media: {
        body: fs.createReadStream(videoPath)
      }
    });

    const videoId = response.data.id;

    console.log("✅ Vídeo enviado com sucesso!");
    console.log("🔗 https://youtube.com/watch?v=" + videoId);

    if (fs.existsSync(thumbPath)) {
      console.log("🖼 Enviando thumbnail...");
      await youtube.thumbnails.set({
        videoId,
        media: {
          body: fs.createReadStream(thumbPath)
        }
      });
      console.log("✅ Thumbnail enviada!");
    }

  } catch (error) {
    console.error("❌ ERRO NO UPLOAD:", error.message);
    process.exit(1);
  }
}

upload();
