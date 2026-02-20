import { execSync } from "child_process";

function executar(comando) {
  try {
    console.log(`▶ Executando: ${comando}`);
    execSync(comando, { stdio: "inherit" });
  } catch (error) {
    console.error("❌ ERRO NA AUTOMAÇÃO:");
    console.error(error.message);
    process.exit(1);
  }
}

async function main() {
  console.log("🚀 INICIANDO AUTOMAÇÃO COMPLETA");

  console.log("\n🎥 GERANDO VÍDEO LONGO (4-5 MIN)");

  // 🔥 PRIMEIRO GERA ROTEIRO
  executar("node scripts/generateScript.js long");

  // Depois metadata
  executar("node scripts/generateMetadata.js long");

  // Depois imagens
  executar("node scripts/generateImages.js long");

  // Depois áudio
  executar("node scripts/generateAudio.js long");

  // Depois vídeo
  executar("node scripts/generateVideo.js long");

  // Thumbnail
  executar("node scripts/generateThumbnail.js");

  // Upload
  executar("node scripts/uploadYoutube.js");

  console.log("\n✅ AUTOMAÇÃO FINALIZADA COM SUCESSO");
}

main();
