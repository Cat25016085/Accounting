// ActivitySelectionPage.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

const ActivitySelectionPage = () => {
  const [activities, setActivities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActivities = async () => {
      // 檢查用戶是否登入
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // 用戶未登入，重定向到登入頁面
        navigate("/login");
        return;  // 停止執行後面的程式碼
      }

      // 查詢活動與權限
      const { data, error } = await supabase
        .from("activity_members")
        .select("activity_id, role, activities (name)")
        .eq("user_id", user.id);

      if (!error && data) {
        setActivities(data);
      }
    };

    fetchActivities();
  }, [navigate]);

  const handleEnter = (activityId) => {
    navigate(`/expense/${activityId}`);
  };

  const handleManage = (activityId, role) => {
    if (role === "leader") {
      navigate(`/activity-manage/${activityId}`);
    } else {
      alert("你沒有權限管理此活動");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl mb-4 font-bold">可進入的活動列表</h1>
      <div className="space-y-4">
        {activities.map((item) => (
          <div key={item.activity_id} className="bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-center">
            <div>
              <p className="text-lg">{item.activities.name}</p>
              <p className="text-sm text-gray-400">角色：{item.role}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEnter(item.activity_id)}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
              >
                進入報帳
              </button>
              {item.role === "leader" && (
                <button
                  onClick={() => handleManage(item.activity_id, item.role)}
                  className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded"
                >
                  活動管理
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivitySelectionPage;
