import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

const CreateActivityPage = () => {
  const [activityName, setActivityName] = useState("");
  const [organization, setOrganization] = useState("");
  const [leaderId, setLeaderId] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [budgetUrl, setBudgetUrl] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    // 取得所有使用者資料來讓選擇 Leader 跟 成員
    const fetchUsers = async () => {
      const { data, error } = await supabase.from("users").select("id, name, username, organization");
      if (!error) setMembers(data);
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. 建立活動
    const { data: activity, error: activityError } = await supabase
      .from("activities")
      .insert({
        activity_name: activityName,
        organization,
        leader_id: leaderId,
        deadline,
        description,
        budget_url: budgetUrl,
        submitted_at: new Date(),
      })
      .select()
      .single();

    if (activityError) {
      alert("新增活動失敗：" + activityError.message);
      return;
    }

    // 2. 新增成員（包含 Leader）
    const memberEntries = [
      { activity_id: activity.id, user_id: leaderId, role: "leader" },
      ...selectedMembers
        .filter((id) => id !== leaderId)
        .map((id) => ({ activity_id: activity.id, user_id: id, role: "member" })),
    ];

    await supabase.from("activity_members").insert(memberEntries);

    alert("活動建立成功！");
    navigate("/"); // 或導向活動列表頁
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex justify-center items-start">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-2xl space-y-4"
      >
        <h2 className="text-2xl font-bold mb-4">新增活動</h2>

        <div>
          <label className="block">活動名稱</label>
          <input
            className="w-full p-2 bg-gray-700 rounded"
            value={activityName}
            onChange={(e) => setActivityName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block">所屬組織</label>
          <input
            className="w-full p-2 bg-gray-700 rounded"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block">活動負責人 (Leader)</label>
          <select
            className="w-full p-2 bg-gray-700 rounded"
            value={leaderId}
            onChange={(e) => setLeaderId(e.target.value)}
            required
          >
            <option value="">請選擇</option>
            {members.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.username})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block">活動核銷期限</label>
          <input
            type="date"
            className="w-full p-2 bg-gray-700 rounded"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block">活動說明</label>
          <textarea
            className="w-full p-2 bg-gray-700 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="block">所屬人員（可複選）</label>
          <select
            multiple
            className="w-full p-2 bg-gray-700 rounded h-40"
            value={selectedMembers}
            onChange={(e) =>
              setSelectedMembers([...e.target.selectedOptions].map((o) => o.value))
            }
          >
            {members.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.username})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block">經費表連結</label>
          <input
            className="w-full p-2 bg-gray-700 rounded"
            value={budgetUrl}
            onChange={(e) => setBudgetUrl(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white"
        >
          建立活動
        </button>
      </form>
    </div>
  );
};

export default CreateActivityPage;
