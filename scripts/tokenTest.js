import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
  refresh_token: process.env.YOUTUBE_REFRESH_TOKEN,
});

try {
  const { token } = await oauth2Client.getAccessToken();
  console.log("TOKEN GERADO COM SUCESSO:", token ? "SIM" : "NÃO");
} catch (err) {
  console.error("ERRO AO GERAR ACCESS TOKEN:");
  console.error(err.response?.data || err.message);
}
