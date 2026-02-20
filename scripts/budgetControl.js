const fs = require("fs");
const path = require("path");

const USAGE_FILE = path.join(__dirname, "..", "usage.json");
const MONTH_LIMIT = 4; // LIMITE MENSAL EM DÓLAR

function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function loadUsage() {
  if (!fs.existsSync(USAGE_FILE)) {
    return { month: getCurrentMonth(), totalSpent: 0 };
  }

  const data = JSON.parse(fs.readFileSync(USAGE_FILE, "utf8"));

  // Se mudou o mês → zera automaticamente
  if (data.month !== getCurrentMonth()) {
    return { month: getCurrentMonth(), totalSpent: 0 };
  }

  return data;
}

function saveUsage(data) {
  fs.writeFileSync(USAGE_FILE, JSON.stringify(data, null, 2));
}

function canSpend(estimatedCost) {
  const usage = loadUsage();

  if (usage.totalSpent + estimatedCost > MONTH_LIMIT) {
    console.log("🚫 LIMITE MENSAL ATINGIDO. BOT PAUSADO.");
    return false;
  }

  return true;
}

function addUsage(cost) {
  const usage = loadUsage();
  usage.totalSpent += cost;
  saveUsage(usage);

  console.log(`💰 Total gasto no mês: $${usage.totalSpent.toFixed(2)}`);
}

module.exports = { canSpend, addUsage };