import fs from "fs";
import { execSync } from "child_process";
import path from "path";

const ROOT = process.cwd();
const OUTPUT_DIR = path.join(ROOT, "output");

const scriptPath = path.join(OUTPUT_DIR, "script.txt");

if (!fs.existsSync(scriptPath)) {
  console.error("❌ script.txt não encontrado.");
  process.exit(1);
}

console.log("🎙 Gerando áudio...");

// Áudio leve silencioso como placeholder
execSync(`
ffmpeg -f lavfi -i anullsrc=r=24000:cl=mono -t 60 -q:a 9 -acodec mp3 ${OUTPUT_DIR}/audio.mp3 -y
`, { stdio: "inherit" });

console.log("✅ Áudio criado!");
