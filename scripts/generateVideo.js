import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import ffmpegPath from "ffmpeg-static";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generateVideos() {

    const outputDir = path.resolve(__dirname, "../output");
    const imagesDir = path.resolve(outputDir, "images");
    const audioPath = path.resolve(outputDir, "audio.mp3");

    const horizontalPath = path.resolve(outputDir, "video-horizontal.mp4");
    const verticalPath = path.resolve(outputDir, "video-vertical.mp4");
    const listPath = path.resolve(outputDir, "images.txt");

    if (!fs.existsSync(imagesDir)) {
        throw new Error("❌ Pasta images não encontrada.");
    }

    const images = fs.readdirSync(imagesDir)
        .filter(f => f.endsWith(".png"))
        .sort();

    if (images.length === 0) {
        throw new Error("❌ Nenhuma imagem encontrada.");
    }

    if (!fs.existsSync(audioPath)) {
        throw new Error("❌ audio.mp3 não encontrado.");
    }

    let content = "";

    images.forEach(img => {
        const fullPath = path.resolve(imagesDir, img).replace(/\\/g, "/");
        content += `file '${fullPath}'\n`;
        content += `duration 5\n`;
    });

    const lastImage = path.resolve(imagesDir, images[images.length - 1]).replace(/\\/g, "/");
    content += `file '${lastImage}'\n`;

    fs.writeFileSync(listPath, content);

    console.log("🎬 Gerando horizontal...");

    execSync(
        `"${ffmpegPath}" -y -f concat -safe 0 -i "${listPath}" -i "${audioPath}" -vf "scale=1280:720" -c:v libx264 -pix_fmt yuv420p -c:a aac -shortest -movflags +faststart "${horizontalPath}"`,
        { stdio: "inherit" }
    );

    console.log("✅ Horizontal criado!");

    console.log("📱 Gerando vertical (Short)...");

    execSync(
        `"${ffmpegPath}" -y -f concat -safe 0 -i "${listPath}" -i "${audioPath}" -vf "scale=720:1280" -c:v libx264 -pix_fmt yuv420p -c:a aac -shortest -movflags +faststart "${verticalPath}"`,
        { stdio: "inherit" }
    );

    console.log("✅ Vertical criado!");
}

generateVideos();