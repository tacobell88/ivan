import React, { useState } from "react";
import ReactDOM from "react-dom";
import axios from 'Axios';

import "./styles.css";

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', {username, password});
      localStorage.setItem('token', response.data.token);
      // redirect to dashboard based on role
    } catch (error) {
      setError(err.response.data);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
      <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button type = "submit" > </button>
      {error && <p>{error}</p>}
    </form>
  );

};

export default App;