import React from 'react';
import { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Button } from '@mui/material';
import { Home, Login } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleHomeClick = () => {
        navigate('/');
    };

    const handleSignUpClick = () => {
        navigate('/signup');
    };

    // get most updated token
    useEffect(() => {
        const checkAuth = () => {
            setIsLoggedIn(!!localStorage.getItem('token'));
        };
        checkAuth();

        // react to token changes from other tabs/windows
        const onStorage = (e) => {
            if (e.key === 'token') checkAuth();
        };
        window.addEventListener('storage', onStorage);
        return () => {
            window.removeEventListener('storage', onStorage);
        };
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/');
    }

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
                {/* Home Button */}
                <IconButton
                    onClick={handleHomeClick}
                    sx={{
                        color: location.pathname === '/' ? 'primary.main' : 'text.secondary',
                        backgroundColor: location.pathname === '/' ? 'rgba(196, 211, 153, 0.1)' : 'transparent',
                        '&:hover': {
                            backgroundColor: 'rgba(196, 211, 153, 0.1)',
                            color: 'primary.main'
                        }
                    }}
                >
                    <Home />
                </IconButton>

                {/* Start Sorting Button */}
                <Button
                    onClick={handleSignUpClick}
                    variant="contained"
                    sx={{
                        backgroundColor: 'primary.main',
                        color: 'white',
                        textTransform: 'none',
                        fontWeight: 'bold',
                        fontSize: '0.95rem',
                        px: 3,
                        py: 1,
                        borderRadius: '20px',
                        '&:hover': {
                            backgroundColor: 'primary.dark',
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 12px rgba(196, 211, 153, 0.3)'
                        },
                        transition: 'all 0.2s ease-in-out'
                    }}
                >
                    Start Sorting
                </Button>
                {isLoggedIn ? (
                    <Button
                        onClick={handleLogout}
                        variant="contained"
                        sx={{
                            backgroundColor: 'secondary.main',
                            color: 'white',
                            textTransform: 'none',
                            fontWeight: 'bold',
                            fontSize: '0.95rem',
                            px: 3,
                            py: 1,
                            borderRadius: '20px',
                            '&:hover': {
                                backgroundColor: 'secondary.dark',
                                transform: 'translateY(-1px)',
                                boxShadow: '0 4px 12px rgba(196, 211, 153, 0.3)'
                            },
                            transition: 'all 0.2s ease-in-out'
                        }}
                    >
                        Logout
                    </Button>
                ) :(<></>)}
            </Box>
        </Box>
    );
}

export default Navbar;
