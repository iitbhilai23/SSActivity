import React from "react";
import "../styles/NotFound.css"; // Import CSS file

function NotFound() {
    return (
        <div className="not-found-container">
            <h1>404 - Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
            <a href="/" className="home-link">Go to Home</a>
        </div>
    );
}

export default NotFound;
