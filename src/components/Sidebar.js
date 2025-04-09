import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
// import Profile from "./Profile";
import "../styles/Sidebar.css";

import {
  FaHome,
  FaKey,
  FaCogs,
  FaSignOutAlt,
  FaUsers,
  FaBook,
  FaPlus,
  FaExchangeAlt,
  FaList,
  FaAngleDown,
  FaFutbol,
  FaChalkboardTeacher,
  FaToiletPaper
} from "react-icons/fa";
import logo from '../assets/Logos.png';

function Sidebar() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [flnOpen, setFlnOpen] = useState(false);

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="sidebar">
         <img src={logo} className="logo" />
      {/* <Profile /> */}

      <ul className="sidebar-menu">
        {/* Admin Menu */}
        {user?.role === "Admin" && (
          <>
          <li>
            <Link to="/dashboard/AdminHome">
              <FaHome className="icon" /> Dashboard
            </Link>
          </li>
          <li>
            <Link to="/dashboard/user-list">
              <FaUsers className="icon" /> User List
            </Link>
          </li>
        </>

        )}

        {/* DEO Dashboard */}
        {user?.role === "DEO" && (
          <li>
            <Link to="/dashboard/deoHome">
              <FaHome className="icon" /> Dashboard
            </Link>
          </li>
        )}

        {/* BEO Dashboard */}
        {user?.role === "BEO" && (
          <li>
            <Link to="/dashboard/BeoHome">
              <FaHome className="icon" /> Dashboard
            </Link>
          </li>
        )}

        {/* Cluster Dashboard */}
        {user?.role === "Cluster" && (
          <li>
            <Link to="/dashboard/clusterHome">
              <FaHome className="icon" /> Dashboard
            </Link>
          </li>
        )}

        {/* Item Menu (For all roles except School) */}
        {user?.role !== "School" && (
          <>
            <li className="submenu-toggle" onClick={() => setFlnOpen(!flnOpen)}>
              <span>
                <FaBook className="icon" /> Items{" "}
                <FaAngleDown className={`submenu-icon ${flnOpen ? "rotate" : ""}`} />
              </span>
            </li>
            {flnOpen && (
              <ul className="submenu">
                <li>
                  <Link to="/dashboard/fln-books/add">
                    <FaPlus className="icon" /> Add New Item
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/fln-books/distribute">
                    <FaExchangeAlt className="icon" /> Distribute Items
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/fln-books/all">
                    <FaList className="icon" /> All Items
                  </Link>
                </li>
              </ul>
            )}
          </>
        )}

        {/* School Dashboard & Verification Routes */}
        {user?.role === "School" && (
          <>
            <li>
              <Link to="/dashboard/Schoolhome">
                <FaHome className="icon" /> Dashboard
              </Link>
            </li>
            <li>
              <Link to="/dashboard/verify-library">
                <FaBook className="icon" /> Library Books
              </Link>
            </li>
            <li>
              <Link to="/dashboard/verify-fln">
                <FaChalkboardTeacher className="icon" /> FLN Books
              </Link>
            </li>
            <li>
              <Link to="/dashboard/verify-sports">
                <FaFutbol className="icon" /> Sports Items
              </Link>
            </li>
            <li>
              <Link to="/dashboard/verify-sanitary">
                <FaToiletPaper className="icon" /> Sanitary Machine
              </Link>
            </li>
          </>
        )}

        {/* Common Menu Items */}
        <li>
          <Link to="/dashboard/change-password">
            <FaKey className="icon" /> Change Password
          </Link>
        </li>
        <li>
          <Link to="/dashboard/settings">
            <FaCogs className="icon" /> Settings
          </Link>
        </li>

        {/* Logout Button */}
        <li className="logout-item">
          <button onClick={handleLogout}>
            <FaSignOutAlt className="icon" /> Logout
          </button>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
