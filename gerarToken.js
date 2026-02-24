import { google } from "googleapis";
import readline from "readline";

const oauth2Client = new google.auth.OAuth2(
  "SEU_CLIENT_ID",
  "SEU_CLIENT_SECRET",
  "SEU_REDIRECT_URI"
);

const scopes = ["https://www.googleapis.com/auth/youtube.upload"];

const url = oauth2Client.generateAuthUrl({
  access_type: "offline",
  prompt: "consent",
  scope: scopes,
});

console.log("Acesse essa URL no navegador:");
console.log(url);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Cole o código aqui: ", async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  console.log("🔥 SEU NOVO REFRESH TOKEN:");
  console.log(tokens.refresh_token);
  rl.close();
});
