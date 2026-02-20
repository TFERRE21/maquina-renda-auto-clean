import fs from "fs";
import path from "path";
import { google } from "googleapis";

const VIDEO_PATH = path.resolve("output/video_final.mp4");
const THUMB_PATH = path.resolve("output/thumb.jpg");

const oauth2Client = new google.auth.OAuth2(
  process.env.YT_CLIENT_ID,
  process.env.YT_CLIENT_SECRET,
  process.env.YT_REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.YT_REFRESH_TOKEN,
});

const youtube = google.youtube({
  version: "v3",
  auth: oauth2Client,
});

async function upload() {
  const title = gerarTitulo();
  const description = gerarDescricao();

  const response = await youtube.videos.insert({
    part: "snippet,status",
    requestBody: {
      snippet: {
        title,
        description,
        tags: ["investimentos", "curiosidades", "shorts"],
        categoryId: "27",
      },
      status: {
        privacyStatus: "public",
      },
    },
    media: {
      body: fs.createReadStream(VIDEO_PATH),
    },
  });

  const videoId = response.data.id;

  await youtube.thumbnails.set({
    videoId,
    media: {
      body: fs.createReadStream(THUMB_PATH),
    },
  });

  console.log("✅ Vídeo enviado com sucesso!");
}

function gerarTitulo() {
  return `💰 ${new Date().toLocaleDateString()} | Você sabia disso sobre investimentos?`;
}

function gerarDescricao() {
  return `
Descubra algo incrível sobre investimentos!

📌 Inscreva-se para mais vídeos automáticos todos os dias.

#investimentos #dinheiro #curiosidades
`;
}

upload();
