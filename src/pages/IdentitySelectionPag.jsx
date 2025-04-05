// src/pages/IdentitySelectionPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const IdentitySelectionPage = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    // 根據身份選擇跳轉至報帳資料頁面
    navigate("/expense-report");
  };

  return (
    <div className="identity-selection">
      <h2>選擇身分</h2>
      <button onClick={() => handleRoleSelect("活動專用核銷帳號")}>
        活動專用核銷帳號
      </button>
      <button onClick={() => handleRoleSelect("一般帳號")}>一般帳號</button>
    </div>
  );
};

export default IdentitySelectionPage;
