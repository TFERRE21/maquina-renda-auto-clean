import { execSync } from "child_process";

console.log("🚀 MODO 2 MIN ATIVADO");

try {
  execSync("node scripts/generateScript.js", { stdio: "inherit" });
  execSync("node scripts/generateAudio.js", { stdio: "inherit" });
  execSync("node scripts/generateImages.js", { stdio: "inherit" });
  execSync("node scripts/buildVideo.js", { stdio: "inherit" });
  execSync("node scripts/generateThumb.js", { stdio: "inherit" });
  execSync("node scripts/uploadYoutube.js", { stdio: "inherit" });

  console.log("🎉 SISTEMA 100% AUTOMÁTICO CONCLUÍDO!");
} catch (err) {
  console.error("❌ ERRO NA AUTOMAÇÃO");
  process.exit(1);
}
