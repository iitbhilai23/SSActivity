import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import interceptor from "../utils/interceptor";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Login.css";
import SamagraLogo from '../assets/Logos.png';
import CGLogo from '../assets/cglogo.png';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setToken, setUser } = useContext(AuthContext);  // Set User Context

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim() || !password.trim()) {
            toast.error("Email and Password are required!");
            return;
        }

        setLoading(true);

        try {
            const response = await interceptor.post("/users/login", { email, password });

            // Ensure backend returns necessary data
            const { token, refreshToken, user, message } = response.data;

            if (!token) {
                throw new Error("No token received from server.");
            }

            // Save tokens in sessionStorage & localStorage
            sessionStorage.setItem("token", token);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("user", JSON.stringify(user)); // Store user data

            // Update Context for Auth State
            setToken(token);
            setUser(user);

            // Show success message
            toast.success(message || "Login Successful!");

            // Redirect based on role
            setTimeout(() => {
                switch (user.role) {
                    case "Admin":
                        navigate("/dashboard/AdminHome", { replace: true });
                        break;
                    case "DEO":
                        navigate("/dashboard/deoHome", { replace: true });
                        break;
                    case "BEO":
                        navigate("/dashboard/BeoHome", { replace: true });
                        break;
                    case "Cluster":
                        navigate("/dashboard/clusterHome", { replace: true });
                        break;
                    case "School":
                        navigate("/dashboard/Schoolhome", { replace: true });
                        break;
                    default:
                        navigate("/dashboard/home", { replace: true });
                }
            }, 2000);
        } catch (error) {
            toast.error(error.response?.data?.error || "Invalid Credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-split-container">
          <ToastContainer />
          <div className="left-panel">
          <img src={CGLogo} alt="Chhattisgarh Logo" className="cg-logo" />
            <h2>Welcome to Samagra Shiksha Item Distribution System</h2>
            <p>To keep connected with us, login with your credentials</p>
          </div>
      
          <div className="right-panel">
            <form onSubmit={handleSubmit} className="auth-form">
            <img src={SamagraLogo} alt="Samagra Logo" className="samagra-logo" />    
              <h2>User Login</h2>
              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
      
              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
      
              <button type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
      
              <p className="link-text">
                Don't have an account? <a href="/register">Register</a>
              </p>
            </form>
          </div>
        </div>
      );
}

export default Login;
