import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Detection from './pages/Detection';

function App() {
  return (
      <Router>
        <nav>
          <Link to="/">Dashboard</Link> |{" "}
          <Link to="/login">Login</Link> |{" "}
          <Link to="/detection">Detection</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/detection" element={<Detection />} />
        </Routes>
      </Router>
  );
}

export default App;