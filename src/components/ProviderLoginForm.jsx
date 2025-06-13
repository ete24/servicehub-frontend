// src/components/ProviderLoginForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

function ProviderLoginForm({ onAuthChange }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const currentToken = localStorage.getItem('token'); // Still useful for internal conditional rendering

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/providers/login', formData);

      const newToken = response.data.token;
      const providerData = response.data.provider; // Get the full provider object

      onAuthChange(newToken, providerData); // Pass token AND providerData to App.jsx

      setMessage(`Logged in successfully as ${providerData.name} (Plan: ${providerData.subscription_plan})!`);
      setFormData({ email: '', password: '' });
      console.log('Logged in provider:', providerData);

    } catch (err) {
      console.error('Login error:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    }
  };

  const handleLogout = () => {
    onAuthChange(null, null); // Notify App.jsx that token and provider are gone
    setMessage('Logged out successfully!');
    setError('');
  };

  return (
    <div style={{ maxWidth: '400px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Provider Login</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {currentToken ? (
        <div>
          <p>You are currently logged in.</p>
          <button onClick={handleLogout} style={{ padding: '10px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
          <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Login</button>
        </form>
      )}
    </div>
  );
}

export default ProviderLoginForm;