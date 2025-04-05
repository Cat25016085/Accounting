// src/pages/HomePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div>
      <h1>歡迎來到報帳系統</h1>
      <button onClick={handleLoginRedirect}>登入</button>
    </div>
  );
};

export default HomePage;

// const HomePage = () => {
//     return (
//       <div>
//         <h1>這是首頁</h1>
//         <p>如果這段文字顯示，表示 HomePage 渲染正常。</p>
//       </div>
//     );
//   };
  
//   export default HomePage;