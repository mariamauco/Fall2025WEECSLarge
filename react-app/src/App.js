import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import './App.css';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
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
    const myToken = localStorage.getItem('token');
    setToken(myToken)
    if (!myToken) {
        // No token: not authenticated
        setUser(null);
        return;
    }

    const checkAuth = async () => {
      try {
        const res = await fetch('http://138.197.16.179:5050/api/users/jwt', {
          headers: {
            'jwt-token': myToken,
          },
        });
        if (!res.ok) {
          // unauthorized or other error
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          return;
        }
        const data = await res.json();
        if (data && data.message === 'success') {
          setUser({ authenticated: true });
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Auth failed', err);
        setToken(null);
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/detection" element={
            <ProtectedRoute>
              <Detection />
            </ProtectedRoute>
          } />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;