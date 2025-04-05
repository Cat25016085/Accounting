import React, { useState } from "react";
import { supabase } from "../supabase"; // 確保路徑正確
import { useNavigate } from "react-router-dom"; // 用來跳轉頁面

const LoginPage = () => {
  const navigate = useNavigate();
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
      // 使用 Supabase 查詢用戶名
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
        // 登入成功，設置使用者狀態、跳轉頁面
        alert("登入成功!");
        // 假設登入後要跳轉到報帳頁面
        if (data.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/activity-selection");
        } // 根據角色跳轉到不同頁面
      } else {
        setError("密碼錯誤");
      }
    } catch (error) {
      console.error("登入失敗:", error);
      setError("登入失敗，請稍後再試");
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
