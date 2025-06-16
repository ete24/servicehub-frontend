// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios'; // Assuming axios is used for API calls including logout
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode for token decoding

// 1. Create the AuthContext
// It will hold the authentication token, user data, and functions for login/logout
export const AuthContext = createContext({
  token: null,
  setToken: () => {},
  logout: () => {},
  user: null,
  login: () => {},
});

// Define your API base URL (ensure this matches your backend's URL)
const API_BASE_URL = 'http://localhost:5001/api';

// 2. Create the AuthProvider component
// This component will manage the authentication state and provide it to its children
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null); // This will hold the decoded user data (e.g., id, email, role)

  // Effect to initialize user state from token in local storage on mount
  useEffect(() => {
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        // Check if token is expired
        if (decodedUser.exp * 1000 < Date.now()) {
          console.log('Stored token expired. Logging out.');
          logout(); // Call logout if token is expired
        } else {
          setUser(decodedUser); // Set user data from decoded token
        }
      } catch (error) {
        console.error('Error decoding stored token:', error);
        logout(); // Clear token if decoding fails
      }
    }
  }, [token]); // Re-run if token changes (e.g., set by login/logout)

  // --- Axios Interceptor for Authorization ---
  // This interceptor will attach the token to every outgoing request
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const currentToken = localStorage.getItem('token'); // Get latest token from local storage
        if (currentToken) {
          config.headers.Authorization = `Bearer ${currentToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // --- Axios Interceptor for Error Handling (e.g., 401 Unauthorized) ---
    // If a 401 or 403 response is received, automatically log out the user
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          console.error('Authentication error (401/403). Logging out...');
          logout(); // Call the logout function
        }
        return Promise.reject(error);
      }
    );

    // Cleanup function for the effect
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []); // Empty dependency array means this runs once on mount and cleans up on unmount


  // --- Login Function ---
  const login = (newToken, userDataFromBackend) => {
    localStorage.setItem('token', newToken); // Store token in local storage
    setToken(newToken); // Update token state
    // Decode the token to get user details (id, email, role) for the user state
    try {
        const decodedToken = jwtDecode(newToken);
        setUser(decodedToken); // Update user data state with decoded token payload
        console.log('User logged in successfully! Token:', newToken, 'Decoded User Data:', decodedToken);
    } catch (error) {
        console.error('Failed to decode token after login:', error);
        setUser(null); // Ensure user is null if decoding fails
    }
  };

  // --- Logout Function ---
  const logout = () => {
    localStorage.removeItem('token'); // Remove token from local storage
    setToken(null); // Clear token state
    setUser(null); // Clear user data state
    console.log('User logged out.');
  };

  // The value that will be supplied to any components consuming this context
  const contextValue = {
    token,
    setToken,
    logout,
    user, // Pass user data (decoded token payload)
    login, // Pass the login function
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to consume the AuthContext easily
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
