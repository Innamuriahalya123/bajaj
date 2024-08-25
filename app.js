import React, { useState } from "react";
import "./App.css";

function App() {
  const [jsonInput, setJsonInput] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleJsonInputChange = (e) => {
    setJsonInput(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const parsedInput = JSON.parse(jsonInput);
      if (!Array.isArray(parsedInput.data)) {
        setError('JSON must contain a "data" array.');
        return;
      }

      const response = await fetch("https://bajaj.herokuapp.com/bfhl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: parsedInput.data }),
      });

      const data = await response.json();
      setResponse(data);
      setError("");
    } catch (err) {
      setError("Invalid JSON input");
    }
  };

  const handleOptionChange = (e) => {
    const value = e.target.value;
    setSelectedOptions(
      e.target.checked
        ? [...selectedOptions, value]
        : selectedOptions.filter((option) => option !== value)
    );
  };

  const renderResponse = () => {
    if (!response) return null;

    return (
      <div className="response">
        {selectedOptions.includes("Numbers") && response.numbers && (
          <div>
            <h3>Numbers:</h3>
            <p>{response.numbers.join(", ")}</p>
          </div>
        )}
        {selectedOptions.includes("Alphabets") && response.alphabets && (
          <div>
            <h3>Alphabets:</h3>
            <p>{response.alphabets.join(", ")}</p>
          </div>
        )}
        {selectedOptions.includes("Highest lowercase alphabet") &&
          response.highest_lowercase_alphabet && (
            <div>
              <h3>Highest lowercase alphabet:</h3>
              <p>{response.highest_lowercase_alphabet.join(", ")}</p>
            </div>
          )}
      </div>
    );
  };

  return (
    <div className="App">
      <h1>Your Roll Number</h1>
      <div className="json-input">
        <textarea
          placeholder='Enter JSON: { "data": ["A", "C", "z"] }'
          value={jsonInput}
          onChange={handleJsonInputChange}
        />
      </div>
      {error && <p className="error">{error}</p>}
      <button onClick={handleSubmit}>Submit</button>
      {response && (
        <>
          <div className="options">
            <label>
              <input
                type="checkbox"
                value="Alphabets"
                onChange={handleOptionChange}
              />
              Alphabets
            </label>
            <label>
              <input
                type="checkbox"
                value="Numbers"
                onChange={handleOptionChange}
              />
              Numbers
            </label>
            <label>
              <input
                type="checkbox"
                value="Highest lowercase alphabet"
                onChange={handleOptionChange}
              />
              Highest lowercase alphabet
            </label>
          </div>
          {renderResponse()}
        </>
      )}
    </div>
  );
}

export default App;
