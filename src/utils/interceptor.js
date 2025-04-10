import axios from "axios";
import { toast } from "react-toastify"; //  Toast import

// const API_BASE_URL = "http://localhost:5000/api";
const API_BASE_URL= process.env.REACT_APP_URL;

const interceptor = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request Interceptor: Attach Authorization Tokenl;
interceptor.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem("token") || localStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle Errors & Token Expiry
interceptor.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response) {
            const { status } = error.response;

            switch (status) {
                case 400:
                    console.error("Bad Request: Invalid input.");
                    // toast.error("Bad Request: Please check your input.");
                    break;

                case 401:
                    console.error("Unauthorized: Invalid or expired token.");
                    if (window.location.pathname !== "/") {
                        sessionStorage.removeItem("token");
                        localStorage.removeItem("token");
                        toast.error("Session expired. Please login again.");
                        setTimeout(() => {
                            window.location.href = "/";
                        }, 2000);
                    }
                    break;

                case 403:
                    console.error("Forbidden: Access denied.");
                    toast.error("You do not have permission to access this resource.");
                    break;

                case 404:
                    console.error("Not Found: API endpoint does not exist.");
                    toast.error("Requested resource not found.");
                    break;

                case 500:
                    console.error("Internal Server Error: Something went wrong.");
                    toast.error("Server error! Please try again later.");
                    break;

                case 503:
                    console.error("Service Unavailable: Server might be down.");
                    toast.error("Server is temporarily unavailable. Try again later.");
                    break;

                default:
                    console.error(`Unexpected Error: ${status}`);
                    toast.error("An unexpected error occurred. Try again later.");
                    break;
            }
        } else if (error.request) {
            console.error("Server is not responding! Please check if backend is running.");
            toast.error("Server is not responding! Try again later.");
        } else {
            console.error("Request Error:", error.message);
            toast.error("An error occurred while sending the request.");
        }

        return Promise.reject(error);
    }
);

export default interceptor;
