import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Button } from '@mui/material';
import { Home, Login, Logout } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Check if user is logged in
    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        setIsLoggedIn(!!(token && user));
    }, [location.pathname]); // Re-check when route changes

    const handleHomeClick = () => {
        if (isLoggedIn) {
            navigate('/dashboard');
        } else {
            navigate('/');
        }
    };

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        navigate('/');
    };

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid rgba(196, 211, 153, 0.2)',
                padding: '12px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}
        >
            {/* Logo/Brand */}
            <Box 
                onClick={handleHomeClick}
                sx={{ 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}
            >
                <Typography 
                    variant="h6" 
                    sx={{ 
                        fontWeight: 'bold',
                        color: 'primary.main',
                        fontSize: '1.5rem'
                    }}
                >
                    ♻️ Waste Sorter
                </Typography>
            </Box>

            {/* Navigation Links */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                {/* Home Button - only show if logged in */}
                {isLoggedIn && (
                    <IconButton
                        onClick={handleHomeClick}
                        sx={{
                            color: location.pathname === '/dashboard' ? 'primary.main' : 'text.secondary',
                            backgroundColor: location.pathname === '/dashboard' ? 'rgba(196, 211, 153, 0.1)' : 'transparent',
                            '&:hover': {
                                backgroundColor: 'rgba(196, 211, 153, 0.1)',
                                color: 'primary.main'
                            }
                        }}
                    >
                        <Home />
                    </IconButton>
                )}

                {/* Show Logout button if logged in, otherwise show Start Sorting */}
                {isLoggedIn ? (
                    <Button
                        onClick={handleLogout}
                        variant="outlined"
                        startIcon={<Logout />}
                        sx={{
                            borderColor: 'primary.main',
                            color: 'primary.main',
                            textTransform: 'none',
                            fontWeight: 'bold',
                            fontSize: '0.95rem',
                            px: 3,
                            py: 1,
                            borderRadius: '20px',
                            '&:hover': {
                                borderColor: 'primary.dark',
                                backgroundColor: 'rgba(196, 211, 153, 0.1)',
                                transform: 'translateY(-1px)',
                                boxShadow: '0 4px 12px rgba(196, 211, 153, 0.3)'
                            },
                            transition: 'all 0.2s ease-in-out'
                        }}
                    >
                        Logout
                    </Button>
                ) : (
                    <Button
                        onClick={handleLoginClick}
                        variant="outlined"
                        sx={{
                            borderColor: 'primary.main',
                            color: 'primary.main',
                            textTransform: 'none',
                            fontWeight: 'bold',
                            fontSize: '0.95rem',
                            px: 3,
                            py: 1,
                            borderRadius: '20px',
                            '&:hover': {
                                borderColor: 'primary.dark',
                                backgroundColor: 'rgba(196, 211, 153, 0.1)',
                                transform: 'translateY(-1px)',
                                boxShadow: '0 4px 12px rgba(196, 211, 153, 0.3)'
                            },
                            transition: 'all 0.2s ease-in-out'
                        }}
                    >
                        Login
                    </Button>
                )}
            </Box>
        </Box>
    );
}

export default Navbar;
