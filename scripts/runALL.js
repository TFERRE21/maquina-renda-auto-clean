import { execSync } from "child_process";

function runCommand(command) {
  try {
    console.log(`▶ Executando: ${command}`);
    execSync(command, { stdio: "inherit" });
  } catch (error) {
    console.error("❌ ERRO NA AUTOMAÇÃO:");
    console.error(`Comando falhou: ${command}`);
    process.exit(1);
  }
}

async function run() {
  try {
    console.log("🚀 INICIANDO AUTOMAÇÃO COMPLETA");
    console.log("====================================");

    // ============================
    // 🎥 VÍDEO LONGO (4-5 MIN)
    // ============================
    console.log("\n🎥 GERANDO VÍDEO LONGO (4-5 MIN)");

    runCommand("node scripts/generateScript.js long");
    runCommand("node scripts/generateMetadata.js long");
    runCommand("node scripts/generateImages.js long");
    runCommand("node scripts/generateAudio.js long");
    runCommand("node scripts/generateVideo.js long");
    runCommand("node scripts/generateThumbnail.js long");
    runCommand("node scripts/uploadYoutube.js long");

    console.log("✅ VÍDEO LONGO FINALIZADO\n");

    // ============================
    // 📱 SHORT (ATÉ 2 MIN)
    // ============================
    console.log("📱 GERANDO SHORT (ATÉ 2 MIN)");

    runCommand("node scripts/generateScript.js short");
    runCommand("node scripts/generateMetadata.js short");
    runCommand("node scripts/generateImages.js short");
    runCommand("node scripts/generateAudio.js short");
    runCommand("node scripts/generateVideo.js short");
    runCommand("node scripts/uploadYoutube.js short");

    console.log("✅ SHORT FINALIZADO\n");

    console.log("🎉 AUTOMAÇÃO COMPLETA COM SUCESSO!");
    console.log("====================================");

  } catch (error) {
    console.error("❌ ERRO GERAL NA AUTOMAÇÃO:", error.message);
    process.exit(1);
  }
}

run();
