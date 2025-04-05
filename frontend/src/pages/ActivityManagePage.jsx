// src/pages/ActivityManagePage.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { hasActivityPermission } from "../utils/permissions"; // 建議實作這個工具函式

const ActivityManagePage = () => {
  const { activityId } = useParams(); // 取得 URL 中的活動 ID
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [activity, setActivity] = useState(null);
  const [members, setMembers] = useState([]);
  const [error, setError] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);

  // 欄位暫存
  const [editMode, setEditMode] = useState(false);
  const [newInfo, setNewInfo] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser?.user) {
        navigate("/login");
        return;
      }

      setUser(currentUser.user);

      // 確認權限
      const { data: permission, error: permError } = await hasActivityPermission(
        currentUser.user.id,
        activityId,
        ["leader", "admin"]
      );

      if (!permission) {
        setError("你沒有權限管理此活動");
        return;
      }
      setIsAuthorized(true);

      // 取得活動資訊
      const { data: actData, error: actErr } = await supabase
        .from("activities")
        .select("*")
        .eq("id", activityId)
        .single();

      setActivity(actData);
      setNewInfo(actData);

      // 取得成員清單
      const { data: membersData } = await supabase
        .from("activity_members")
        .select("id, role, user_id, users(username, name)")
        .eq("activity_id", activityId);

      setMembers(membersData || []);
    };

    fetchData();
  }, [activityId]);

  const handleSave = async () => {
    const { error } = await supabase
      .from("activities")
      .update(newInfo)
      .eq("id", activityId);

    if (error) setError("更新失敗：" + error.message);
    else setEditMode(false);
  };

  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!isAuthorized) return null;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-800 text-white rounded-xl shadow-lg mt-6">
      <h1 className="text-2xl font-bold mb-4">活動管理：{activity?.name}</h1>

      {editMode ? (
        <div className="space-y-3">
          <input
            className="w-full p-2 bg-gray-700 rounded"
            value={newInfo.name}
            onChange={(e) => setNewInfo({ ...newInfo, name: e.target.value })}
            placeholder="活動名稱"
          />
          <textarea
            className="w-full p-2 bg-gray-700 rounded"
            value={newInfo.info}
            onChange={(e) => setNewInfo({ ...newInfo, info: e.target.value })}
            placeholder="活動資訊"
          />
          <input
            className="w-full p-2 bg-gray-700 rounded"
            value={newInfo.budget_link}
            onChange={(e) =>
              setNewInfo({ ...newInfo, budget_link: e.target.value })
            }
            placeholder="經費表連結"
          />
          <button
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded"
            onClick={handleSave}
          >
            儲存
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <p><strong>活動名稱：</strong> {activity?.name}</p>
          <p><strong>活動資訊：</strong> {activity?.info}</p>
          <p><strong>經費表連結：</strong>{" "}
            <a className="text-blue-300 underline" href={activity?.budget_link} target="_blank" rel="noreferrer">
              {activity?.budget_link || "無"}
            </a>
          </p>
          <button
            className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded"
            onClick={() => setEditMode(true)}
          >
            編輯
          </button>
        </div>
      )}

      <hr className="my-4 border-gray-600" />

      <div>
        <h2 className="text-xl font-semibold mb-2">所屬人員</h2>
        <ul className="space-y-1">
          {members.map((m) => (
            <li key={m.id}>
              {m.users.name} ({m.users.username}) - {m.role}
            </li>
          ))}
        </ul>
        {/* TODO: 新增/移除人員按鈕 */}
      </div>
    </div>
  );
};

export default ActivityManagePage;
