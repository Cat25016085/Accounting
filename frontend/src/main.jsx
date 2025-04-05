// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom"; // 引入 BrowserRouter
import "./index.css"; // 如果有其他樣式需要引入

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter> {/* 包裹 App 的地方 */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
