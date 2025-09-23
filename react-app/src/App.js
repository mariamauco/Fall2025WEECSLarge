import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Detection from './pages/Detection';
import SignUp from './pages/SignUp';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/detection" element={<Detection />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </Router>
  );
}

export default App;