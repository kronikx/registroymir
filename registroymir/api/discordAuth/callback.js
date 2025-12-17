const CLIENT_ID = "1450641085385674853";
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = "https://registroymir.vercel.app/api/discordAuth/callback";
const GUILD_ID = "1223035000967139449";

export default async function handler(req, res) {
  const urlParams = new URLSearchParams(req.url.split("?")[1]);
  const code = urlParams.get("code");

  if (!code) return res.redirect("/index.html");

  try {
    const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
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

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) return res.redirect("/index.html");

    const userRes = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const userData = await userRes.json();

    const guildRes = await fetch("https://discord.com/api/users/@me/guilds", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const guilds = await guildRes.json();

    const isMember = guilds.some(g => g.id === GUILD_ID);
    if (!isMember) return res.redirect("/index.html?auth=ok");

    // ✅ Cookies simplificadas para compatibilidad
    const flags = "Path=/; HttpOnly; SameSite=Lax; Max-Age=604800";
    res.setHeader("Set-Cookie", `discordUser=${userData.id}; ${flags}`);
    res.setHeader("Set-Cookie", `discordRefresh=${tokenData.refresh_token}; ${flags}`);

    // 🔐 Guardar en Firebase como "miembro"
    // const userRef = doc(db, "users", userData.id);
    // const snap = await getDoc(userRef);
    // if (!snap.exists()) {
    //   await setDoc(userRef, { username: userData.username, rol: "miembro" });
    // }

    return res.redirect("/panel.html");
  } catch (err) {
    console.error("Error en callback:", err);
    return res.redirect("/index.html");
  }
}
