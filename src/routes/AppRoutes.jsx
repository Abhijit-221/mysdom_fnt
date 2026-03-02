import { Routes, Route } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import AuthLayout from "../layouts/AuthLayout";

import LandingPage from "../pages/LandingPage";
import Login from "../pages/Login";
import Signup from "../pages/Register";

import ProtectedRoute from "./ProtectedRoute";
import { Toaster } from "react-hot-toast";
import ManageUsers from "../components/ManageUsers";
import UserProfile from "../components/UserProfile";
import Services from "../components/serviceComponent/Services";
import ServiceDetails from "../components/serviceComponent/ServiceDetails";




const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/manage-users"
          element={
            <ProtectedRoute>
              <ManageUsers />
            </ProtectedRoute>
          }
        />
        <Route path="/users/:id" element={
          <ProtectedRoute>
              <UserProfile/> 
          </ProtectedRoute>
          } />
        <Route path="/services" element={
          <ProtectedRoute>
            <Services />
          </ProtectedRoute>
        } 
        />
        <Route path="/service/:id" element={
          <ProtectedRoute>
            <ServiceDetails />
          </ProtectedRoute>
        } 
        />
      </Route>

      {/* Auth Pages */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>


    </Routes>
  );
};

export default AppRoutes;
