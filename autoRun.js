import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const ROOT = process.cwd();
const OUTPUT = path.join(ROOT, "output");
const IMG_DIR = path.join(OUTPUT, "images");

if (!fs.existsSync(OUTPUT)) fs.mkdirSync(OUTPUT);
if (!fs.existsSync(IMG_DIR)) fs.mkdirSync(IMG_DIR);

console.log("🚀 Iniciando automação profissional...");

//////////////////////////////////////////////////
// 1️⃣ GERAR ROTEIRO
//////////////////////////////////////////////////

const roteiro = `
Você sabia que existem fatos surpreendentes sobre o mundo que poucas pessoas conhecem?

Hoje você vai descobrir curiosidades incríveis que podem mudar sua forma de enxergar o planeta.

Existem lugares na Terra onde nunca choveu.
Animais que conseguem sobreviver no espaço.
E fenômenos naturais que desafiam a ciência moderna.

Fique até o final porque o último fato vai realmente te surpreender.
`;

fs.writeFileSync(path.join(OUTPUT, "roteiro.txt"), roteiro);
console.log("✅ Roteiro salvo!");

//////////////////////////////////////////////////
// 2️⃣ GERAR VOZ REAL (OpenAI TTS)
//////////////////////////////////////////////////

console.log("🎙 Gerando voz OpenAI...");

const speech = await openai.audio.speech.create({
  model: "gpt-4o-mini-tts",
  voice: "alloy",
  input: roteiro
});

const buffer = Buffer.from(await speech.arrayBuffer());
fs.writeFileSync(path.join(OUTPUT, "voz.mp3"), buffer);

console.log("✅ Voz gerada!");

//////////////////////////////////////////////////
// 3️⃣ GERAR MÚSICA DE FUNDO
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
// 5️⃣ CRIAR VÍDEO COM ZOOM + LEGENDA
//////////////////////////////////////////////////

console.log("🎬 Criando vídeo cinematográfico...");

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
-c:v libx264 -preset ultrafast -crf 28 \
-c:a aac -b:a 128k \
-shortest \
"${OUTPUT}/video_final.mp4"
`, { stdio: "inherit" });

console.log("🎉 VÍDEO PROFISSIONAL GERADO!");
