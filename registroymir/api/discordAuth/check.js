export default function handler(req, res) {
  const cookie = req.headers.cookie || "";
  const userId = cookie.split("discordUser=")[1];
  if (userId) {
    return res.json({ ok: true, userId });
  } else {
    return res.json({ ok: false });
  }
}
