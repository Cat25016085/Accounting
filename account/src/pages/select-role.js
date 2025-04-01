import { useRouter } from "next/router";
import { useState } from "react";

const SelectRole = () => {
  const router = useRouter();
  const [role, setRole] = useState("");

  const handleNext = () => {
    if (!role) return alert("請選擇身分");
    router.push(`/report?role=${role}`);
  };

  return (
    <div>
      <h1>選擇身分</h1>
      <button onClick={() => setRole("member")}>一般帳號</button>
      <button onClick={() => setRole("event")}>活動特有核銷帳號</button>
      <button onClick={handleNext} disabled={!role}>下一步</button>
    </div>
  );
};

export default SelectRole;
