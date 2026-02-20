import fs from "fs";
import { execSync } from "child_process";
import path from "path";

const ROOT = process.cwd();
const OUTPUT_DIR = path.join(ROOT, "output");
const IMAGES_DIR = path.join(OUTPUT_DIR, "images");

const outputVideo = path.join(OUTPUT_DIR, "video_short.mp4");

const images = fs.readdirSync(IMAGES_DIR).filter(f => f.endsWith(".png"));

let concatFile = "";
images.forEach(img => {
  concatFile += `file '${path.join(IMAGES_DIR, img)}'\n`;
  concatFile += `duration 10\n`;
});

fs.writeFileSync(path.join(OUTPUT_DIR, "list.txt"), concatFile);

execSync(`
ffmpeg -y \
-f concat -safe 0 -i ${OUTPUT_DIR}/list.txt \
-i ${OUTPUT_DIR}/audio.mp3 \
-vf "scale=720:1280" \
-c:v libx264 -preset ultrafast -crf 35 \
-c:a aac -b:a 64k \
-t 60 \
${outputVideo}
`, { stdio: "inherit" });

console.log("✅ Vídeo criado!");
