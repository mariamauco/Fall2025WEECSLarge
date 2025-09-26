import * as React from 'react';
import {Container, TextField, Typography, Box, Button, createTheme, ThemeProvider, Card, InputAdornment} from '@mui/material';
import { Email, Lock } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import earthIcon from '../assets/earth_guy.png';

let theme = createTheme({

});
theme = createTheme(theme, {
    palette:{
        // Green
        primary:{
            main: '#C4D399',
            light: '#E5EEC8',
            dark: '#A8B87A'
        },
        // Pink
        secondary: {
            main: '#FCD5E5',
            light: '#FEF0F5',
            dark: '#F8B5C8'
        },
        gray: '#E0E0E0'
    }
})

function SignUp() {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };

    return (
        <ThemeProvider theme={theme}>
        {/* Main container with gradient background */}
        <Container 
        maxWidth={false}
        disableGutters
        sx={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100vw',
            background: 'linear-gradient(135deg, #D4BFED 0%, #FCD5E5 50%, #E5EEC8 100%)',
            padding: 0,
            margin: 0
        }}
        >
        {/* Main card container */}
        <Card
            sx={{
                display: 'flex',
                flexDirection: 'row',
                width: '800px',
                height: '500px',
                borderRadius: '20px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                overflow: 'hidden'
            }}
        >
            {/* Left promotional section */}
            <Box
                sx={{
                    width: '50%',
                    backgroundColor: 'secondary.light',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '40px',
                    position: 'relative'
                }}
            >
                {/* Earth character icon */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '30px'
                    }}
                >
                    <img 
                        src={earthIcon} 
                        alt="Earth character" 
                        style={{
                            width: '250px',
                            height: '250px',
                            objectFit: 'contain'
                        }}
                    />
                </Box>
                
                {/* Branding text */}
                <Typography 
                    variant="h4" 
                    sx={{ 
                        color: 'secondary.dark', 
                        fontWeight: 'bold',
                        textAlign: 'center',
                        marginBottom: '10px',
                        textShadow: '0 1px 2px rgba(255,255,255,0.8)'
                    }}
                >
                    Recycle Smarter.
                </Typography>
                <Typography 
                    variant="h4" 
                    sx={{ 
                        color: 'secondary.dark', 
                        fontWeight: 'bold',
                        textAlign: 'center',
                        textShadow: '0 1px 2px rgba(255,255,255,0.8)'
                    }}
                >
                    Track Your Impact.
                </Typography>
            </Box>

            {/* Right login form section */}
            <Box
                sx={{
                    width: '50%',
                    backgroundColor: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '40px'
                }}
            >
                {/* Sign Up title */}
                <Typography 
                    variant="h4" 
                    sx={{ 
                        color: 'primary.main', 
                        fontWeight: 'bold',
                        marginBottom: '40px'
                    }}
                >
                    Create an account
                </Typography>

                {/* Email field */}
                <TextField 
                    id="email-field" 
                    placeholder="username@email.com"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Email sx={{ color: 'gray' }} />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        marginBottom: '20px',
                        '& .MuiOutlinedInput-root': { 
                            borderRadius: '10px',
                            '& fieldset': {
                                borderColor: '#E0E0E0',
                                borderWidth: '2px'
                            },
                            '&:hover fieldset': {
                                borderColor: 'primary.main'
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: 'primary.main'
                            }
                        }
                    }}
                />

                {/* Password field */}
                <TextField 
                    id="password-field" 
                    placeholder="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Lock sx={{ color: 'gray' }} />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        marginBottom: '20px',
                        '& .MuiOutlinedInput-root': { 
                            borderRadius: '10px',
                            '& fieldset': {
                                borderColor: '#E0E0E0',
                                borderWidth: '2px'
                            },
                            '&:hover fieldset': {
                                borderColor: 'primary.main'
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: 'primary.main'
                            }
                        }
                    }}
                />

                {/* Confirm Password field */}
                <TextField 
                    id="confirm-password-field" 
                    placeholder="Confirm Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Lock sx={{ color: 'gray' }} />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        marginBottom: '30px',
                        '& .MuiOutlinedInput-root': { 
                            borderRadius: '10px',
                            '& fieldset': {
                                borderColor: 'gray',
                                borderWidth: '2px'
                            },
                            '&:hover fieldset': {
                                borderColor: 'primary.main'
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: 'primary.main'
                            }
                        }
                    }}
                />

                {/* Sign Up button */}
                <Button 
                    variant="contained"
                    fullWidth
                    sx={{
                        backgroundColor: 'primary.main',
                        color: 'white',
                        borderRadius: '10px',
                        padding: '12px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        marginBottom: '20px',
                        '&:hover': {
                            backgroundColor: 'primary.dark'
                        }
                    }}
                >
                    Sign Up
                </Button>

                {/* Sign up link */}
                <Typography sx={{ color: '#666', fontSize: '14px' }}>
                    Already have an account? 
                    <Button 
                        onClick={handleLoginClick}
                        sx={{ 
                            color: 'primary.main', 
                            textTransform: 'none',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            padding: '0 4px',
                            minWidth: 'auto'
                        }}
                    >
                        Log In
                    </Button>
                </Typography>
            </Box>
        </Card>
        </Container>
        </ThemeProvider>
    );
}

export default SignUp;