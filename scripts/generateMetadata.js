import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, "..");
const OUTPUT_DIR = path.join(ROOT, "output");

const type = process.argv[2] || "long";

// ⚠ agora usamos roteiro.txt
const ROTEIRO_PATH = path.join(OUTPUT_DIR, "roteiro.txt");
const METADATA_PATH = path.join(OUTPUT_DIR, `metadata_${type}.json`);

console.log("📄 Gerando metadata...");

if (!fs.existsSync(ROTEIRO_PATH)) {
  console.error("❌ roteiro.txt não encontrado.");
  process.exit(1);
}

const roteiro = fs.readFileSync(ROTEIRO_PATH, "utf8");

const metadata = {
  title: `🔥 ${type.toUpperCase()} - ${new Date().toLocaleDateString()}`,
  description: roteiro.substring(0, 4000),
  tags: ["automação", "renda extra", "youtube", type]
};

fs.writeFileSync(METADATA_PATH, JSON.stringify(metadata, null, 2));

console.log("✅ Metadata criada com sucesso:", METADATA_PATH);
