import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [jsonInput, setJsonInput] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleInputChange = (e) => {
    setJsonInput(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const parsedData = JSON.parse(jsonInput);
      setLoading(true);
      const res = await axios.post('https://restful-api-phi.vercel.app/bfhl', parsedData);
      setResponse(res.data);
      setError(null);
    } catch (err) {
      if (err.response) {
        // Server responded with a status other than 2xx
        setError(err.response.data.message || 'Server error');
      } else if (err.request) {
        // Request was made but no response was received
        setError('No response from server');
      } else {
        // Something else happened
        setError('Invalid JSON or other error');
      }
      setResponse(null);
    } finally {
      setLoading(false);
    }
  };
  

  const handleOptionChange = (e) => {
    const value = e.target.value;
    setSelectedOptions(
      selectedOptions.includes(value)
        ? selectedOptions.filter((option) => option !== value)
        : [...selectedOptions, value]
    );
  };

  const renderResponse = () => {
    if (!response) return null;
    const { numbers, alphabets, highest_lowercase_alphabet } = response;

    return (
      <div className="response-container">
        {selectedOptions.includes('Numbers') && (
          <div>
            <strong>Numbers:</strong> {numbers.join(', ')}
          </div>
        )}
        {selectedOptions.includes('Alphabets') && (
          <div>
            <strong>Alphabets:</strong> {alphabets.join(', ')}
          </div>
        )}
        {selectedOptions.includes('Highest Lowercase Alphabet') && (
          <div>
            <strong>Highest Lowercase Alphabet:</strong> {highest_lowercase_alphabet.join(', ')}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="App">
      <h1>BFHL Challenge</h1>
      <div>
        <textarea
          placeholder='Enter JSON'
          value={jsonInput}
          onChange={handleInputChange}
        />
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Loading...' : 'Submit'}
        </button>
      </div>
      {error && <div className="error">{error}</div>}
      <div>
        <label>
          <input
            type="checkbox"
            value="Numbers"
            checked={selectedOptions.includes('Numbers')}
            onChange={handleOptionChange}
          />
          Numbers
        </label>
        <label>
          <input
            type="checkbox"
            value="Alphabets"
            checked={selectedOptions.includes('Alphabets')}
            onChange={handleOptionChange}
          />
          Alphabets
        </label>
        <label>
          <input
            type="checkbox"
            value="Highest Lowercase Alphabet"
            checked={selectedOptions.includes('Highest Lowercase Alphabet')}
            onChange={handleOptionChange}
          />
          Highest Lowercase Alphabet
        </label>
      </div>
      {renderResponse()}
    </div>
  );
}

export default App;
