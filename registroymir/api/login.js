import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ ok: false, error: "Método no permitido" });
    }

    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ ok: false, error: "Usuario y contraseña requeridos" });
    }

    const snap = await getDoc(doc(db, "users", username));
    if (!snap.exists()) {
      return res.status(401).json({ ok: false, error: "Usuario no encontrado" });
    }

    const data = snap.data();
    if (data.password !== password) {
      return res.status(401).json({ ok: false, error: "Contraseña incorrecta" });
    }

    res.setHeader("Set-Cookie", `userId=${encodeURIComponent(username)}; Path=/; SameSite=Lax; Secure; Max-Age=604800`);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("[LOGIN] Error:", err);
    return res.status(500).json({ ok: false, error: "Error interno del servidor" });
  }
}
