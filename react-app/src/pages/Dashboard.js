import * as React from 'react';
import { Container, TextField, Typography, Box, Button, createTheme, ThemeProvider, Card, InputAdornment, Grid, Avatar } from '@mui/material';
import { EmojiEvents, Air, Leaderboard, History, Recycling } from '@mui/icons-material';
import CardComponent from '../components/Card';

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
    // Dummy data (for now)
    const userPoints = 100;
    const userName = "John Doe";
    const leaderboard = [
        {
            name: "John Doe",
            points: 100
        },
        {
            name: "Jane Doe",
            points: 90
        },
        {
            name: "Jim Doe",
            points: 80
        },
        {
            name: "Jill Doe",
            points: 70
        },
        {
            name: "Jack Doe",
            points: 60
        }
    ];
    const history = [
        {
            name: "Plastic Bottle",
            points: 100
        },
        {
            name: "Metal Can",
            points: 100
        },
        {
            name: "Paper",
            points: 100
        },
        {
            name: "Glass Bottle",
            points: 100
        },
        {
            name: "Cardboard",
            points: 100
        }
    ];

    // Define all the cards that will be displayed on the dashboard in order
    const cards = [
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
            title: "CO2 Saved",
            icon: <Air />,
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
                    {leaderboard.slice(0, 5).map((user, index) => (
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
                                    {user.name}
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
                    ))}
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
                    {history.slice(0, 5).map((item, index) => (
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
                    ))}
                </Box>
            ),
            width: 300,
            height: 450
        }
    ];
    
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
            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <Typography variant="h2" sx={{ 
                    fontSize: '48px', 
                    fontWeight: 'bold'
                }}>
                    <Box component="span" sx={{ color: 'dimgray' }}>Hi, </Box>
                    <Box component="span" sx={{ color: 'primary.dark' }}>{userName}</Box>
                    <Box component="span" sx={{ color: 'dimgray' }}>!</Box>
                </Typography>
            </Box>

            {/* Grid container for the cards */}
            <Grid container spacing={3} justifyContent="center">
                {/* Map through the cards and display them */}
                {cards.map((card, index) => (
                    // Each card is a grid item
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

        </Container>
        </ThemeProvider>
    );
}

export default Dashboard;