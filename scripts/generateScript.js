// scripts/generateScript.js
import fs from "fs";
import path from "path";

const OUTPUT_DIR = path.resolve("output");
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const niche = "Tecnologia";

const script = `
Você sabia que a tecnologia está transformando o mundo de forma acelerada?

Nos últimos anos, a inteligência artificial, a computação em nuvem e a automação mudaram completamente a forma como trabalhamos e nos comunicamos.

Hoje, empresas utilizam algoritmos inteligentes para prever comportamentos, analisar dados e melhorar decisões estratégicas.

Além disso, dispositivos móveis estão mais poderosos do que computadores de décadas atrás.

A internet das coisas conecta casas, carros e até cidades inteiras.

O futuro aponta para mais integração entre humanos e máquinas.

A pergunta é: você está preparado para essa revolução tecnológica?
`;

fs.writeFileSync(path.join(OUTPUT_DIR, "script.txt"), script.trim());

console.log("✅ Script salvo com sucesso!");
