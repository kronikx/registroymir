import { getDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";

export default async function handler(req,res){
  const cookie = req.headers.cookie || "";
  const match = cookie.match(/userId=([^;]+)/);
  if(!match) return res.status(401).json({ ok:false });

  const userId = match[1];
  const snap = await getDoc(doc(db,"users",userId));
  if(!snap.exists()) return res.status(401).json({ ok:false });

  const data = snap.data();
  return res.json({ ok:true, rol:data.rol, userId });
}
