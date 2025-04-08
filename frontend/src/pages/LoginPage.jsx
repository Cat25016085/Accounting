// Accounting/frontend/src/pages/LoginPage.jsx
import React, { useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("請填寫帳號和密碼");
      return;
    }

    try {
      const { data, error: fetchError } = await supabase
        .from("users")
        .select("id, username, password, name, role") // name 用來顯示用戶名稱
        .eq("username", username)
        .single();

      if (fetchError || !data) {
        setError("帳號不存在");
        return;
      }

      if (data.password === password) {
        // ✅ 儲存登入狀態與 user 資訊
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userId", data.id); // 🔑 儲存 userId 給其他頁面使用
        localStorage.setItem("username", data.username);
        localStorage.setItem("name", data.name);
        localStorage.setItem("role", data.role);

        alert("登入成功!");

        if (data.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/activity-selection");
        }
      } else {
        setError("密碼錯誤");
      }
    } catch (error) {
      console.error("登入失敗:", error);
      setError("登入失敗，請稍後再試");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded shadow-md w-96">
        <h1 className="text-xl font-bold mb-4">登入頁面</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-1">帳號：</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            />
          </div>
          <div>
            <label className="block mb-1">密碼：</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded"
          >
            登入
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
