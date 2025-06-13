import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './RegisterPage.css'; // Ensure your CSS file is correctly linked

const RegisterPage = () => {
    // Initialize all form fields, including new ones, using CAMEL CASE for fields sent to backend
    const [formData, setFormData] = useState({
        name: '', // Legal Name (Personal)
        email: '', // Personal email
        password: '',
        confirmPassword: '',
        phoneNumber: '', // Renamed from phone_number to match backend (camelCase)
        residentialAddress: '', // Renamed from residential_address to match backend (camelCase)
        city: '',
        state: '',
        country: '',
        description: '', // Provider's general description/bio (Note: Not in backend DB schema yet)
        company_name: '', // New: Company Name (Note: Not in backend DB schema yet)
        business_address: '', // New: Company Business Address (Note: Not in backend DB schema yet)
        company_contact_phone_number: '', // New: Company Contact Phone Number (Note: Not in backend DB schema yet)
        company_contact_email: '', // New: Company Contact Email (must be unique) (Note: Not in backend DB schema yet)
        legal_name: '', // New: Legal Name of the business/individual (Note: Not in backend DB schema yet)
        subscriptionPlan: 'Free', // Renamed from subscription_plan to match backend (camelCase)
    });

    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    // Destructure all fields for easy access in JSX and handleSubmit
    const {
        name,
        email,
        password,
        confirmPassword,
        phoneNumber, // Use renamed field
        residentialAddress, // Use renamed field
        city,
        state,
        country,
        description,
        company_name,
        business_address,
        company_contact_phone_number,
        company_contact_email,
        legal_name,
        subscriptionPlan, // Use renamed field
    } = formData;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            // Send all form data to the backend
            // Ensure field names here match backend's expected camelCase
            const response = await axios.post('http://localhost:5001/api/providers/register', {
                name,
                email,
                password,
                phoneNumber, // <--- CHANGED: from phone_number to phoneNumber
                residentialAddress, // <--- CHANGED: from residential_address to residentialAddress
                city,
                state,
                country,
                // Note: The following fields (description, company_name, etc.) are NOT currently
                // part of your backend's providers table INSERT statement.
                // Sending them will be ignored by the backend, or might cause errors if backend validation changes.
                // For now, including them to match your formData state.
                description,
                company_name,
                business_address,
                company_contact_phone_number,
                company_contact_email,
                legal_name,
                subscriptionPlan, // <--- CHANGED: from subscription_plan to subscriptionPlan
            });
            setSuccessMessage('Registration successful! Your account is pending admin approval.');
            // Clear form data after successful registration
            setFormData({
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
                phoneNumber: '',
                residentialAddress: '',
                city: '',
                state: '',
                country: '',
                description: '',
                company_name: '',
                business_address: '',
                company_contact_phone_number: '',
                company_contact_email: '',
                legal_name: '',
                subscriptionPlan: 'Free', // Reset to default 'Free' for a new registration
            });
            // Optionally, navigate to login page after a short delay
            // setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            console.error('Registration error:', err);
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError('Registration failed. Please try again.');
            }
        }
    };

    return (
        <div className="register-container">
            <h2>Register as a Provider</h2>
            <form onSubmit={handleSubmit}>
                {/* Personal Information Section */}
                <h3>Personal Account Details</h3>
                <div className="form-group">
                    <label htmlFor="name">
                        Legal Name <span className="tiny-text">(As it's on your government-issued document):</span>
                    </label>
                    <input type="text" id="name" name="name" value={name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Personal Email:</label>
                    <input type="email" id="email" name="email" value={email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" value={password} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" value={confirmPassword} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="phoneNumber">Personal Phone Number:</label> {/* <--- CHANGED htmlFor/name to phoneNumber */}
                    <input type="text" id="phoneNumber" name="phoneNumber" value={phoneNumber} onChange={handleChange} required /> {/* <--- CHANGED id/name to phoneNumber */}
                </div>
                <div className="form-group">
                    <label htmlFor="residentialAddress">Residential Address:</label> {/* <--- CHANGED htmlFor/name to residentialAddress */}
                    <input type="text" id="residentialAddress" name="residentialAddress" value={residentialAddress} onChange={handleChange} required /> {/* <--- CHANGED id/name to residentialAddress */}
                </div>
                <div className="form-group">
                    <label htmlFor="city">City:</label>
                    <input type="text" id="city" name="city" value={city} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="state">State:</label>
                    <input type="text" id="state" name="state" value={state} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="country">Country:</label>
                    <input type="text" id="country" name="country" value={country} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Tell us about yourself and your services:</label>
                    <textarea id="description" name="description" value={description} onChange={handleChange} required rows="4"></textarea>
                </div>

                {/* Company Information Section */}
                <h3>Company Details</h3>
                <div className="form-group">
                    <label htmlFor="legal_name">Company Legal Name (Registered Business Name):</label>
                    <input type="text" id="legal_name" name="legal_name" value={legal_name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="company_name">Company Display Name:</label>
                    <input type="text" id="company_name" name="company_name" value={company_name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="business_address">Business Address:</label>
                    <input type="text" id="business_address" name="business_address" value={business_address} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="company_contact_phone_number">Company Phone Number:</label>
                    <input type="text" id="company_contact_phone_number" name="company_contact_phone_number" value={company_contact_phone_number} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="company_contact_email">Company Contact Email:</label>
                    <input type="email" id="company_contact_email" name="company_contact_email" value={company_contact_email} onChange={handleChange} required />
                </div>

                {/* Subscription Plan Section */}
                <h3>Subscription Plan</h3>
                <div className="form-group">
                    <label htmlFor="subscriptionPlan">Choose your Plan:</label> {/* <--- CHANGED htmlFor/name to subscriptionPlan */}
                    <select
                        id="subscriptionPlan" // <--- CHANGED id/name to subscriptionPlan
                        name="subscriptionPlan" // <--- CHANGED id/name to subscriptionPlan
                        value={subscriptionPlan}
                        onChange={handleChange}
                        required
                    >
                        <option value="Free">Free</option>
                        <option value="Basic Pro">Basic Pro</option>
                        <option value="Premium Pro">Premium Pro</option>
                        <option value="Elite Pro">Elite Pro</option>
                    </select>
                </div>

                <button type="submit" className="register-button">Register</button>
                {error && <p className="error-message">{error}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
            </form>
            <p className="login-link">
                Already have an account? <Link to="/login">Login here</Link>
            </p>
        </div>
    );
};

export default RegisterPage;