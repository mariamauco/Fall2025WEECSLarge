import * as React from 'react';
import { useState, useEffect } from 'react';
import { Container, TextField, Typography, Box, Button, createTheme, ThemeProvider, Card, InputAdornment, Grid, Avatar } from '@mui/material';
import {EmojiEvents, Air, Leaderboard, History, Recycling, CameraAlt} from '@mui/icons-material';
import CardComponent from '../components/Card';
import {useNavigate} from "react-router-dom";

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

function Dashboard() {
    const navigate = useNavigate();
    
    // State for user data
    const [userPoints, setUserPoints] = useState(0);
    const [userName, setUserName] = useState("Guest");
    const [totalRecycled, setTotalRecycled] = useState(0);
    const [leaderboard, setLeaderboard] = useState([]);
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [token, setToken] = useState(null);

    const handleDetectionClick = () => {
        navigate('/detection');
    };

    // Fetch user data from API
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Get user data from localStorage
                const storedUser = localStorage.getItem('user');
                const storedToken = localStorage.getItem('token');
                
                if (storedUser) {
                    // set token state from the stored token
                    setToken(storedToken);
                    const user = JSON.parse(storedUser);
                    const userId = user.id || user._id;
                    
                    // Extract first name from stored user data
                    const firstName = user.name ? user.name.split(' ')[0] : (user.username || "Guest");
                    setUserName(firstName);
                    
                    if (userId) {
                        // Fetch user stats
                        const statsResponse = await fetch(`http://138.197.16.179:5050/api/stats/${userId}`);
                        
                        if (statsResponse.ok) {
                            const statsData = await statsResponse.json();
                            
                            setUserPoints(statsData.points || 0);
                            setTotalRecycled(statsData.recycled || 0);
                        }
                        
                        // Fetch user history
                        try {
                            const historyResponse = await fetch(`http://138.197.16.179:5050/api/stats/history/${userId}`);
                            if (historyResponse.ok) {
                                const historyData = await historyResponse.json();
                                setHistory(historyData || []);
                            }
                        } catch (err) {
                            console.log('History endpoint not available yet');
                        }
                    }
                }
                
                // Fetch leaderboard
                try {
                    const leaderboardResponse = await fetch('http://138.197.16.179:5050/api/stats/leaderboard');
                    if (leaderboardResponse.ok) {
                        const leaderboardData = await leaderboardResponse.json();
                        setLeaderboard(leaderboardData || []);
                    }
                } catch (err) {
                    console.log('Leaderboard endpoint not available yet');
                }
                
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchUserData();
    }, []);

    const co2Saved = (totalRecycled * 0.4) * 0.6; // fake formula (NEEDS UPDATE!!!!)

    // Define small cards (Points, CO2 Saved, Items Recycled)
    const smallCards = [
        // Points card
        {
            title: "Your Points",
            icon: <EmojiEvents />,
            backgroundColor: "white",
            titleColor: "secondary.dark",
            cardInfo: (
                <Box>
                    <Typography variant="h2" sx={{ 
                        fontSize: '48px', 
                        fontWeight: 'bold', 
                        marginBottom: '8px',
                        color: 'dimgray'
                    }}>
                        {userPoints}
                    </Typography>
                </Box>
            ),
            width: 200,
            height: 150
        },
        // CO2 Saved card
        {
            title: "CO₂ Saved",
            icon: <Air />,
            backgroundColor: "white",
            titleColor: "secondary.dark",
            cardInfo: (
                <Box>
                    <Typography variant="h2" sx={{
                        marginBottom: '8px',
                        color: 'dimgray'
                    }}>
                        <Box component="span" sx={{ fontSize: '48px', fontWeight: 'bold' }}>{co2Saved.toFixed(1)}</Box>
                        <Box component="span" sx={{ fontSize: '18px', fontWeight: 'normal', color: 'darkgray' }}>lbs</Box>
                    </Typography>
                </Box>
            ),
            width: 200,
            height: 150
        },
        // Items scanned/recycled card
        {
            title: "Items Recycled",
            icon: <Recycling />,
            backgroundColor: "white",
            titleColor: "secondary.dark",
            cardInfo: (
                <Box>
                    <Typography variant="h2" sx={{
                        fontSize: '48px',
                        fontWeight: 'bold',
                        marginBottom: '8px',
                        color: 'dimgray'
                    }}>
                        {totalRecycled}
                    </Typography>
                </Box>
            ),
            width: 200,
            height: 150
        }
    ];

    // Define long cards (Leaderboard, History)
    const longCards = [
        // Leaderboard card
        {
            title: "Leaderboard",
            icon: <Leaderboard />,
            backgroundColor: "white",
            titleColor: "secondary.dark",
            cardInfo: (
                <Box 
                    sx={{ 
                        width: '100%', 
                        height: '100%', 
                        display: 'grid',
                        gridTemplateRows: 'repeat(5, 1fr)',
                        gap: 1.25
                    }}
                >
                    { /* Map through the leaderboard and display the top 5 users */ }
                    {leaderboard.length > 0 ? (
                        leaderboard.slice(0, 5).map((user, index) => (
                            <Box 
                                key={index}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                    px: 1.25,
                                    borderRadius: 2,
                                    backgroundColor: 'rgba(0,0,0,0.02)'
                                }}
                            >
                                { /* Display the user's rank and change color depending on that */ }
                                <Avatar 
                                    sx={{
                                        width: 44,
                                        height: 44,
                                        fontWeight: 800,
                                        bgcolor: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : 'primary.light',
                                        color: index < 3 ? 'black' : 'primary.dark',
                                        boxShadow: index < 3 ? 'inset 0 0 0 2px rgba(0,0,0,0.15)' : 'inset 0 0 0 2px rgba(0,0,0,0.05)'
                                    }}
                                >
                                    {index + 1}
                                </Avatar>

                                { /* Display the user's name and points */ }
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
                                    <Typography sx={{ fontWeight: index < 3 ? 700 : 500 }}>
                                        {user.name || user.username}
                                    </Typography>
                                    <Box sx={{ 
                                        px: 1.25, 
                                        py: 0.5, 
                                        borderRadius: 2, 
                                        bgcolor: 'rgba(0,0,0,0.06)', 
                                        color: 'text.secondary',
                                        fontWeight: 700,
                                        fontSize: '0.9rem'
                                    }}>
                                        {user.points} pts
                                    </Box>
                                </Box>
                            </Box>
                        ))
                    ) : (
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            height: '100%',
                            color: 'text.secondary'
                        }}>
                            <Typography variant="body2" sx={{ textAlign: 'center', fontStyle: 'italic' }}>
                                No leaderboard data available yet
                            </Typography>
                        </Box>
                    )}
                </Box>
            ),
            width: 300,
            height: 450
        },
        // History card
        {
            title: "History",
            icon: <History />,
            backgroundColor: "white",
            titleColor: "secondary.dark",
            cardInfo: (
                <Box 
                    sx={{ 
                        width: '100%', 
                        height: '100%', 
                        display: 'grid',
                        gridTemplateRows: 'repeat(5, 1fr)',
                        gap: 1.25
                    }}
                >
                    { /* Map through the history and display the last 5 scanned items */ }
                    {history.length > 0 ? (
                        history.slice(0, 5).map((item, index) => (
                            <Box 
                                key={index}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                    px: 1.25,
                                    borderRadius: 2,
                                    backgroundColor: 'rgba(0,0,0,0.02)'
                                }}
                            >
                                { /* Display the item icon */ }
                                <Avatar 
                                    sx={{
                                        width: 44,
                                        height: 44,
                                        fontWeight: 800,
                                        bgcolor: 'primary.light',
                                        color: 'primary.dark',
                                        boxShadow: 'inset 0 0 0 2px rgba(0,0,0,0.05)'
                                    }}
                                >
                                    <Recycling />
                                </Avatar>

                                { /* Display the item's name and points */ }
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
                                    <Typography sx={{ fontWeight: 700 }}>
                                        {item.name}
                                    </Typography>
                                    <Box sx={{ 
                                        px: 1.25, 
                                        py: 0.5, 
                                        borderRadius: 2, 
                                        bgcolor: 'rgba(0,0,0,0.06)', 
                                        color: 'text.secondary',
                                        fontWeight: 700,
                                        fontSize: '0.9rem'
                                    }}>
                                        {item.points} pts
                                    </Box>
                                </Box>
                            </Box>
                        ))
                    ) : (
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            height: '100%',
                            color: 'text.secondary'
                        }}>
                            <Typography variant="body2" sx={{ textAlign: 'center', fontStyle: 'italic' }}>
                                No user history available yet
                            </Typography>
                        </Box>
                    )}
                </Box>
            ),
            width: 300,
            height: 450
        }
    ];

    if (!token) {
        return (
        <>
            <main style={{ padding: '50px' }}>
            <p>You&apos;re not logged in.</p>
            </main>
        </>
        )
    }
    
    return (
        <ThemeProvider theme={theme}>
        
        {/* Main container for the dashboard */}
        <Container 
        maxWidth={false}
        disableGutters
        sx={{
            minHeight: '100vh',
            padding: '90px 20px',
            width: '100vw',
            background: 'linear-gradient(135deg, #D4BFED 0%, #FCD5E5 50%, #E5EEC8 100%)',
        }}
        >
            {/* Greetings section */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '30px' }}>
                <Typography variant="h2" sx={{ 
                    fontSize: '48px', 
                    fontWeight: 'bold',
                    marginBottom: '25px'
                }}>
                    <Box component="span" sx={{ color: 'dimgray' }}>Hi, </Box>
                    <Box component="span" sx={{ color: 'primary.dark' }}>{userName}</Box>
                    <Box component="span" sx={{ color: 'dimgray' }}>!</Box>
                </Typography>
                
                {/* Scan Button */}
                <Button
                    onClick={handleDetectionClick}
                    variant="contained"
                    startIcon={<CameraAlt sx={{ fontSize: '1.5rem' }} />}
                    sx={{
                        background: 'linear-gradient(135deg, #A8B87A 0%, #C4D399 100%)',
                        color: 'white',
                        textTransform: 'none',
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        px: 4,
                        py: 1.5,
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
                    Start Scanning
                </Button>
            </Box>

            {/* Grid container for small cards */}
            <Grid container spacing={3} justifyContent="center" sx={{ mb: 4 }}>
                {smallCards.map((card, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <CardComponent
                                title={card.title}
                                icon={card.icon}
                                backgroundColor={card.backgroundColor}
                                titleColor={card.titleColor}
                                cardInfo={card.cardInfo}
                                width={card.width}
                                height={card.height}
                            />
                        </Box>
                    </Grid>
                ))}
            </Grid>

            {/* Grid container for long cards */}
            <Grid container spacing={3} justifyContent="center">
                {longCards.map((card, index) => (
                    <Grid item xs={12} sm={6} md={6} key={index}>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <CardComponent
                                title={card.title}
                                icon={card.icon}
                                backgroundColor={card.backgroundColor}
                                titleColor={card.titleColor}
                                cardInfo={card.cardInfo}
                                width={card.width}
                                height={card.height}
                            />
                        </Box>
                    </Grid>
                ))}
            </Grid>

        </Container>
        </ThemeProvider>
    );
}

export default Dashboard;