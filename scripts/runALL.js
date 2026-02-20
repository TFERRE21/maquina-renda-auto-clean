import { execSync } from "child_process";

console.log("🚀 MODO SHORTS ONLY ATIVADO");

for (let i = 1; i <= 3; i++) {
  console.log(`🎬 Gerando Short ${i}`);
  execSync("node scripts/generateScript.js short", { stdio: "inherit" });
  execSync("node scripts/generateImages.js short", { stdio: "inherit" });
  execSync("node scripts/generateAudio.js short", { stdio: "inherit" });
  execSync("node scripts/generateVideo.js short", { stdio: "inherit" });
  execSync("node scripts/generateThumbnail.js short", { stdio: "inherit" });
  execSync("node scripts/uploadYoutube.js short", { stdio: "inherit" });
}

console.log("🔥 3 Shorts publicados");
