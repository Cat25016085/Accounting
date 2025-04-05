import React, { useState } from "react";
import { supabase } from "../supabase"; // 確保路徑正確

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    // 確認帳號和密碼欄位都不為空
    if (!username || !password) {
      setError("請填寫帳號和密碼");
      return;
    }

    try {
      // 使用 Supabase 查詢用戶名和密碼匹配
      const { data, error: fetchError } = await supabase
        .from("users")
        .select("id, username, password, role")
        .eq("username", username)
        .single();

      if (fetchError || !data) {
        setError("帳號不存在");
        return;
      }

      // 檢查密碼是否匹配
      if (data.password === password) {
        // 登入成功，處理登入邏輯
        alert("登入成功!");
        // 在這裡可以設置使用者狀態、轉導頁面等
      } else {
        setError("密碼錯誤");
      }
    } catch (err) {
      setError("發生錯誤，請稍後再試");
    }
  };

  return (
    <div>
      <h1>登入頁面</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>帳號：</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>密碼：</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">登入</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

export default LoginPage;
