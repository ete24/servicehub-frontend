import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css'; // Make sure you have this CSS file if styling

const LoginPage = ({ setAuth }) => { // Assuming setAuth prop is passed to manage login state
    const [formData, setFormData] = useState({
        identifier: '', // Can be email or name
        password: ''
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const { identifier, password } = formData;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!identifier || !password) {
            setError('Please enter your email/name and password.');
            return;
        }

        try {
            // Determine if the identifier is an email or a name
            const payload = {};
            if (identifier.includes('@')) {
                payload.email = identifier;
            } else {
                payload.name = identifier;
            }
            payload.password = password;

            // --- API URL CHANGED TO PORT 5001 ---
            const response = await axios.post('http://localhost:5001/api/providers/login', payload);

            setSuccessMessage(response.data.message);
            
            // Assuming the backend sends a token and provider data on successful login
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('provider', JSON.stringify(response.data.provider)); // Store provider data

            // If using context/state for authentication, update it
            if (setAuth) {
                setAuth({
                    isAuthenticated: true,
                    user: response.data.provider,
                    token: response.data.token,
                    role: 'provider' // Assuming this is how you differentiate roles
                });
            }

            // Redirect to a dashboard or profile page after successful login
            navigate('/provider/dashboard'); // Or wherever appropriate
        } catch (err) {
            console.error('Login error:', err);
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError('Login failed. Please check your credentials.');
            }
        }
    };

    return (
        <div className="login-container">
            <h2>Provider Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="identifier">Email or Display Name:</label>
                    <input
                        type="text"
                        id="identifier"
                        name="identifier"
                        value={identifier}
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
                <button type="submit" className="login-button">Login</button>
                {error && <p className="error-message">{error}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
            </form>
            <p className="register-link">
                Don't have an account? <Link to="/register">Register here</Link>
            </p>
        </div>
    );
};

export default LoginPage;