import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const OUTPUT_DIR = path.join(ROOT, "output");

function runCommand(command) {
  try {
    console.log(`\n▶ Executando: ${command}`);
    execSync(command, { stdio: "inherit" });
  } catch (error) {
    console.error("\n❌ ERRO NA AUTOMAÇÃO");
    console.error(`Comando que falhou: ${command}`);
    process.exit(1);
  }
}

function resetOutputFolder() {
  if (fs.existsSync(OUTPUT_DIR)) {
    fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log("📁 Pasta output resetada.");
}

async function run() {
  console.log("🚀 INICIANDO AUTOMAÇÃO COMPLETA");
  console.log("====================================");

  // ============================
  // 🎥 VÍDEO LONGO
  // ============================
  console.log("\n🎥 GERANDO VÍDEO LONGO (4-5 MIN)");

  resetOutputFolder();

  runCommand("node scripts/generateScript.js long");
  runCommand("node scripts/generateMetadata.js long");
  runCommand("node scripts/generateImages.js long");
  runCommand("node scripts/generateAudio.js long");
  runCommand("node scripts/generateVideo.js long");
  runCommand("node scripts/generateThumbnail.js");
  runCommand("node scripts/uploadYoutube.js long");

  console.log("\n✅ VÍDEO LONGO FINALIZADO");

  // ============================
  // 📱 SHORT
  // ============================
  console.log("\n📱 GERANDO SHORT (ATÉ 2 MIN)");

  resetOutputFolder();

  runCommand("node scripts/generateScript.js short");
  runCommand("node scripts/generateMetadata.js short");
  runCommand("node scripts/generateImages.js short");
  runCommand("node scripts/generateAudio.js short");
  runCommand("node scripts/generateVideo.js short");
  runCommand("node scripts/uploadYoutube.js short");

  console.log("\n✅ SHORT FINALIZADO");

  console.log("\n🎉 AUTOMAÇÃO COMPLETA COM SUCESSO!");
  console.log("====================================");
}

run();
