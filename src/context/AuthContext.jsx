// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Create the AuthContext
export const AuthContext = createContext();

// Define your API base URL (ensure this matches your backend)
const API_BASE_URL = 'http://localhost:5001/api';

// AuthProvider Component to manage authentication state
export const AuthProvider = ({ children }) => {
    // State to hold the authenticated user's data
    const [user, setUser] = useState(null);
    // State to hold the authentication token, initialized from localStorage
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    // State to indicate if the initial authentication check is still in progress
    const [loading, setLoading] = useState(true);

    // Callback function to verify the token with the backend
    // This is run on component mount and when the token changes
    const verifyToken = useCallback(async () => {
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            // Make a request to a backend endpoint that verifies the token
            // and returns user data if valid. Adjust the URL if your backend
            // uses a different endpoint for token verification (e.g., /providers/me).
            const response = await axios.get(`${API_BASE_URL}/providers/profile`, { // Using /providers/profile as a general verification endpoint
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            // Assuming the backend sends user data inside a 'provider' key for this endpoint
            setUser(response.data.provider); 
        } catch (error) {
            console.error('Token verification failed:', error);
            // If verification fails (e.g., token expired or invalid), clear stored token
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
        } finally {
            setLoading(false); // Set loading to false once verification is complete
        }
    }, [token]); // Dependency array: re-run if 'token' changes

    // Effect hook to run token verification on initial load and token changes
    useEffect(() => {
        verifyToken();
    }, [verifyToken]); // Dependency array: re-run if 'verifyToken' callback changes

    // Function to handle user login
    const login = async (email, password, role) => {
        try {
            // Dynamically choose the login endpoint based on the role
            const loginEndpoint = role === 'provider' 
                ? `${API_BASE_URL}/providers/login` 
                : `${API_BASE_URL}/admin/login`; // Add other roles/endpoints as needed

            const response = await axios.post(loginEndpoint, { email, password });
            const { token: receivedToken, user: userData } = response.data; // Assuming backend sends { token, user }

            // Store the token in localStorage
            localStorage.setItem('token', receivedToken);
            // Update state
            setToken(receivedToken);
            setUser(userData); // Set full user data (e.g., id, email, subscription_plan)

            return { success: true, message: "Logged in successfully!" };
        } catch (error) {
            console.error('Login failed:', error);
            return { 
                success: false, 
                message: error.response?.data?.message || 'Login failed. Please check your credentials.' 
            };
        }
    };

    // Function to handle user logout
    const logout = () => {
        // Clear token from localStorage and state
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    // The value provided to consumers of this context
    const value = {
        user,
        token,
        loading,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading ? children : <div>Authenticating...</div>} {/* Show loading or children */}
        </AuthContext.Provider>
    );
};