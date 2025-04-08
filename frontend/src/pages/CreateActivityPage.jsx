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

  // 取得所有使用者資料
  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id, name, username, role, group_name");

      if (error) {
        console.error("🚨 抓取使用者失敗:", error.message);
      } else {
        console.log("✅ 抓到使用者：", data);
        setMembers(data);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 自動設定 organization 為 leader 的 group_name
    const leaderInfo = members.find((user) => user.id === leaderId);
    const leaderGroup = leaderInfo?.group_name || "";

    const { data: activity, error: activityError } = await supabase
      .from("activities")
      .insert({
        activity_name: activityName,
        organization: leaderGroup,
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

    const memberEntries = [
      { activity_id: activity.id, user_id: leaderId, role: "leader" },
      ...selectedMembers
        .filter((id) => id !== leaderId)
        .map((id) => ({ activity_id: activity.id, user_id: id, role: "member" })),
    ];

    const { error: insertError } = await supabase
      .from("activity_members")
      .insert(memberEntries);

    if (insertError) {
      alert("新增成員失敗：" + insertError.message);
    } else {
      alert("活動建立成功！");
      navigate("/");
    }
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
          <label className="block">活動負責人 (Leader)</label>
          <select
            className="w-full p-2 bg-gray-700 rounded"
            value={leaderId}
            onChange={(e) => setLeaderId(e.target.value)}
            required
          >
            <option value="">請選擇</option>
            {members
              .filter((user) => user.role === "leader")
              .map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.username} / {user.group_name})
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
                {user.name} ({user.username} / {user.group_name})
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
