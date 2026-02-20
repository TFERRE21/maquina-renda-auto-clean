import 'dotenv/config'
import fs from "fs"
import path from "path"
import { google } from "googleapis"

const {
  YOUTUBE_CLIENT_ID,
  YOUTUBE_CLIENT_SECRET,
  YOUTUBE_REFRESH_TOKEN
} = process.env

if (!YOUTUBE_CLIENT_ID || !YOUTUBE_CLIENT_SECRET || !YOUTUBE_REFRESH_TOKEN) {
  console.error("❌ Variáveis do YouTube não configuradas no ambiente.")
  process.exit(1)
}

async function uploadVideo() {
  console.log("📤 Iniciando upload para o YouTube...")

  const oauth2Client = new google.auth.OAuth2(
    YOUTUBE_CLIENT_ID,
    YOUTUBE_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  )

  oauth2Client.setCredentials({
    refresh_token: YOUTUBE_REFRESH_TOKEN
  })

  const youtube = google.youtube({
    version: "v3",
    auth: oauth2Client
  })

  const videoPath = path.resolve("output/video-vertical.mp4")

  const response = await youtube.videos.insert({
    part: "snippet,status",
    requestBody: {
      snippet: {
        title: "Novo Short Automático 🚀",
        description: "Gerado automaticamente pela máquina",
        tags: ["shorts", "automacao"],
        categoryId: "22"
      },
      status: {
        privacyStatus: "public"
      }
    },
    media: {
      body: fs.createReadStream(videoPath)
    }
  })

  console.log("✅ Upload concluído!")
  console.log("🔗 ID do vídeo:", response.data.id)
}

uploadVideo()