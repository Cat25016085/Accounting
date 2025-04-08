// ActivitySelectionPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase"; // 你還是可以使用 Supabase 獲取資料

const ActivitySelectionPage = () => {
  const [activities, setActivities] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 用來管理登入狀態
  const navigate = useNavigate();

  useEffect(() => {
    // 檢查是否登入過
    const isUserLoggedIn = localStorage.getItem("isLoggedIn"); // 用 localStorage 管理登入狀態
    if (isUserLoggedIn) {
      setIsLoggedIn(true);
      fetchActivities(); // 如果已經登入，就拉取活動資料
    } else {
      setIsLoggedIn(false); // 如果未登入，顯示登入頁面
    }
  }, []);

  const fetchActivities = async () => {
    const userId = localStorage.getItem("userId");
  
    if (!userId) {
      console.error("找不到使用者 ID，請重新登入");
      setIsLoggedIn(false);
      return;
    }
  
    const { data, error } = await supabase
      .from("activity_members")
      .select("activity_id, role, activities (name)")
      .eq("user_id", userId);
  
    if (error) {
      console.error("活動資料獲取失敗:", error);
    } else {
      setActivities(data);
    }
  };
  
  

  const handleLogin = () => {
    // 這裡可以設計你自己的登入邏輯
    localStorage.setItem("isLoggedIn", "true"); // 記錄登入狀態
    setIsLoggedIn(true);
    fetchActivities(); // 登入後拉取活動資料
  };


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

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <h1 className="text-2xl mb-4 font-bold">登入</h1>
        <button
          onClick={handleLogin}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          登入
        </button>
      </div>
    );
  }

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
