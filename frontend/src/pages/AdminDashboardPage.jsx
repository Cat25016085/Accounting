
import React, { useEffect, useState } from "react";
import { supabase } from "../supabase"; // 引入 Supabase 客戶端
import { useNavigate } from "react-router-dom";

const AdminDashboardPage = () => {
    const navigate = useNavigate();
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchActivities = async () => {
        const { data, error } = await supabase
          .from('activities')
          .select('*')
          .order('created_at', { ascending: false });
  
        if (error) {
          console.error('活動讀取錯誤:', error);
        } else {
          setActivities(data);
        }
  
        setLoading(false);
      };
  
      fetchActivities();
    }, []);
  
    const handleCreateActivity = () => {
      navigate('/create-activity');
    };
  
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">管理員後台</h1>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleCreateActivity}
          >
            ➕ 新增活動
          </button>
        </div>
  
        {loading ? (
          <p>載入中...</p>
        ) : activities.length === 0 ? (
          <p className="text-gray-600">目前無任何活動。</p>
        ) : (
          <ul className="space-y-2">
            {activities.map((activity) => (
              <li key={activity.id} className="border p-4 rounded shadow-sm">
                <h2 className="text-lg font-semibold">{activity.activity_name}</h2>
                <p className="text-sm text-gray-600">{activity.organization}</p>
                <p className="text-sm text-gray-500">截止日：{activity.deadline}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };
  
  export default AdminDashboardPage;