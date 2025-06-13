// src/components/AddServiceForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

// Accept new props: providerId, currentServiceCount, serviceLimit, onServiceAdded
function AddServiceForm({ token, providerId, currentServiceCount, serviceLimit, onServiceAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Determine if service addition is allowed based on limit
  const canAddService = currentServiceCount < serviceLimit;

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

    if (!token) {
      setError('You must be logged in to add a service.');
      return;
    }
    if (!canAddService) {
      setError(`You have reached your service limit (${serviceLimit}) for your current plan.`);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/services/add', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setMessage(response.data.message);
      setFormData({ name: '', description: '', price: '', category: '' });
      // Call the callback function to notify parent (ProviderDashboard) to refresh service list
      if (onServiceAdded) {
        onServiceAdded();
      }
    } catch (err) {
      console.error('Error adding service:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.error || 'Failed to add service. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>Add New Service</h3>
      {!canAddService && serviceLimit !== Infinity && (
        <p style={{ color: 'red' }}>
          You have reached your service limit ({serviceLimit}) for your current plan. Upgrade to add more services.
        </p>
      )}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Service Name (e.g., Boiler Repair)" required disabled={!canAddService} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Service Description" required disabled={!canAddService} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd', minHeight: '60px' }}></textarea>
        <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price (e.g., 5000)" required disabled={!canAddService} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
        <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Category (e.g., Plumbing, Electrician)" required disabled={!canAddService} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
        <button type="submit" disabled={!canAddService} style={{ padding: '10px 15px', backgroundColor: canAddService ? '#007bff' : '#cccccc', color: 'white', border: 'none', borderRadius: '4px', cursor: canAddService ? 'pointer' : 'not-allowed' }}>Add Service</button>
      </form>
    </div>
  );
}

export default AddServiceForm;