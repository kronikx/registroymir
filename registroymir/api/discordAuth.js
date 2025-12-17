// api/discordAuth.js

import fetch from "node-fetch";

const CLIENT_ID = "1450641085385674853";       // Tu Client ID
const CLIENT_SECRET = process.env.CLIENT_SECRET; // Ponlo en Vercel → Settings → Environment Variables
const REDIRECT_URI = "https://registroymir.vercel.app/api/discordAuth/callback";
const GUILD_ID = "1223035000967139449";       // Tu Guild ID

export default async function handler(req, res) {
  const { url } = req;

  // Ruta base: /api/discordAuth → redirige al login de Discord
  if (url.endsWith("/api/discordAuth")) {
    const authUrl = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&response_type=code&scope=identify%20guilds`;
    return res.redirect(authUrl);
  }

  // Ruta callback: /api/discordAuth/callback → recibe el code de Discord
  if (url.endsWith("/api/discordAuth/callback")) {
    const code = req.query.code;
    if (!code) {
      return res.status(400).json({ error: "Falta el parámetro 'code'" });
    }

    try {
      // Intercambiar el code por un token
      const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          grant_type: "authorization_code",
          code,
          redirect_uri: REDIRECT_URI,
          scope: "identify guilds",
        }),
      });

      const tokenData = await tokenResponse.json();
      if (!tokenData.access_token) {
        return res.status(400).json({ error: "No se pudo obtener el token", detalle: tokenData });
      }

      // Obtener datos del usuario
      const userResponse = await fetch("https://discord.com/api/users/@me", {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });
      const userData = await userResponse.json();

      // Verificar si está en tu servidor
      const guildResponse = await fetch(`https://discord.com/api/users/@me/guilds`, {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });
      const guilds = await guildResponse.json();

      const isMember = guilds.some((g) => g.id === GUILD_ID);

      if (isMember) {
        // Guardar sesión con cookie (simplificado)
        res.setHeader("Set-Cookie", `discordUser=${userData.id}; Path=/; HttpOnly`);
        return res.redirect("/panel.html");
      } else {
        return res.status(403).send("Acceso denegado: no eres miembro del servidor.");
      }
    } catch (err) {
      return res.status(500).json({ error: "Error en el login", detalle: err.message });
    }
  }

  // Ruta check: /api/discordAuth/check → verificar sesión
  if (url.endsWith("/api/discordAuth/check")) {
    const cookie = req.headers.cookie || "";
    const userId = cookie.split("discordUser=")[1];
    if (userId) {
      return res.json({ ok: true, userId });
    } else {
      return res.json({ ok: false });
    }
  }

  // Si no coincide ninguna ruta
  return res.status(404).json({ error: "Ruta no encontrada" });
}
