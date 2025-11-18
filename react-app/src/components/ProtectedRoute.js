import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    // If no token or user, redirect to landing page
    if (!token || !user) {
        return <Navigate to="/" replace />;
    }

    // User is authenticated, render the protected component
    return children;
}

export default ProtectedRoute;

