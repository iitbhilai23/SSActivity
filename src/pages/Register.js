import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import interceptor from "../utils/interceptor";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import "../styles/Register.css";
import "../styles/Login.css";
import SamagraLogo from '../assets/Logos.png';
import CGLogo from '../assets/cglogo.png';

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [role, setRole] = useState("");  
    const [districtId, setDistrictId] = useState("");  
    const [blockId, setBlockId] = useState("");
    const [clusterId, setClusterId] = useState("");
    const [schoolCode, setSchoolCode] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!name.trim() || !email.trim() || !mobile.trim() || !role.trim() || !password.trim()) {
            toast.error("All fields are required!");
            return;
        }

        if (!/^\d{10}$/.test(mobile)) {
            toast.error("Enter a valid 10-digit mobile number!");
            return;
        }

        if (password.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (role === "DEO" && !districtId) {
            toast.error("District ID is required for DEO");
            return;
        }

        if (role === "BEO" && (!blockId || !districtId)) {
            toast.error("Block ID and District ID are required for BEO");
            return;
        }

        if (role === "Cluster" && (!clusterId || !blockId)) {
            toast.error("Cluster ID and Block ID are required for Cluster users");
            return;
        }

        if (role === "School" && (!schoolCode || !blockId || !clusterId)) {
            toast.error("School Code, Block ID, and Cluster ID are required for School users");
            return;
        }

        setLoading(true);
        try {
            const response = await interceptor.post("/users/register", {
                name,
                email,
                mobile,
                role,
                password,
                district_id: role === "DEO" || role === "BEO" ? districtId : null,
                block_id: role === "BEO" || role === "Cluster" || role === "School" ? blockId : null,
                cluster_id: role === "Cluster" || role === "School" ? clusterId : null,
                school_code: role === "School" ? schoolCode : null,
            });

            if (response.data && response.data.message) {
                toast.success(response.data.message);
            } else {
                toast.success("Registration Successful! Waiting for Admin Approval.");
            }

            setTimeout(() => {
                navigate("/");
            }, 2000);
        } catch (error) {
            toast.error(error.response?.data?.error || "Registration Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-split-container">
          <ToastContainer />
          <div className="left-panel">
          <img src={CGLogo} alt="Chhattisgarh Logo" className="cg-logo" />
            <h2>Welcome to Samagra Shiksha Item Distribution System!</h2>
            <p>Create your account to access the dashboard</p>
          </div>
      
          <div className="right-panel">
            <form onSubmit={handleRegister} className="auth-form">
            <img src={SamagraLogo} alt="Samagra Logo" className="samagra-logo" /> 
              <h2>User Registration</h2>
      
              <input type="text" placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)} required />
              <input type="email" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <input type="text" placeholder="Enter Mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} required />
      
              <select value={role} onChange={(e) => setRole(e.target.value)} required>
                <option value="">Select Role</option>
                <option value="Admin">Admin</option>
                <option value="DEO">District Education Officer (DEO)</option>
                <option value="BEO">Block Education Officer (BEO)</option>
                <option value="Cluster">Cluster User</option>
                <option value="School">School User</option>
              </select>
      
              {/* Conditional Inputs based on Role */}
              {role === "DEO" && (
                <input type="text" placeholder="Enter District ID" value={districtId} onChange={(e) => setDistrictId(e.target.value)} required />
              )}
              {role === "BEO" && (
                <>
                  <input type="text" placeholder="Enter District ID" value={districtId} onChange={(e) => setDistrictId(e.target.value)} required />
                  <input type="text" placeholder="Enter Block ID" value={blockId} onChange={(e) => setBlockId(e.target.value)} required />
                </>
              )}
              {role === "Cluster" && (
                <>
                  <input type="text" placeholder="Enter Block ID" value={blockId} onChange={(e) => setBlockId(e.target.value)} required />
                  <input type="text" placeholder="Enter Cluster ID" value={clusterId} onChange={(e) => setClusterId(e.target.value)} required />
                </>
              )}
              {role === "School" && (
                <>
                  <input type="text" placeholder="Enter Block ID" value={blockId} onChange={(e) => setBlockId(e.target.value)} required />
                  <input type="text" placeholder="Enter Cluster ID" value={clusterId} onChange={(e) => setClusterId(e.target.value)} required />
                  <input type="text" placeholder="Enter School Code" value={schoolCode} onChange={(e) => setSchoolCode(e.target.value)} required />
                </>
              )}
      
              <input type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
      
              <button type="submit" disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </button>
      
              <p className="link-text">
                Already have an account? <a href="/">Login</a>
              </p>
            </form>
          </div>
        </div>
      );
      
}

export default Register;
