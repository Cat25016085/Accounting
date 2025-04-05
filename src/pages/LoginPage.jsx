// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 使用 Supabase 進行用戶登入
    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: username,
        password: password,
      });

      if (loginError) {
        setError('登入失敗: ' + loginError.message);
      } else {
        // 登入成功，導向首頁
        navigate('/');
      }
    } catch (error) {
      setError('登入時發生錯誤: ' + error.message);
    }
  };

  return (
    <div className="login-container">
      <h2>登入</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="username">帳號</label>
          <input
            type="email"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">密碼</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">登入</button>
      </form>
    </div>
  );
};

export default LoginPage;
