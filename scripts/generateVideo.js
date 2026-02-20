import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, "..");
const OUTPUT_DIR = path.join(ROOT, "output");
const IMAGES_DIR = path.join(OUTPUT_DIR, "images");

const type = process.argv[2] || "long";

const audioPath = path.join(OUTPUT_DIR, "audio.mp3");
const scriptPath = path.join(OUTPUT_DIR, "script.txt");
const outputVideo = path.join(OUTPUT_DIR, `video_${type}.mp4`);

const durationCmd = `ffprobe -i "${audioPath}" -show_entries format=duration -v quiet -of csv="p=0"`;
const audioDuration = parseFloat(execSync(durationCmd).toString().trim());

const totalDuration = type === "short" ? 120 : audioDuration;

const images = fs.readdirSync(IMAGES_DIR).filter(f => f.endsWith(".png"));
const secondsPerImage = totalDuration / images.length;

const listPath = path.join(OUTPUT_DIR, "images.txt");
let content = "";

images.forEach(img => {
  content += `file '${path.join(IMAGES_DIR, img)}'\n`;
  content += `duration ${secondsPerImage}\n`;
});

fs.writeFileSync(listPath, content);

// legenda simples automática
const subtitlePath = path.join(OUTPUT_DIR, "subs.srt");
const text = fs.readFileSync(scriptPath, "utf8");
const parts = text.split(". ");
let srt = "";
let time = 0;

parts.forEach((line, i) => {
  const end = time + 4;
  srt += `${i + 1}\n00:00:${String(time).padStart(2,"0")},000 --> 00:00:${String(end).padStart(2,"0")},000\n${line}\n\n`;
  time += 4;
});

fs.writeFileSync(subtitlePath, srt);

execSync(`
ffmpeg -y -f concat -safe 0 -i "${listPath}" -i "${audioPath}" \
-vf "scale=720:1280,zoompan=z='min(zoom+0.0005,1.2)':d=125,subtitles=${subtitlePath}" \
-c:v libx264 -preset veryfast -crf 32 -c:a aac -b:a 96k \
-t ${totalDuration} \
"${outputVideo}"
`, { stdio: "inherit" });

console.log("✅ Vídeo final criado!");
