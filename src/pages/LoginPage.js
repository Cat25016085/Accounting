// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .eq("password", password) // TODO: 改成 bcrypt hash 驗證
      .single();

    if (error || !data) {
      setErr("登入失敗，請檢查帳號密碼");
    } else if (data.role !== "admin") {
      setErr("非管理員，無權限登入");
    } else {
      // 成功登入
      localStorage.setItem("user", JSON.stringify(data));
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <h2 className="text-3xl mb-4">管理員登入</h2>
      <input
        className="border px-3 py-2 mb-2 w-64"
        placeholder="帳號"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="border px-3 py-2 mb-4 w-64"
        type="password"
        placeholder="密碼"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleLogin}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        登入
      </button>
      {err && <p className="text-red-500 mt-2">{err}</p>}
    </div>
  );
}
