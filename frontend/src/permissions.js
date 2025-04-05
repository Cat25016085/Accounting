// src/utils/permissions.js

export const hasPermission = (userRole, requiredRoles = []) => {
    return requiredRoles.includes(userRole);
  };
  
  export const canManageActivity = (activityMembers, userId) => {
    const member = activityMembers.find((m) => m.user_id === userId);
    return member?.role === "leader" || member?.role === "admin";
  };
  