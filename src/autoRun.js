import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import OpenAI from "openai";
import { google } from "googleapis";

//////////////////////////////////////////////////
// CONFIG
//////////////////////////////////////////////////

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const ROOT = process.cwd();
const OUTPUT = path.join(ROOT, "output");
const IMG_DIR = path.join(OUTPUT, "images");

if (!fs.existsSync(OUTPUT)) fs.mkdirSync(OUTPUT);
if (!fs.existsSync(IMG_DIR)) fs.mkdirSync(IMG_DIR);

console.log("🚀 Iniciando máquina automática YouTube...");

//////////////////////////////////////////////////
// 1️⃣ GERAR ROTEIRO IA
//////////////////////////////////////////////////

const roteiroPrompt = `
Crie um roteiro envolvente de 2 minutos para YouTube
sobre curiosidades surpreendentes do mundo.
Termine incentivando inscrição.
`;

const roteiroResponse = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [{ role: "user", content: roteiroPrompt }],
});

const roteiro = roteiroResponse.choices[0].message.content;

fs.writeFileSync(path.join(OUTPUT, "roteiro.txt"), roteiro);
console.log("✅ Roteiro criado!");

//////////////////////////////////////////////////
// 2️⃣ GERAR VOZ
//////////////////////////////////////////////////

console.log("🎙 Gerando voz...");

const speech = await openai.audio.speech.create({
  model: "gpt-4o-mini-tts",
  voice: "alloy",
  input: roteiro
});

const buffer = Buffer.from(await speech.arrayBuffer());
fs.writeFileSync(path.join(OUTPUT, "voz.mp3"), buffer);

console.log("✅ Voz criada!");

//////////////////////////////////////////////////
// 3️⃣ MÚSICA DE FUNDO
//////////////////////////////////////////////////

execSync(
  `ffmpeg -y -f lavfi -i anullsrc=r=24000:cl=mono -t 120 "${OUTPUT}/bg.mp3"`,
  { stdio: "ignore" }
);

//////////////////////////////////////////////////
// 4️⃣ GERAR IMAGENS
//////////////////////////////////////////////////

for (let i = 1; i <= 6; i++) {
  execSync(
    `ffmpeg -y -f lavfi -i color=c=black:s=720x1280 -frames:v 1 "${IMG_DIR}/img_${i}.png"`,
    { stdio: "ignore" }
  );
}

console.log("✅ Imagens criadas!");

//////////////////////////////////////////////////
// 5️⃣ GERAR THUMBNAIL AUTOMÁTICA
//////////////////////////////////////////////////

execSync(
  `ffmpeg -y -f lavfi -i color=c=blue:s=1280x720 -frames:v 1 "${OUTPUT}/thumb.jpg"`,
  { stdio: "ignore" }
);

//////////////////////////////////////////////////
// 6️⃣ CRIAR VÍDEO PROFISSIONAL
//////////////////////////////////////////////////

console.log("🎬 Criando vídeo final...");

execSync(`
ffmpeg -y \
-loop 1 -t 20 -i "${IMG_DIR}/img_1.png" \
-loop 1 -t 20 -i "${IMG_DIR}/img_2.png" \
-loop 1 -t 20 -i "${IMG_DIR}/img_3.png" \
-loop 1 -t 20 -i "${IMG_DIR}/img_4.png" \
-loop 1 -t 20 -i "${IMG_DIR}/img_5.png" \
-loop 1 -t 20 -i "${IMG_DIR}/img_6.png" \
-i "${OUTPUT}/voz.mp3" \
-i "${OUTPUT}/bg.mp3" \
-filter_complex "
[0:v]zoompan=z='min(zoom+0.0005,1.15)':d=500,scale=720:1280[v0];
[1:v]zoompan=z='min(zoom+0.0005,1.15)':d=500,scale=720:1280[v1];
[2:v]zoompan=z='min(zoom+0.0005,1.15)':d=500,scale=720:1280[v2];
[3:v]zoompan=z='min(zoom+0.0005,1.15)':d=500,scale=720:1280[v3];
[4:v]zoompan=z='min(zoom+0.0005,1.15)':d=500,scale=720:1280[v4];
[5:v]zoompan=z='min(zoom+0.0005,1.15)':d=500,scale=720:1280[v5];
[v0][v1][v2][v3][v4][v5]concat=n=6:v=1:a=0[v];
[6:a][7:a]amix=inputs=2:duration=shortest[a]
" \
-map "[v]" -map "[a]" \
-c:v libx264 -preset medium -crf 23 -pix_fmt yuv420p \
-c:a aac -b:a 128k \
-shortest \
"${OUTPUT}/video_final.mp4"
`, { stdio: "inherit" });

console.log("🎉 Vídeo pronto!");

//////////////////////////////////////////////////
// 7️⃣ GERAR TÍTULO + DESCRIÇÃO SEO
//////////////////////////////////////////////////

const seoResponse = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [{
    role: "user",
    content: `Crie um título chamativo e descrição otimizada SEO para YouTube baseado nisso:\n${roteiro}`
  }]
});

const seo = seoResponse.choices[0].message.content.split("\n");
const title = seo[0].replace("Título:", "").trim();
const description = seo.slice(1).join("\n");

//////////////////////////////////////////////////
// 8️⃣ UPLOAD AUTOMÁTICO YOUTUBE
//////////////////////////////////////////////////

console.log("📺 Enviando para YouTube...");

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

const response = await youtube.videos.insert({
  part: "snippet,status",
  requestBody: {
    snippet: {
      title,
      description,
      tags: ["curiosidades", "fatos", "mundo"],
      categoryId: "22"
    },
    status: {
      privacyStatus: "public"
    }
  },
  media: {
    body: fs.createReadStream(path.join(OUTPUT, "video_final.mp4"))
  }
});

await youtube.thumbnails.set({
  videoId: response.data.id,
  media: {
    body: fs.createReadStream(path.join(OUTPUT, "thumb.jpg"))
  }
});

console.log("🚀 VÍDEO ENVIADO COM SUCESSO!");
