// src/pages/AdminLoginPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css'; // You can reuse or create a specific CSS for admin if needed

const AdminLoginPage = ({ setAuth }) => {
    const [formData, setFormData] = useState({
        email: '', // Admins typically log in with email
        password: ''
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const { email, password } = formData;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!email || !password) {
            setError('Please enter your email and password.');
            return;
        }

        try {
            // *** CRITICAL CHANGE: Target the admin login endpoint ***
            const response = await axios.post('http://localhost:5001/api/admin/login', { email, password });

            setSuccessMessage(response.data.message);

            // Assuming the backend sends a token and admin data on successful login
            const adminData = response.data.admin; // Assuming the backend returns the admin object
            const token = response.data.token;

            localStorage.setItem('adminToken', token);
            // It's good practice to also clear provider token if admin logs in via dedicated admin page
            localStorage.removeItem('token');

            // *** CRITICAL CHANGE: Update authentication state with 'admin' role ***
            if (setAuth) {
                setAuth({
                    isAuthenticated: true,
                    user: adminData, // Pass the actual admin data
                    token: token,
                    role: 'admin' // Explicitly set role to 'admin'
                });
            }

            // *** CRITICAL CHANGE: Redirect to the admin dashboard ***
            navigate('/admin');
        } catch (err) {
            console.error('Admin login error:', err);
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError('Admin login failed. Please check your credentials.');
            }
        }
    };

    return (
        <div className="login-container">
            <h2>Admin Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email" // Use type="email" for better validation
                        id="email"
                        name="email"
                        value={email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="login-button">Login as Admin</button>
                {error && <p className="error-message">{error}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
            </form>
            <p className="register-link">
                <Link to="/login">Back to Provider Login</Link>
            </p>
        </div>
    );
};

export default AdminLoginPage;