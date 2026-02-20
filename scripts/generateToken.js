import { google } from "googleapis";
import readline from "readline";

const CLIENT_ID = "COLE_AQUI_SEU_CLIENT_ID";
const CLIENT_SECRET = "COLE_AQUI_SEU_CLIENT_SECRET";

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  "http://localhost"
);

const scopes = [
  "https://www.googleapis.com/auth/youtube.upload"
];

const url = oauth2Client.generateAuthUrl({
  access_type: "offline",
  prompt: "consent",
  scope: scopes,
});

console.log("👉 Acesse esta URL no navegador:");
console.log(url);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("\nCole aqui o código retornado: ", async (code) => {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log("\n✅ SEU REFRESH TOKEN:");
    console.log(tokens.refresh_token);
  } catch (err) {
    console.error("Erro ao gerar token:", err);
  }
  rl.close();
});
