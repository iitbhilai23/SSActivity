import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import interceptor from "../utils/interceptor";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/ChangePassword.css";
import ModalBox from "../components/ModalBox";

function ChangePassword() {
    const { handleLogout, setToken } = useContext(AuthContext); //  setToken 
    const navigate = useNavigate();

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordValid, setPasswordValid] = useState({
        length: false,
        uppercase: false,
        number: false,
    });
    const [passwordMatch, setPasswordMatch] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState({ isOpen: false, type: "", message: "" });

    // pwd validation
    const validatePassword = (password) => {
        setPasswordValid({
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            number: /\d/.test(password),
        });
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (!passwordValid.length || !passwordValid.uppercase || !passwordValid.number) {
            toast.error("Password must meet the requirements.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordMatch(false);
            return;
        }

        setLoading(true);

        try {
            const response = await interceptor.post("/users/change-password", { 
                oldPassword, 
                newPassword 
            });

            // reset form
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setPasswordValid({ length: false, uppercase: false, number: false });
            setPasswordMatch(null);

            //  Successfully msg
            toast.success(response.data.message || "Password changed successfully!");
            setModal({ 
                isOpen: true, 
                type: "success", 
                message: "Password updated successfully! You can continue using the app." 
            });

        } catch (error) {
            const errorMessage = error.response?.data?.error || "Failed to change password.";
            toast.error(errorMessage);
            setModal({ isOpen: true, type: "error", message: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    // model stop function
    const handleModalClose = () => {
        setModal({ isOpen: false, type: "", message: "" });
    };

    return (
        <div className="change-password-container">
            <ToastContainer />
            <ModalBox 
                isOpen={modal.isOpen} 
                type={modal.type} 
                message={modal.message} 
                onClose={handleModalClose} 
            />

            <form onSubmit={handleChangePassword} className="change-password-form" noValidate>
                <h2>Change Your Password</h2>

                <div className="form-content">
                    {/* input fields */}
                    <div className="left-side">
                        <div className="input-group">
                            <label>Old Password</label>
                            <input
                                type="password"
                                placeholder="Enter your old password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                placeholder="Enter your new password"
                                value={newPassword}
                                onChange={(e) => {
                                    setNewPassword(e.target.value);
                                    validatePassword(e.target.value);
                                }}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Confirm New Password</label>
                            <input
                                type="password"
                                placeholder="Re-enter your new password"
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    setPasswordMatch(e.target.value === newPassword);
                                }}
                                required
                            />
                        </div>
                    </div>

                    {/* validation rules*/}
                    <div className="right-side">
                        <h4>Password must contain:</h4>
                        <p className={passwordValid.uppercase ? "valid" : "invalid"}>
                            ✔ At least 1 uppercase letter
                        </p>
                        <p className={passwordValid.number ? "valid" : "invalid"}>
                            ✔ At least 1 number
                        </p>
                        <p className={passwordValid.length ? "valid" : "invalid"}>
                            ✔ At least 8 characters
                        </p>

                        <p className={passwordMatch === null ? "invalid" : passwordMatch ? "valid" : "invalid"}>
                            {passwordMatch === false ? "❌ Passwords do not match" : "✔ Passwords match"}
                        </p>
                    </div>
                </div>

                <button type="submit" className="submit-button" disabled={loading}>
                    {loading ? "Changing Password..." : "Change My Password"}
                </button>
            </form>
        </div>
    );
}

export default ChangePassword;