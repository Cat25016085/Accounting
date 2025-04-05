import React, { useState, useEffect } from "react";
import { supabase } from "../supabase";

const ExpenseReportPage = () => {
  const [userData, setUserData] = useState(null);
  const [activityName, setActivityName] = useState("");
  const [groupName, setGroupName] = useState("");
  const [username, setUsername] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [itemName, setItemName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [budgetSource, setBudgetSource] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [invoiceFile, setInvoiceFile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // 假設用戶資料已經存儲在LocalStorage或從API中獲取
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
      setUsername(currentUser.username);
      // 根據用戶名稱查詢活動和組別
      fetchUserData(currentUser.username);
    }
  }, []);

  const fetchUserData = async (username) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("id, username, activity_name, group_name")
        .eq("username", username)
        .single();

      if (error || !data) {
        setError("無法獲取用戶資料");
        return;
      }

      // 填入用戶相關資料
      setUserData(data);
      setActivityName(data.activity_name);
      setGroupName(data.group_name);
    } catch (err) {
      setError("發生錯誤，請稍後再試");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!purchaseDate || !itemName || !purpose || !budgetSource || !totalAmount || !invoiceFile) {
      setError("請填寫所有必填項目");
      return;
    }

    try {
      // 送出報帳資料
      const { data, error } = await supabase
        .from("expense_reports")
        .insert([
          {
            username,
            activity_name: activityName,
            group_name: groupName,
            purchase_date: purchaseDate,
            item_name: itemName,
            purpose,
            budget_source: budgetSource,
            total_amount: totalAmount,
            invoice: invoiceFile, // 假設這是上傳的發票文件
            submission_time: new Date().toISOString(),
          },
        ]);

      if (error) {
        setError("發生錯誤，無法提交報帳資料");
        return;
      }

      alert("報帳資料提交成功！");
    } catch (err) {
      setError("發生錯誤，請稍後再試");
    }
  };

  return (
    <div className="container">
      <h1>報帳資料填寫</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>活動名稱</label>
          <input type="text" value={activityName} disabled />
        </div>
        <div>
          <label>組別</label>
          <input type="text" value={groupName} disabled />
        </div>
        <div>
          <label>姓名</label>
          <input type="text" value={username} disabled />
        </div>
        <div>
          <label>購買日期</label>
          <input
            type="date"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>品名</label>
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>用途</label>
          <input
            type="text"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            required
          />
        </div>
        <div>
          <label>預算來源</label>
          <select
            value={budgetSource}
            onChange={(e) => setBudgetSource(e.target.value)}
            required
          >
            <option value="">選擇預算來源</option>
            <option value="活動預算">活動預算</option>
            <option value="其他">其他</option>
          </select>
        </div>
        <div>
          <label>總金額</label>
          <input
            type="number"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label>上傳發票</label>
          <input
            type="file"
            onChange={(e) => setInvoiceFile(e.target.files[0])}
            required
          />
        </div>
        <button type="submit">提交報帳資料</button>
      </form>
    </div>
  );
};

export default ExpenseReportPage;
