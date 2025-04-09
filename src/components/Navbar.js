import React from "react";
import "../styles/Navbar.css";
// import logo from '../assets/Logos.png';
import Profile from "./Profile";

function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-title">
                <h2>Welcome to Samagra Shiksha Dashboard</h2>
            </div>
            <div>
                {/* <img src={logo} className="logo" /> */}
                <Profile />

            </div>
        </nav>
    );
}

export default Navbar;
