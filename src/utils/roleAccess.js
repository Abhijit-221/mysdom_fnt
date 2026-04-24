export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    return null;
  }
};

export const getActiveUser = (contextUser) => contextUser || getStoredUser();

export const normalizeRole = (role) => role?.toLowerCase()?.trim() || "";

export const isAdminRole = (role) =>
  ["admin", "superadmin"].includes(normalizeRole(role));

export const isBasicUserRole = (role) => normalizeRole(role) === "user";

export const hasRoleAccess = (role, allowedRoles = []) => {
  if (!allowedRoles.length) {
    return true;
  }

  return allowedRoles.map(normalizeRole).includes(normalizeRole(role));
};
