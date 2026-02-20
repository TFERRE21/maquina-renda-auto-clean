import { execSync } from "child_process";
import dotenv from "dotenv";

dotenv.config();

console.log("🚀 Iniciando automação completa...");

try {

  execSync("node scripts/generateScript.js", { stdio: "inherit" });
  execSync("node scripts/generateImages.js", { stdio: "inherit" });
  execSync("node scripts/generateVoice.js", { stdio: "inherit" });
  execSync("node scripts/generateVideo.js", { stdio: "inherit" });
  execSync("node scripts/generateShort.js", { stdio: "inherit" });
  execSync("node scripts/generateMetadata.js", { stdio: "inherit" });
  execSync("node scripts/uploadYoutube.js", { stdio: "inherit" });

  console.log("✅ AUTOMAÇÃO FINALIZADA COM SUCESSO!");

} catch (error) {
  console.error("❌ Erro na automação:", error.message);
}