import 'dotenv/config'
import { execSync } from "child_process"

function runStep(command) {
  console.log(`\n▶ Executando: ${command}`)
  execSync(command, { stdio: "inherit" })
}

async function runAll() {
  try {
    console.log("\n🚀 INICIANDO AUTOMAÇÃO\n")

    // 🔹 Geração de conteúdo
    runStep("node scripts/generateScript.js")
    runStep("node scripts/generateImages.js")
    runStep("node scripts/generateAudio.js")

    // 🔹 Geração de vídeos
    runStep("node scripts/generateVideo.js")
    runStep("node scripts/generateThumbnail.js")

    // 🔹 Upload
    runStep("node scripts/uploadYoutube.js")

    console.log("\n🎉 AUTOMAÇÃO COMPLETA COM SUCESSO!\n")
  } catch (error) {
    console.error("\n❌ ERRO DETECTADO NA AUTOMAÇÃO:")
    console.error(error.message)
    process.exit(1)
  }
}

runAll()