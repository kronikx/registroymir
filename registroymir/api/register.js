import { setDoc, doc } from "firebase/firestore";
import { db } from "../../firebase"; // ajusta la ruta según tu proyecto

export default async function handler(req, res) {
  try {
    const { username, password } = req.body;
    if(!username || !password){
      return res.status(400).json({ ok:false, error:"Usuario y contraseña requeridos" });
    }

    // Guardar usuario en Firestore
    await setDoc(doc(db,"users",username),{
      username,
      password, // ⚠️ en real deberías encriptar
      rol:"Miembro"
    });

    res.setHeader("Set-Cookie", `userId=${username}; Path=/; SameSite=Lax; Secure; Max-Age=604800`);
    return res.json({ ok:true });
  } catch(err){
    console.error(err);
    return res.status(500).json({ ok:false, error:"Error interno" });
  }
}
