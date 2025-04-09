import React from "react";
import "../styles/ModalBox.css";

const ModalBox = ({ isOpen, type, message, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className={`modal-icon ${type === "success" ? "success" : "error"}`}>
                    {type === "success" ? "✅" : "❌"}
                </div>
                <h2>{type === "success" ? "Password Updated!" : "Error"}</h2>
                <p>{message}</p>
                <button className="close-button" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default ModalBox;
