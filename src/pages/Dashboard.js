import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DashboardHome from "./DashboardHome";
import ChangePassword from "./ChangePassword";
import Settings from "./Settings";
import "../styles/Dashboard.css";
import UserList from "./UserList";
import FLNBookEntry from "./FLNBookEntry";
import AddItem from "./AddItem";
import DistributeItem from "./DistributeItem";
import AllItems from "./AllItems";
import ItemVerificationFLN from "./ItemVerificationFLN";
import ItemVerificationLibrary from "./ItemVerificationLibrary";
import ItemVerificationSports from "./ItemVerificationSports";
import ItemVerificationSanitary from "./ItemVerificationSanitary";
import SchoolDashboard from "./SchoolDashboard";
import BlockSummaryPage from "./BlockSummaryPage";
import DistrictSummaryPage from "./DistrictSummaryPage";
import ClusterSummaryPage from "./ClusterSummaryPage";
import StateSummaryPage from "./StateSummaryPage";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SchoolItemDetailPage from "../pages/SchoolItemDetailPage";

import { AuthContext } from "../context/AuthContext";


function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-content">
        <Navbar />

        {/* Global Notification */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />

        <Routes>

          {/*  Default route redirect based on user role */}
          <Route
            path="/"
            element={
                user?.role === "Admin" ? <Navigate to="/dashboard/AdminHome" /> :
              user?.role === "School" ? <Navigate to="/dashboard/Schoolhome" /> :
              user?.role === "Cluster" ? <Navigate to="/dashboard/clusterHome" /> :
              user?.role === "BEO" ? <Navigate to="/dashboard/BeoHome" /> :
              user?.role === "DEO" ? <Navigate to="/dashboard/deoHome" /> :
              <Navigate to="/dashboard/home" />
            }
          />

          {/* Admin only */}
          <Route path="/AdminHome" element={<StateSummaryPage />} />
          <Route path="/user-list" element={<UserList />} />
    

          {/* FLN Book Module */}
          <Route path="/fln-books" element={<FLNBookEntry />} />
          <Route path="/fln-books/add" element={<AddItem />} />
          <Route path="/fln-books/distribute" element={<DistributeItem />} />
          <Route path="/fln-books/all" element={<AllItems />} />

          {/* Item Verification (for School role) */}
          <Route path="/verify-library" element={<ItemVerificationLibrary />} />
          <Route path="/verify-fln" element={<ItemVerificationFLN />} />
          <Route path="/verify-sports" element={<ItemVerificationSports />} />
          <Route path="/verify-sanitary" element={<ItemVerificationSanitary />} />
          <Route path="/dashboard/clusterHome/school-items/:school_code" element={<SchoolItemDetailPage />} />

          {/* Role-based Dashboards */}
          <Route path="/Schoolhome" element={user?.role === "School" ? <SchoolDashboard /> : <DashboardHome />} />
          <Route path="/clusterHome" element={user?.role === "Cluster" ? <ClusterSummaryPage /> : <DashboardHome />} />
          <Route path="/BeoHome" element={user?.role === "BEO" ? <BlockSummaryPage /> : <DashboardHome />} />
          <Route path="/deoHome" element={user?.role === "DEO" ? <DistrictSummaryPage /> : <DashboardHome />} />

          {/* Common Routes */}
          <Route path="/home" element={<DashboardHome />} />
          <Route path="/change-password" element={<ChangePassword />} />
      
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
}

export default Dashboard;
