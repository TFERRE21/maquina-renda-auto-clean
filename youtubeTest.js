import fs from "fs";
import path from "path";
import { google } from "googleapis";

console.log("🔎 Iniciando teste YouTube...");

//////////////////////////////////////////////////
// 1️⃣ VALIDAR VARIÁVEIS
//////////////////////////////////////////////////

if (!process.env.YOUTUBE_CLIENT_ID) {
  console.log("❌ YOUTUBE_CLIENT_ID faltando");
  process.exit(1);
}

if (!process.env.YOUTUBE_CLIENT_SECRET) {
  console.log("❌ YOUTUBE_CLIENT_SECRET faltando");
  process.exit(1);
}

if (!process.env.YOUTUBE_REFRESH_TOKEN) {
  console.log("❌ YOUTUBE_REFRESH_TOKEN faltando");
  process.exit(1);
}

console.log("✅ Variáveis carregadas!");

//////////////////////////////////////////////////
// 2️⃣ CONFIGURAR OAUTH
//////////////////////////////////////////////////

const oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET
);

oauth2Client.setCredentials({
  refresh_token: process.env.YOUTUBE_REFRESH_TOKEN,
});

const youtube = google.youtube({
  version: "v3",
  auth: oauth2Client,
});

//////////////////////////////////////////////////
// 3️⃣ CRIAR VÍDEO PEQUENO DE TESTE
//////////////////////////////////////////////////

const ROOT = process.cwd();
const OUTPUT = path.join(ROOT, "output");

if (!fs.existsSync(OUTPUT)) fs.mkdirSync(OUTPUT);

const testVideoPath = path.join(OUTPUT, "test.mp4");

// vídeo preto 5 segundos
console.log("🎬 Criando vídeo de teste...");

await import("child_process").then(({ execSync }) => {
  execSync(
    `ffmpeg -y -f lavfi -i color=c=black:s=1280x720 -t 5 -pix_fmt yuv420p -c:v libx264 "${testVideoPath}"`,
    { stdio: "ignore" }
  );
});

console.log("✅ Vídeo criado!");

//////////////////////////////////////////////////
// 4️⃣ TENTAR UPLOAD
//////////////////////////////////////////////////

console.log("📺 Enviando vídeo de teste...");

try {
  const response = await youtube.videos.insert({
    part: "snippet,status",
    requestBody: {
      snippet: {
        title: "TESTE AUTOMATICO API",
        description: "Se este vídeo apareceu, a API está funcionando.",
        categoryId: "22",
      },
      status: {
        privacyStatus: "private",
      },
    },
    media: {
      body: fs.createReadStream(testVideoPath),
    },
  });

  console.log("🚀 UPLOAD FUNCIONOU!");
  console.log("ID do vídeo:", response.data.id);
} catch (error) {
  console.log("❌ ERRO NO UPLOAD:");
  console.log(error.response?.data || error.message);
}
