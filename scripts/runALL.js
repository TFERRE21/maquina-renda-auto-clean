import { execSync } from "child_process";

function run(command) {
  console.log(`\n▶ Executando: ${command}`);
  execSync(command, { stdio: "inherit" });
}

async function runAll() {
  try {
    console.log("🚀 INICIANDO AUTOMAÇÃO COMPLETA\n");

    // =========================
    // 🎬 VÍDEO LONGO
    // =========================
    console.log("\n🎥 GERANDO VÍDEO LONGO (4-5 MIN)");

    run("node scripts/generateScript.js long");
    run("node scripts/generateMetadata.js long");
    run("node scripts/generateImages.js long");
    run("node scripts/generateAudio.js long");
    run("node scripts/generateVideo.js long");
    run("node scripts/uploadYoutube.js long");

    // =========================
    // 📱 SHORT
    // =========================
    console.log("\n📱 GERANDO SHORT (2 MIN)");

    run("node scripts/generateScript.js short");
    run("node scripts/generateMetadata.js short");
    run("node scripts/generateImages.js short");
    run("node scripts/generateAudio.js short");
    run("node scripts/generateVideo.js short");
    run("node scripts/uploadYoutube.js short");

    console.log("\n🎉 AUTOMAÇÃO FINALIZADA COM SUCESSO!");
  } catch (error) {
    console.error("\n❌ ERRO NA AUTOMAÇÃO:");
    console.error(error.message);
    process.exit(1);
  }
}

runAll();