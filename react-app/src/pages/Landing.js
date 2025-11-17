import React from 'react';
import { 
    Box, 
    Container, 
    Typography, 
    Button, 
    Grid, 
    Card, 
    useTheme,
    useMediaQuery
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Landing() {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    const handleSignUpClick = () => {
        navigate('/signup');
    };

    const handleLoginClick = () => {
        navigate('/login');
    };

    const steps = [
        {
            number: '1',
            title: 'Scan Items',
            description: 'Use your camera to scan waste items'
        },
        {
            number: '2',
            title: 'Get Points',
            description: 'Earn points for every recycled item'
        },
        {
            number: '3',
            title: 'Track Impact',
            description: 'See your environmental contribution grow'
        }
    ];

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #D4BFED 0%, #FCD5E5 50%, #E5EEC8 100%)',
                pt: { xs: '80px', sm: '100px' },
                pb: 8
            }}
        >
            {/* Hero Section */}
            <Container maxWidth="lg" sx={{ mb: { xs: 8, md: 12 } }}>
                <Box sx={{ textAlign: 'center', maxWidth: '900px', mx: 'auto' }}>
                    <Box
                        sx={{
                            background: 'linear-gradient(135deg, #C4D399 0%, #FCD5E5 100%)',
                            borderRadius: '20px',
                            p: '3px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <Card
                            sx={{
                                backgroundColor: 'white',
                                borderRadius: '17px',
                                p: { xs: 4, sm: 6, md: 8 },
                                boxShadow: 'none'
                            }}
                        >
                        <Typography
                            variant="h1"
                            sx={{
                                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                                fontWeight: 'bold',
                                marginBottom: '25px',
                                lineHeight: 1.2,
                                color: 'secondary.dark'
                            }}
                        >
                            Ecosorter
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                fontSize: { xs: '1rem', sm: '1.25rem' },
                                color: 'dimgray',
                                mb: 4,
                                lineHeight: 1.6,
                                maxWidth: '700px',
                                mx: 'auto'
                            }}
                        >
                            An AI-powered waste sorting system developed by our team in collaboration with WEECS @ UCF. Scan objects like cans, bottles, cardboard, and paper to get instant classification and disposal guidance. Track your waste history, environmental impact, and see how much CO2 you've saved.
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 2,
                                flexDirection: { xs: 'column', sm: 'row' },
                                justifyContent: 'center'
                            }}
                        >
                            <Button
                                onClick={handleSignUpClick}
                                variant="contained"
                                size="large"
                                sx={{
                                    background: 'linear-gradient(135deg, #A8B87A 0%, #C4D399 100%)',
                                    color: 'white',
                                    textTransform: 'none',
                                    fontWeight: 'bold',
                                    fontSize: { xs: '1rem', sm: '1.1rem' },
                                    px: { xs: 4, sm: 5 },
                                    py: { xs: 1.5, sm: 2 },
                                    borderRadius: '25px',
                                    boxShadow: '0 4px 15px rgba(168, 184, 122, 0.4)',
                                    transition: 'all 0.3s ease-in-out',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #95a36a 0%, #b5c88a 100%)',
                                        boxShadow: '0 6px 20px rgba(168, 184, 122, 0.6)',
                                        transform: 'translateY(-2px)'
                                    },
                                    '&:active': {
                                        transform: 'translateY(0px)'
                                    }
                                }}
                            >
                                Get Started
                            </Button>
                        </Box>
                        </Card>
                    </Box>
                </Box>
            </Container>

            {/* How It Works Section */}
            <Container maxWidth="lg" sx={{ mb: { xs: 8, md: 12 } }}>
                <Box sx={{ textAlign: 'center', maxWidth: '900px', mx: 'auto' }}>
                    <Box
                        sx={{
                            background: 'linear-gradient(135deg, #C4D399 0%, #FCD5E5 100%)',
                            borderRadius: '20px',
                            p: '3px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <Card
                            sx={{
                                backgroundColor: 'white',
                                borderRadius: '17px',
                                p: { xs: 4, sm: 6, md: 8 },
                                boxShadow: 'none'
                            }}
                        >
                            <Typography
                                variant="h1"
                                sx={{
                                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                                    fontWeight: 'bold',
                                    marginBottom: '25px',
                                    lineHeight: 1.2,
                                    color: 'secondary.dark'
                                }}
                            >
                                How It Works
                            </Typography>
                            <Grid container spacing={4} justifyContent="center">
                                {steps.map((step, index) => (
                                    <Grid item xs={12} sm={4} md={4} key={index}>
                                        <Box
                                            sx={{
                                                textAlign: 'center',
                                                position: 'relative'
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: { xs: '80px', sm: '100px' },
                                                    height: { xs: '80px', sm: '100px' },
                                                    borderRadius: '50%',
                                                    backgroundColor: 'primary.main',
                                                    color: 'white',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    mx: 'auto',
                                                    mb: 2,
                                                    fontSize: { xs: '2rem', sm: '2.5rem' },
                                                    fontWeight: 'bold',
                                                    boxShadow: '0 4px 15px rgba(196, 211, 153, 0.4)'
                                                }}
                                            >
                                                {step.number}
                                            </Box>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    fontWeight: 'bold',
                                                    color: 'primary.dark',
                                                    mb: 1,
                                                    fontSize: { xs: '1.1rem', sm: '1.25rem' }
                                                }}
                                            >
                                                {step.title}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: 'dimgray',
                                                    lineHeight: 1.6
                                                }}
                                            >
                                                {step.description}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Card>
                    </Box>
                </Box>
            </Container>

            {/* Hero Section */}
            <Container maxWidth="lg" sx={{ mb: { xs: 8, md: 12 } }}>
                <Box sx={{ textAlign: 'center', maxWidth: '900px', mx: 'auto' }}>
                    <Box
                        sx={{
                            background: 'linear-gradient(135deg, #C4D399 0%, #FCD5E5 100%)',
                            borderRadius: '20px',
                            p: '3px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <Card
                            sx={{
                                backgroundColor: 'white',
                                borderRadius: '17px',
                                p: { xs: 4, sm: 6, md: 8 },
                                boxShadow: 'none'
                            }}
                        >
                        <Typography
                            variant="h1"
                            sx={{
                                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                                fontWeight: 'bold',
                                marginBottom: '25px',
                                lineHeight: 1.2
                            }}
                        >
                            <Box component="span" sx={{ color: 'secondary.dark' }}>Join Us!</Box>
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                fontSize: { xs: '1rem', sm: '1.25rem' },
                                color: 'dimgray',
                                mb: 4,
                                lineHeight: 1.6,
                                maxWidth: '700px',
                                mx: 'auto'
                            }}
                        >
                            Scan and sort your way to saving the planet and making a difference!
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 2,
                                flexDirection: { xs: 'column', sm: 'row' },
                                justifyContent: 'center'
                            }}
                        >
                            <Button
                                onClick={handleSignUpClick}
                                variant="contained"
                                size="large"
                                sx={{
                                    background: 'linear-gradient(135deg, #A8B87A 0%, #C4D399 100%)',
                                    color: 'white',
                                    textTransform: 'none',
                                    fontWeight: 'bold',
                                    fontSize: { xs: '1rem', sm: '1.1rem' },
                                    px: { xs: 4, sm: 5 },
                                    py: { xs: 1.5, sm: 2 },
                                    borderRadius: '25px',
                                    boxShadow: '0 4px 15px rgba(168, 184, 122, 0.4)',
                                    transition: 'all 0.3s ease-in-out',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #95a36a 0%, #b5c88a 100%)',
                                        boxShadow: '0 6px 20px rgba(168, 184, 122, 0.6)',
                                        transform: 'translateY(-2px)'
                                    },
                                    '&:active': {
                                        transform: 'translateY(0px)'
                                    }
                                }}
                            >
                                Get Started
                            </Button>
                        </Box>
                        </Card>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}

export default Landing;
