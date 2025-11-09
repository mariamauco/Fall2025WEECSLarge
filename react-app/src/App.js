import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import './App.css';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Detection from './pages/Detection';
import SignUp from './pages/SignUp';
import Landing from './pages/Landing';

// Theme configuration
const theme = createTheme({
    palette: {
        primary: {
            main: '#C4D399',
            light: '#E5EEC8',
            dark: '#A8B87A'
        },
        secondary: {
            main: '#FCD5E5',
            light: '#FEF0F5',
            dark: '#F8B5C8'
        },
        gray: '#E0E0E0',
        text: {
            secondary: '#666666'
        }
    }
});

function App() {

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);


  useEffect(() => {
    const token = localStorage.getItem('token');
    setToken(token)
    if (!token) {
        // No token: not authenticated
        setUser(null);
        return;
    }
    try{
      fetch('http://138.197.16.179:5050/api/users/jwt', {
        headers: {
          'jwt-token': token,
        },
      })
      .then((res) => res.json())
    }catch (err) {
        // network / server error — treat as not authenticated for now
        console.error('Auth failed', err);
        setToken(null);
        setUser(null);
      }
  })

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Login />} />
          <Route path="/detection" element={<Detection />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;