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
import ClientList from "../components/client/ClientList";
import AddClient from "../components/client/AddClient";
import ServiceAdd from "../components/serviceComponent/ServiceAdd";
import BgvRequestList from "../components/BGVRequest/BGVRequestList";
import BgvRequestForm from "../components/BGVRequest/BVGRequestForm";
import AddClientService from "../components/client/AddClientService";
import BGVViewForm from "../components/BGVRequest/BGVViewForm";
import BGVStatusUpdate from "../components/BGVRequest/BGVStatusUpdate";
import UploadCandidate from "../components/UploadCandidate";
import About from "../components/About";
import ContactUs from "../components/ContactUs";
import Product from "../components/Product/Product";
import AddProduct from "../components/Product/AddProduct";
import ViewOrEditProduct from "../components/Product/ViewOrEditProduct";
import ServiceDetailPage from "../components/serviceComponent/ServiceDetailPage";
import UpdateService from "../components/serviceComponent/UpdateService";
import CreateService from "../components/serviceComponent/CreateService";
import ForgotPassword from "../pages/ForgotPassword";
import BGVReportPage from "../components/BGVRequest/BGVReport";
import BGVEmailSubmitForm from "../components/BGVRequest/BGVEmailSubmitForm";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/product" element={<Product />} />
        <Route
          path="/product/add"
          element={
            <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
              <AddProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/product/view/:id"
          element={
            <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
              <ViewOrEditProduct />
            </ProtectedRoute>
          }
        />
        <Route path="/service/detail/:id" element={<ServiceDetailPage />} />


        <Route
          path="/manage-users"
          element={
            <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
              <ManageUsers />
            </ProtectedRoute>
          }
        />
        <Route path="/users/:id" element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        } />
        <Route path="/services" element={
          // <ProtectedRoute>
            <Services />
          // </ProtectedRoute>
        }
        />
        <Route path="/service/add" element={
          <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
            {/* <ServiceAdd /> */}
            <CreateService />
          </ProtectedRoute>
        }
        />
        <Route path="/service/update/:id" element={
          <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
            <UpdateService />
          </ProtectedRoute>
        }
        />
        <Route path="/service/getby/:id" element={
          <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
            <ServiceDetails />
          </ProtectedRoute>
        }
        />
        <Route path="/clients" element={
          <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
            <ClientList />
          </ProtectedRoute>
        }
        />
        <Route path="/client/add" element={
          <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
            <AddClient />
          </ProtectedRoute>
        }
        />
        {/* client service */}
        <Route path="/client/service-add/:client_id" element={
          <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
            <AddClientService />
          </ProtectedRoute>
        }
        />
        {/* bgv routes */}
        <Route path="/bgv/list" element={
          <ProtectedRoute>
            <BgvRequestList />
          </ProtectedRoute>
        }
        />
        <Route path="/bgv/add" element={
          <ProtectedRoute>
            <BgvRequestForm />
          </ProtectedRoute>
        }
        />
        {/* <Route path="" element={<BGVViewEditRequestForm />} /> */}
        <Route path="/bgv-view" element={
          <ProtectedRoute>
            <BGVViewForm />
          </ProtectedRoute>
        }/>
        <Route path="/bgv-update/:req_id" element={
          <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
            <BGVStatusUpdate />
          </ProtectedRoute>
        }/>
        <Route path="/batch/upload" element={
          <ProtectedRoute>
            <UploadCandidate />
          </ProtectedRoute>
        }
        />
        <Route path="/bgv-report" element={
          <ProtectedRoute>
            <BGVReportPage />
          </ProtectedRoute>
        }
        />
      </Route>

      {/* Auth Pages */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        {/* <Route path="/signup" element={<Signup />} /> */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/bgv/form/:token" element={<BGVEmailSubmitForm/>} />
      </Route>


    </Routes>
  );
};

export default AppRoutes;
