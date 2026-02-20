// scripts/runALL.js
import { execSync } from "child_process";

try {
  console.log("🚀 MODO 2 MIN ATIVADO");

  execSync("node scripts/generateScript.js", { stdio: "inherit" });
  execSync("node scripts/generateAudio.js", { stdio: "inherit" });
  execSync("node scripts/generateImages.js", { stdio: "inherit" });
  execSync("node scripts/buildVideo.js", { stdio: "inherit" });

  console.log("🎉 VÍDEO 2 MIN GERADO COM SUCESSO!");
} catch (error) {
  console.error("❌ ERRO NA AUTOMAÇÃO");
  process.exit(1);
}
