import { useState } from "react";

const Report = () => {
  const [data, setData] = useState({
    date: "",
    item: "",
    purpose: "",
    budget: "",
    amount: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/report", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      alert("報帳成功");
    } else {
      alert("提交失敗");
    }
  };

  return (
    <div>
      <h1>報帳</h1>
      <form onSubmit={handleSubmit}>
        <input type="date" onChange={(e) => setData({ ...data, date: e.target.value })} />
        <input type="text" placeholder="品名" onChange={(e) => setData({ ...data, item: e.target.value })} />
        <input type="text" placeholder="用途" onChange={(e) => setData({ ...data, purpose: e.target.value })} />
        <input type="text" placeholder="預算來源" onChange={(e) => setData({ ...data, budget: e.target.value })} />
        <input type="number" placeholder="總金額" onChange={(e) => setData({ ...data, amount: e.target.value })} />
        <button type="submit">提交</button>
      </form>
    </div>
  );
};

export default Report;
