import React, { useState, useEffect } from "react";
import { supabase } from "../supabase"; // 引入 supabase 客戶端
import { useNavigate } from "react-router-dom";

const ExpenseReportPage = () => {
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null); // 存儲當前用戶資料
  const [activityName, setActivityName] = useState(""); // 活動名稱
  const [group, setGroup] = useState(""); // 用戶所屬組別
  const [name, setName] = useState(""); // 用戶姓名
  const [purchaseDate, setPurchaseDate] = useState(""); // 購買日期
  const [itemName, setItemName] = useState(""); // 品名
  const [purpose, setPurpose] = useState(""); // 用途
  const [budgetSource, setBudgetSource] = useState(""); // 預算來源
  const [totalAmount, setTotalAmount] = useState(""); // 總金額
  const [invoiceFile, setInvoiceFile] = useState(null); // 上傳發票圖片
  
  // 自動帶入資料
  useEffect(() => {
    const fetchUserData = async () => {
      const session = supabase.auth.session();
      if (session) {
        // 確認是否已經登入
        const { data: userData, error } = await supabase
          .from("users")
          .select("id, name, username, role, group_name")
          .eq("username", session.user.id)
          .single();
          
        if (error) {
          console.error("無法獲取用戶資料:", error);
        } else {
          setUser(userData);
          setActivityName("活動名稱自動填入"); // 這是範例，需從活動資料表中選擇活動名稱
          setGroup(userData.group_name); // 假設資料表中有對應欄位
          setName(userData.name); // 用戶的姓名
        }
      } else {
        navigate("/login"); // 若用戶未登入，則引導至登入頁
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 自動記錄提交時間
    const submissionTime = new Date().toISOString();

    // 上傳發票
    let invoiceUrl = "";
    if (invoiceFile) {
      const { data, error } = await supabase.storage
        .from("invoices") // 確保有創建一個名為 'invoices' 的儲存桶
        .upload(`invoices/${invoiceFile.name}`, invoiceFile);

      if (error) {
        console.error("上傳發票圖片錯誤:", error);
      } else {
        invoiceUrl = data.path; // 獲取上傳後的文件 URL
      }
    }

    // 儲存報帳資料
    const { error } = await supabase
      .from("expense_reports")
      .insert([
        {
          user_id: user.id, // 用戶ID
          activity_name: activityName,
          group_name: group,
          name: name,
          purchase_date: purchaseDate,
          item_name: itemName,
          purpose: purpose,
          budget_source: budgetSource,
          total_amount: totalAmount,
          invoice_url: invoiceUrl,
          submission_time: submissionTime, // 記錄提交時間
        },
      ]);

    if (error) {
      console.error("提交報帳資料錯誤:", error);
    } else {
      alert("報帳資料提交成功!");
    }
  };

  return (
    <div className="expense-report-page">
      <h1>報帳資料填寫</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>活動名稱</label>
          <input type="text" value={activityName} readOnly />
        </div>
        <div>
          <label>組別</label>
          <input type="text" value={group} readOnly />
        </div>
        <div>
          <label>姓名</label>
          <input type="text" value={name} readOnly />
        </div>
        <div>
          <label>購買日期</label>
          <input
            type="date"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
          />
        </div>
        <div>
          <label>品名</label>
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
        </div>
        <div>
          <label>用途</label>
          <input
            type="text"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
          />
        </div>
        <div>
          <label>預算來源</label>
          <select
            value={budgetSource}
            onChange={(e) => setBudgetSource(e.target.value)}
          >
            <option value="預算A">預算A</option>
            <option value="預算B">預算B</option>
          </select>
        </div>
        <div>
          <label>總金額</label>
          <input
            type="number"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
          />
        </div>
        <div>
          <label>上傳發票</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setInvoiceFile(e.target.files[0])}
          />
        </div>
        <button type="submit">提交報帳</button>
      </form>
    </div>
  );
};

export default ExpenseReportPage;
