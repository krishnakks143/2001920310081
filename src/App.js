import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const NumberManagementApp = () => {
  const [urls, setUrls] = useState('');
  const [numbers, setNumbers] = useState([]);

  const fetchNumbers = async () => {
    const urlsArray = urls.trim().split(/\s+/);
    const promises = urlsArray.map((url) => axios.get(url, { timeout: 500 }));
    try {
      const responses = await Promise.allSettled(promises);
      let mergedNumbers = [];
      responses.forEach((response) => {
        if (response.status === 'fulfilled' && response.value.status === 200) {
          mergedNumbers = [...mergedNumbers, ...response.value.data.numbers];
        }
      });
      setNumbers([...new Set(mergedNumbers)].sort((a, b) => a - b));
    } catch (error) {
      console.error('Error fetching numbers:', error);
    }
  };

  const handleFetch = () => {
    fetchNumbers();
  };

  return (
    <div className="container">
      <h1>Number Management App</h1>
      <div className="form">
        <label htmlFor="urls">Enter URLs (separated by space):</label>
        <input
          type="text"
          id="urls"
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          placeholder="Enter URLs..."
        />
        <button onClick={handleFetch}>Fetch Numbers</button>
      </div>
      <div className="result">
        <h2>Result:</h2>
        <pre>{JSON.stringify(numbers, null, 2)}</pre>
      </div>
    </div>
  );
};

export default NumberManagementApp;
