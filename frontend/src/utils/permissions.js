import { supabase } from "../supabase";

// 檢查用戶是否有對特定活動的權限
export const hasActivityPermission = async (userId, activityId, permissionType) => {
  try {
    // Step 1: 先確認用戶在活動中的角色
    const { data: memberData, error: memberError } = await supabase
      .from("activity_members")
      .select("role")
      .eq("user_id", userId)
      .eq("activity_id", activityId)
      .single();

    if (memberError || !memberData) {
      return { success: false, message: "用戶未加入此活動或查無資料" };
    }

    // Step 2: 根據用戶的角色檢查權限
    const { role } = memberData;

    // 如果使用者是 ADMIN，可以管理任何活動
    if (role === "admin") {
      return { success: true, message: "擁有管理員權限" };
    }

    // 如果使用者是 Leader，可以管理該活動
    if (role === "leader") {
      if (permissionType === "manage") {
        return { success: true, message: "擁有該活動管理權限" };
      }
    }

    // 如果使用者是 Member，檢查是否可以進行報帳操作
    if (role === "member" && permissionType === "report") {
      return { success: true, message: "擁有該活動報帳權限" };
    }

    // 如果不符合以上條件，則不具有權限
    return { success: false, message: "無權限進入該活動" };
  } catch (error) {
    return { success: false, message: "發生錯誤，請稍後再試" };
  }
};
