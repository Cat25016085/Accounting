// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ExpenseReportPage from './pages/ExpenseReportPage'; // 引入報帳頁面

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/expense-report" element={<ExpenseReportPage />} />
      </Routes>
    </div>
  );
};

export default App;
