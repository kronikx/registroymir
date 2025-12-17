// /api/discordAuth/index.js

export default async function handler(req, res) {
  // Leer cookies de la petición
  const cookies = req.headers.cookie || "";
  const discordUser = cookies.split("; ").find(c => c.startsWith("discordUser="));

  if (discordUser) {
    // ✅ Ya hay sesión → redirigir directamente al panel
    return res.redirect("/panel.html");
  }

  // 🔄 Si no hay cookie, iniciar flujo OAuth con Discord
  const discordAuthURL = `https://discord.com/oauth2/authorize?client_id=1450641085385674853&redirect_uri=${encodeURIComponent("https://registroymir.vercel.app/api/discordAuth/callback")}&response_type=code&scope=identify%20guilds`;

  return res.redirect(discordAuthURL);
}
