import axios from "axios";
import fs from "fs";

const niches = [
  "Inteligência Artificial",
  "Renda Extra Online",
  "Criptomoedas",
  "Curiosidades Científicas",
  "Tecnologia do Futuro",
  "Mistérios do Mundo",
  "Saúde e Longevidade",
  "Finanças Pessoais"
];

// 🔥 Simulação de tendência (pode evoluir depois)
async function getTrendingScore(niche) {
  // Aqui podemos integrar API real depois
  return Math.floor(Math.random() * 100);
}

// 🔥 Analisa histórico de visualizações
function getHistoricalScore(niche) {
  if (!fs.existsSync("output/metrics.json")) return 0;

  const data = JSON.parse(fs.readFileSync("output/metrics.json"));

  const found = data.find(n => n.name === niche);
  return found ? found.views : 0;
}

export async function chooseBestNiche() {
  console.log("🔎 Analisando tendências...");

  let bestNiche = null;
  let bestScore = 0;

  for (const niche of niches) {
    const trendScore = await getTrendingScore(niche);
    const historyScore = getHistoricalScore(niche);

    const finalScore = trendScore + historyScore;

    console.log(`📊 ${niche} → Trend: ${trendScore} | Histórico: ${historyScore}`);

    if (finalScore > bestScore) {
      bestScore = finalScore;
      bestNiche = niche;
    }
  }

  console.log("🔥 Nicho escolhido:", bestNiche);

  fs.writeFileSync("output/currentNiche.txt", bestNiche);

  return bestNiche;
}