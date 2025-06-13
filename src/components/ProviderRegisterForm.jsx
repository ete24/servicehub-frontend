// src/components/ProviderRegisterForm.jsx
import React, { useState } from 'react';
import axios from 'axios'; // We'll use axios for API calls

function ProviderRegisterForm() {
  // State for each form field
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone_number: '',
    address: '',
    city: '',
    state: '',
    country: '',
    description: ''
  });
  const [message, setMessage] = useState(''); // To display success or error messages
  const [error, setError] = useState('');     // To display specific error details

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
    e.preventDefault(); // Prevent default form submission behavior (page reload)
    setMessage(''); // Clear previous messages
    setError('');   // Clear previous errors

    try {
      // Send form data to your backend registration endpoint
      const response = await axios.post('http://localhost:5000/api/providers/register', formData);
      setMessage(response.data.message); // Set success message from backend
      setFormData({ // Clear form fields on success
        name: '', email: '', password: '', phone_number: '', address: '',
        city: '', state: '', country: '', description: ''
      });
    } catch (err) {
      console.error('Registration error:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.error || 'Registration failed. Please try again.'); // Set error message
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Register as a Service Provider</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Service Name (e.g., John Doe Plumbing)" required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
        <input type="tel" name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="Phone Number" style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
        <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
        <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
        <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="State" style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
        <input type="text" name="country" value={formData.country} onChange={handleChange} placeholder="Country" style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description of your services" style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd', minHeight: '60px' }}></textarea>
        <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Register</button>
      </form>
    </div>
  );
}

export default ProviderRegisterForm;