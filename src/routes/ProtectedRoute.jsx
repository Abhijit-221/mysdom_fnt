import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  getActiveUser,
  hasRoleAccess,
  isBasicUserRole,
} from "../utils/roleAccess";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user } = useContext(AuthContext);
  const checkUser = getActiveUser(user);

  if (!checkUser) {
    return <Navigate to="/login" replace />;
  }

  if (!hasRoleAccess(checkUser.role, allowedRoles)) {
    const fallbackPath = isBasicUserRole(checkUser.role) ? "/bgv/list" : "/";
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
