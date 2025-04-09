import React, { useState } from "react";
import "../styles/Settings.css";

function Settings() {
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);
    const [language, setLanguage] = useState("en");

    return (
        <div className="settings-container">
            <h2>⚙️ Settings</h2>
            <p>Customize your preferences below.</p>

            {/* <div className="settings-card">
                <div className="settings-options">
                   
                    <div className="setting-item">
                        <label> Enable Dark Mode</label>
                        <label className="switch">
                            <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
                            <span className="slider"></span>
                        </label>
                    </div>

             
                    <div className="setting-item">
                        <label>🔔 Notification Alerts</label>
                        <label className="switch">
                            <input type="checkbox" checked={notifications} onChange={() => setNotifications(!notifications)} />
                            <span className="slider"></span>
                        </label>
                    </div>

                 
                    <div className="setting-item">
                        <label> Select Language</label>
                        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                            <option value="en">🇬🇧 English</option>
                            <option value="es">🇪🇸 Spanish</option>
                            <option value="fr">🇫🇷 French</option>
                        </select>
                    </div>

                 
                    <button className="save-btn"> Save Changes</button>
                </div>
            </div>  */}
        </div>
    );
}

export default Settings;
