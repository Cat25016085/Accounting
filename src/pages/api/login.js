import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

// 連接 Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  const { username, password } = req.body;

  // 查詢用戶
  const { data: users, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username);

  if (error || users.length === 0) {
    return res.status(401).json({ success: false, message: "用戶不存在" });
  }

  const user = users[0];

  // 驗證密碼
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: "密碼錯誤" });
  }

  return res.status(200).json({ success: true, user: { id: user.id, role: user.role } });
}
