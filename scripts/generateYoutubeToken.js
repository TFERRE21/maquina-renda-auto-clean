import dotenv from "dotenv"
import { google } from "googleapis"
import readline from "readline"

dotenv.config()

const oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  process.env.YOUTUBE_REDIRECT_URI
)

const scopes = [
  "https://www.googleapis.com/auth/youtube.upload"
]

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: scopes,
  prompt: "consent"
})

console.log("\n🔗 Acesse essa URL no navegador:\n")
console.log(authUrl)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.question("\n📌 Cole aqui o código retornado: ", async (code) => {
  try {
    const { tokens } = await oauth2Client.getToken(code)
    console.log("\n🔥 SEU REFRESH TOKEN É:\n")
    console.log(tokens.refresh_token)
  } catch (error) {
    console.error("❌ Erro ao gerar token:", error.message)
  }
  rl.close()
})