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
import BGVViewEditRequestForm from "../components/BGVRequest/BGVviewEditForm";
import BGVStatusUpdate from "../components/BGVRequest/BGVStatusUpdate";
import UploadCandidate from "../components/UploadCandidate";
import About from "../components/About";
import ContactUs from "../components/ContactUs";
import Product from "../components/Product/Product";
import ServiceDetailPage from "../components/serviceComponent/ServiceDetailPage";
import UpdateService from "../components/serviceComponent/UpdateService";
import CreateService from "../components/serviceComponent/CreateService";
import ForgotPassword from "../pages/ForgotPassword";
import BGVReportPage from "../components/BGVRequest/BGVReport";




const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/product" element={<Product />} />
        <Route path="/service/detail/:id" element={<ServiceDetailPage />} />


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
          <ProtectedRoute>
            {/* <ServiceAdd /> */}
            <CreateService />
          </ProtectedRoute>
        }
        />
        <Route path="/service/update/:id" element={
          <ProtectedRoute>
            <UpdateService />
          </ProtectedRoute>
        }
        />
        <Route path="/service/getby/:id" element={
          <ProtectedRoute>
            <ServiceDetails />
          </ProtectedRoute>
        }
        />
        <Route path="/clients" element={
          <ProtectedRoute>
            <ClientList />
          </ProtectedRoute>
        }
        />
        <Route path="/client/add" element={
          <ProtectedRoute>
            <AddClient />
          </ProtectedRoute>
        }
        />
        {/* client service */}
        <Route path="/client/service-add/:client_id" element={
          <ProtectedRoute>
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
            <BGVViewEditRequestForm />
          </ProtectedRoute>
        }/>
        <Route path="/bgv-update/:req_id" element={
          <ProtectedRoute>
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
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

      </Route>


    </Routes>
  );
};

export default AppRoutes;
