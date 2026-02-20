import fs from "fs";
import path from "path";
import { google } from "googleapis";

console.log("📤 Iniciando upload para o YouTube...");

// ===============================
// VARIÁVEIS DE AMBIENTE (SEGURO)
// ===============================
const CLIENT_ID = process.env.YOUTUBE_CLIENT_ID;
const CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.YOUTUBE_REFRESH_TOKEN;

if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
  console.error("❌ Variáveis do YouTube não configuradas no ambiente.");
  process.exit(1);
}

// ===============================
// AUTENTICAÇÃO
// ===============================
const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  "http://localhost"
);

oauth2Client.setCredentials({
  refresh_token: REFRESH_TOKEN,
});

const youtube = google.youtube({
  version: "v3",
  auth: oauth2Client,
});

// ===============================
// FUNÇÃO DE UPLOAD
// ===============================
async function uploadVideo({
  filePath,
  title,
  description,
  tags = [],
  isShort = false,
}) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Arquivo não encontrado: ${filePath}`);
    return;
  }

  try {
    const response = await youtube.videos.insert({
      part: ["snippet", "status"],
      requestBody: {
        snippet: {
          title,
          description,
          tags,
          categoryId: "27", // Educação
        },
        status: {
          privacyStatus: "public",
        },
      },
      media: {
        body: fs.createReadStream(filePath),
      },
    });

    console.log(
      `✅ Upload concluído: https://www.youtube.com/watch?v=${response.data.id}`
    );
  } catch (error) {
    console.error(
      "❌ Erro no upload:",
      error.response?.data || error.message
    );
  }
}

// ===============================
// EXECUÇÃO PRINCIPAL
// ===============================
async function main() {
  const outputDir = path.resolve("output");

  const horizontalPath = path.join(outputDir, "video-horizontal.mp4");
  const verticalPath = path.join(outputDir, "video-vertical.mp4");

  const baseTitle =
    "💰 Como Ganhar Dinheiro Online em 2026 | Estratégias Reais";

  const baseDescription =
    "Descubra estratégias reais para gerar renda extra online.\n\n" +
    "🚀 Conteúdo gerado automaticamente\n" +
    "📈 Inscreva-se para mais conteúdos sobre renda e investimentos!\n\n" +
    "#dinheiro #rendaextra #investimentos";

  // 🎬 Upload vídeo normal
  await uploadVideo({
    filePath: horizontalPath,
    title: baseTitle,
    description: baseDescription,
    tags: ["dinheiro", "renda extra", "investimentos", "negócios online"],
    isShort: false,
  });

  // 📱 Upload Short
  await uploadVideo({
    filePath: verticalPath,
    title: `${baseTitle} #Shorts`,
    description: baseDescription + "\n\n#Shorts",
    tags: ["shorts", "dinheiro", "renda extra"],
    isShort: true,
  });
}

main();