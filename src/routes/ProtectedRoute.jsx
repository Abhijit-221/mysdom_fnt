import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const checkUser = user?user:JSON.parse(localStorage.getItem('user'));

  console.log('user context:',user);
  console.log('localstorage user:',checkUser);

  if (!checkUser) {
    
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;