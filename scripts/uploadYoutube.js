import fs from "fs";
import path from "path";
import { google } from "googleapis";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, "..");
const OUTPUT_DIR = path.join(ROOT, "output");

const type = process.argv[2] || "long";

const VIDEO_PATH = path.join(OUTPUT_DIR, `video_${type}.mp4`);
const THUMB_PATH = path.join(OUTPUT_DIR, `thumb_${type}.jpg`);
const METADATA_PATH = path.join(OUTPUT_DIR, `metadata_${type}.json`);

if (!fs.existsSync(VIDEO_PATH)) {
  console.error("❌ Vídeo não encontrado.");
  process.exit(1);
}

if (!fs.existsSync(METADATA_PATH)) {
  console.error("❌ Metadata não encontrada.");
  process.exit(1);
}

const metadata = JSON.parse(fs.readFileSync(METADATA_PATH, "utf8"));

const oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  process.env.YOUTUBE_REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.YOUTUBE_REFRESH_TOKEN
});

const youtube = google.youtube({
  version: "v3",
  auth: oauth2Client
});

async function upload() {
  try {
    console.log("🚀 Enviando vídeo para o YouTube...");

    const response = await youtube.videos.insert({
      part: "snippet,status",
      requestBody: {
        snippet: {
          title: metadata.title,
          description: metadata.description,
          tags: metadata.tags
        },
        status: {
          privacyStatus: "public"
        }
      },
      media: {
        body: fs.createReadStream(VIDEO_PATH)
      }
    });

    const videoId = response.data.id;
    console.log("✅ Vídeo enviado com sucesso!");
    console.log("🔗 https://youtube.com/watch?v=" + videoId);

    if (fs.existsSync(THUMB_PATH)) {
      console.log("🖼 Enviando thumbnail...");

      await youtube.thumbnails.set({
        videoId: videoId,
        media: {
          body: fs.createReadStream(THUMB_PATH)
        }
      });

      console.log("✅ Thumbnail enviada!");
    }

  } catch (err) {
    console.error("❌ Erro ao enviar para o YouTube:", err.message);
    process.exit(1);
  }
}

upload();
