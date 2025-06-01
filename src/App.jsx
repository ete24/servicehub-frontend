// src/App.jsx
import { useState, useEffect } from 'react'; // Import useState and useEffect
import axios from 'axios'; // Import axios
import './App.css';

function App() {
  const [providers, setProviders] = useState([]); // State to store providers
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to store any errors

  useEffect(() => {
    // Function to fetch providers from the backend
    const fetchProviders = async () => {
      try {
        // Make a GET request to your backend's providers endpoint
        const response = await axios.get('http://localhost:5000/api/providers');
        setProviders(response.data); // Update state with the fetched data
        setLoading(false); // Set loading to false once data is fetched
      } catch (err) {
        console.error('Error fetching providers:', err);
        setError('Failed to load providers. Please try again later.'); // Set error message
        setLoading(false); // Set loading to false even on error
      }
    };

    fetchProviders(); // Call the fetch function when the component mounts
  }, []); // The empty dependency array ensures this effect runs only once after initial render

  if (loading) {
    return <div>Loading providers...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <h1>ServiceHub Frontend</h1>
      <h2>Available Providers</h2>
      {providers.length === 0 ? (
        <p>No providers found.</p>
      ) : (
        <ul>
          {providers.map((provider) => (
            <li key={provider.id}>
              <strong>{provider.name}</strong> ({provider.email}) - {provider.phone_number}
              <p>{provider.description}</p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default App;