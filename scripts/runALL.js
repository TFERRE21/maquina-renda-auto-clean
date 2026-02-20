import { execSync } from "child_process";

console.log("🚀 MODO SHORTS ONLY ATIVADO");

try {
  execSync("node scripts/generateScript.js short", { stdio: "inherit" });
  execSync("node scripts/generateImages.js short", { stdio: "inherit" });
  execSync("node scripts/generateAudio.js short", { stdio: "inherit" });
  execSync("node scripts/generateVideo.js short", { stdio: "inherit" });

  console.log("🎉 SHORT GERADO COM SUCESSO!");
} catch (err) {
  console.error("❌ ERRO NA AUTOMAÇÃO");
  process.exit(1);
}
