import fs from "fs";

const roteiro = fs.readFileSync("output/roteiro.txt", "utf-8");
const frases = roteiro.split(".");

let tempo = 0;
let legenda = "";

frases.forEach((frase, index) => {
  const inicio = tempo;
  tempo += 5;

  legenda += `${index + 1}
00:00:${String(inicio).padStart(2, "0")},000 --> 00:00:${String(tempo).padStart(2, "0")},000
${frase.trim()}

`;
});

fs.writeFileSync("output/legenda.srt", legenda);

console.log("Legenda criada!");