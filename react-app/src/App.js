import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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