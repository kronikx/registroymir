const CLIENT_ID = "1450641085385674853";
const REDIRECT_URI = "https://registroymir.vercel.app/api/discordAuth/callback";

export default function handler(req, res) {
  const authUrl = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&response_type=code&scope=identify%20guilds`;
  return res.redirect(authUrl);
}
