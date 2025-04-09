import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/Profile.css";
import AdminIcon from "../assets/user.png";

function Profile() {
    const { user } = useContext(AuthContext);

    return (
        <div className="profile-container">
            <img src={user?.profileImage || AdminIcon } alt="Admin" className="profile-icon" />
            <div className="profile-details">
                <h3>{user?.name || "Admin"}</h3>
                <p>{user?.email || "admin@example.com"}</p>
            </div>
        </div>
    );
}

export default Profile;
