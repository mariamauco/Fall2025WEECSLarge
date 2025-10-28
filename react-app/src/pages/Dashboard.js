import * as React from 'react';
import {Container, TextField, Typography, Box, Button, createTheme, ThemeProvider, Card, InputAdornment} from '@mui/material';
import { EmojiEvents } from '@mui/icons-material';
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
            <CardComponent
                title="Your Points"
                icon={<EmojiEvents />}
                backgroundColor="white"
                titleColor="secondary.dark"
                cardInfo={
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
                }
                width={200}
                height={150}
            />
        </Container>
        </ThemeProvider>
    );
}

export default Dashboard;