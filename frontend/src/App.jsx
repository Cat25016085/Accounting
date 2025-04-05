// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ExpenseReportPage from './pages/ExpenseReportPage'; // 引入報帳頁面
import CreateActivityPage from './pages/CreateActivityPage'; // 引入創建活動頁面
import ActivitySelectionPage from './pages/ActivitySelectionPage'; // 引入活動選擇頁面
// import AdminDashboardPage from './pages/AdminDashboardPage'; // 引入管理員頁面


const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/expense-report" element={<ExpenseReportPage />} />
        <Route path="/create-activity" element={<CreateActivityPage />} />
        <Route path="/activity-selection" element={<ActivitySelectionPage />} />
        {/* <Route path="/admin-dashboard" element={<AdminDashboardPage />} /> */}
        {/* 其他路由 */}
      </Routes>
    </div>
  );
};

export default App;
