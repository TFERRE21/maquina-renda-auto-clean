import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const OUTPUT_DIR = path.join(ROOT, "output");

function limparOutput() {
  console.log("🧹 Limpando pasta output...");

  if (fs.existsSync(OUTPUT_DIR)) {
    fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
  }

  fs.mkdirSync(OUTPUT_DIR);
  console.log("✅ Pasta output limpa.");
}

function runCommand(command) {
  try {
    console.log(`▶ Executando: ${command}`);
    execSync(command, { stdio: "inherit" });
  } catch (error) {
    console.error("❌ ERRO NA AUTOMAÇÃO");
    console.error(`Comando que falhou: ${command}`);
    process.exit(1);
  }
}

async function run() {
  try {
    console.log("🚀 INICIANDO AUTOMAÇÃO COMPLETA");
    console.log("====================================");

    // ==============================
    // 🎥 VÍDEO LONGO
    // ==============================
    console.log("\n🎥 GERANDO VÍDEO LONGO");

    limparOutput();

    runCommand("node scripts/generateScript.js long");
    runCommand("node scripts/generateMetadata.js long");
    runCommand("node scripts/generateImages.js long");
    runCommand("node scripts/generateAudio.js long");
    runCommand("node scripts/generateVideo.js long");
    runCommand("node scripts/generateThumbnail.js long");
    runCommand("node scripts/uploadYoutube.js long");

    console.log("✅ VÍDEO LONGO FINALIZADO");

    // ==============================
    // 📱 SHORT
    // ==============================
    console.log("\n📱 GERANDO SHORT");

    limparOutput();

    runCommand("node scripts/generateScript.js short");
    runCommand("node scripts/generateMetadata.js short");
    runCommand("node scripts/generateImages.js short");
    runCommand("node scripts/generateAudio.js short");
    runCommand("node scripts/generateVideo.js short");
    runCommand("node scripts/generateThumbnail.js short");
    runCommand("node scripts/uploadYoutube.js short");

    console.log("✅ SHORT FINALIZADO");

    console.log("\n🎉 AUTOMAÇÃO COMPLETA COM SUCESSO!");
    console.log("====================================");

  } catch (error) {
    console.error("❌ ERRO GERAL:", error.message);
    process.exit(1);
  }
}

run();
