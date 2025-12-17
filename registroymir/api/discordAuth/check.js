export default async function handler(req, res) {
  const cookies = req.headers.cookie || "";
  const userId = cookies
    .split("; ")
    .find(c => c.startsWith("discordUser="))
    ?.split("=")[1];

  if (userId) {
    return res.status(200).json({ ok: true, userId });
  } else {
    return res.status(200).json({ ok: false });
  }
}
