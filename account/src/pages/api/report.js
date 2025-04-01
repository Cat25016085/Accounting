import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  const { date, item, purpose, budget, amount } = req.body;

  const { error } = await supabase.from("reports").insert([
    { date, item, purpose, budget, amount, submitted_at: new Date() },
  ]);

  if (error) {
    return res.status(500).json({ success: false, message: "提交失敗" });
  }

  res.status(200).json({ success: true });
}
