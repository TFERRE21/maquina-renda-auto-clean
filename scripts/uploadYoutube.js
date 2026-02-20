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
  console.error("❌ Vídeo não encontrado:", VIDEO_PATH);
  process.exit(1);
}

if (!fs.existsSync(METADATA_PATH)) {
  console.error("❌ Metadata não encontrada:", METADATA_PATH);
  process.exit(1);
}

const metadata = JSON.parse(fs.readFileSync(METADATA_PATH, "utf8"));

// 🔐 OAuth
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


// 🔥 FUNÇÃO DE CONTROLE DE QUOTA
async function checkQuota() {
  try {
    await youtube.channels.list({
      part: "snippet",
      mine: true
    });
    return true;
  } catch (err) {
    const message = err.response?.data?.error?.message || "";

    if (message.toLowerCase().includes("quota")) {
      console.warn("⚠️ Quota diária do YouTube atingida.");
      return false;
    }

    return true;
  }
}


// 🔥 AGENDAMENTO AUTOMÁTICO BRASIL
function getScheduledTime() {
  const now = new Date();

  const brasilOffset = -3; // UTC-3
  const brasilNow = new Date(now.getTime() + brasilOffset * 60 * 60 * 1000);

  const target = new Date(brasilNow);

  if (type === "short") {
    target.setHours(9, 0, 0, 0);
  } else {
    target.setHours(21, 0, 0, 0);
  }

  if (brasilNow > target) {
    target.setDate(target.getDate() + 1);
  }

  const utcTime = new Date(target.getTime() - brasilOffset * 60 * 60 * 1000);

  return utcTime.toISOString();
}


// 🚀 FUNÇÃO PRINCIPAL
async function upload() {
  try {
    console.log(`🚀 Enviando ${type.toUpperCase()} para o YouTube...`);

    const allowed = await checkQuota();
    if (!allowed) {
      console.log("⏳ Upload cancelado por limite de quota.");
      return;
    }

    const scheduledTime = getScheduledTime();

    const response = await youtube.videos.insert({
      part: "snippet,status",
      requestBody: {
        snippet: {
          title: metadata.title,
          description: metadata.description,
          tags: metadata.tags || [],
          categoryId: "27"
        },
        status: {
          privacyStatus: "private",
          publishAt: scheduledTime,
          selfDeclaredMadeForKids: false
        }
      },
      media: {
        body: fs.createReadStream(VIDEO_PATH)
      }
    });

    const videoId = response.data.id;

    console.log("✅ Upload realizado com sucesso!");
    console.log("🕒 Agendado para:", scheduledTime);
    console.log("🔗 https://youtube.com/watch?v=" + videoId);

    // 🖼 Upload da thumbnail
    if (fs.existsSync(THUMB_PATH)) {
      console.log("🖼 Enviando thumbnail...");

      await youtube.thumbnails.set({
        videoId,
        media: {
          body: fs.createReadStream(THUMB_PATH)
        }
      });

      console.log("✅ Thumbnail enviada!");
    }

  } catch (err) {

    const errorData = err.response?.data;

    // 🔥 TRATAMENTO INTELIGENTE DE LIMITE DIÁRIO
    if (
      errorData?.error?.message?.toLowerCase().includes("exceeded") ||
      errorData?.error?.message?.toLowerCase().includes("quota")
    ) {
      console.warn("⚠️ Limite diário do YouTube atingido.");
      console.warn("⏳ Tentará novamente no próximo ciclo.");
      return;
    }

    console.error("❌ Erro ao enviar para o YouTube:");
    console.error(errorData || err.message);
    process.exit(1);
  }
}

upload();
