import { execSync } from "child_process";

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

async function run() {
  console.log("🚀 INICIANDO AUTOMAÇÃO COMPLETA");
  console.log("====================================");

  // 🎥 LONG
  console.log("\n🎥 GERANDO VÍDEO LONGO");

  runCommand("node scripts/generateScript.js long");
  runCommand("node scripts/generateMetadata.js long");
  runCommand("node scripts/generateImages.js long");
  runCommand("node scripts/generateAudio.js long");
  runCommand("node scripts/generateVideo.js long");
  runCommand("node scripts/generateThumbnail.js");
  runCommand("node scripts/uploadYoutube.js long");

  console.log("\n✅ LONG FINALIZADO");

  // 📱 SHORT
  console.log("\n📱 GERANDO SHORT");

  runCommand("node scripts/generateScript.js short");
  runCommand("node scripts/generateMetadata.js short");
  runCommand("node scripts/generateImages.js short");
  runCommand("node scripts/generateAudio.js short");
  runCommand("node scripts/generateVideo.js short");
  runCommand("node scripts/uploadYoutube.js short");

  console.log("\n🎉 AUTOMAÇÃO COMPLETA COM SUCESSO!");
}

run();
