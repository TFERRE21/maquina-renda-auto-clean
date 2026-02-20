import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const type = process.argv[2] || "short";

const audio = "output/audio.mp3";
const output = `output/video_${type}.mp4`;
const imagesDir = "output/images";

const images = fs.readdirSync(imagesDir).filter(f => f.endsWith(".png"));

const durationCmd = `ffprobe -i ${audio} -show_entries format=duration -v quiet -of csv="p=0"`;
const audioDuration = parseFloat(execSync(durationCmd).toString());

const total = type === "short" ? 60 : audioDuration; // 🔥 short 60s para viral
const perImage = total / images.length;

let concat = "";
images.forEach(img => {
  concat += `file '${imagesDir}/${img}'\n`;
  concat += `duration ${perImage}\n`;
});

fs.writeFileSync("output/list.txt", concat);

execSync(`
ffmpeg -y \
-f concat -safe 0 -i output/list.txt \
-i ${audio} \
-vf "scale=720:1280" \
-c:v libx264 -preset ultrafast -crf 35 \
-c:a aac -b:a 64k \
-t ${total} \
${output}
`, { stdio: "inherit" });

console.log("✅ Vídeo leve criado");
