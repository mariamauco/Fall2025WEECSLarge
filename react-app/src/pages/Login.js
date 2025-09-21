import * as React from 'react';
import {Container, TextField, Typography, Box, Button, FormControl, InputLabel, Input, FormHelperText, createTheme, ThemeProvider} from '@mui/material';

let theme = createTheme({

});
theme = createTheme(theme, {
    palette:{
        primary:{
            main: '#619111'
        }
    }
})

function Login() {
    return (
        <ThemeProvider theme={theme}>
        {/* This fills the entire screen and splits into two */}
        <Container 
        maxWidth={false}
        disableGutters
        sx={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'row',
            width: '100vw',
        }}
        >
        <Container
            sx={{
                height: '100vh',
                display:'flex',
                flexDirection: 'column',
                width: '40vw',
                backgroundColor:'#394508',
                marginLeft:'0px'
            }}> 
            <Container sx={{display:'flex', flexDirection: 'row', height:'5vh', margin:'1vh'}}>
                <Typography variant="h6" sx={{ color: 'white', marginRight:'35vh', padding:'1vh' }}
                >A Waste Sorting App</Typography>
                <Button sx={{backgroundColor:'#D2FD9C', color: 'black', padding:'1vh', margin:'8px', borderRadius: '5px'}} >Get Started</Button>
            </Container>

            <Box sx={{margin:'1vh', marginTop:'3vh'}}>
                <Typography variant="h2" sx={{ color: 'white'}}>
                    Recyclying Made 
                </Typography>
                <Typography variant="h2" sx={{ color: '#D2FD9C'}}>
                    Easy
                </Typography>
            </Box>

            <Box sx={{display:'flex', flexDirection: 'column', justifyContent:'center', alignItems:'center'}}// Log In form 
            >
                <Container sx={{display:'flex', flexDirection: 'row', justifyContent:'center', margin:'3vh'}}>
                    <Typography variant="h2" sx={{ color: 'white', marginRight:'1vh'}}>Log In</Typography>
                    <Typography variant="h2" sx={{ color: '#A5CEA0', marginLeft:'1vh'}}>Sign In</Typography>
                </Container>
                <TextField 
                    id="outlined-basic" 
                    label="Enter Username/Email" 
                    variant="outlined"
                    sx={{marginBottom:'2vh',width:'35vh', 
                        '& .MuiOutlinedInput-root': { 
                            backgroundColor: 'primary.main', 
                            color:'#ffffff', 
                            borderRadius: '15px', 
                            '& fieldset': {borderColor: 'white !important'}
                        },'& .MuiInputLabel-root':{ color: '#97CA8B'}
                    }}
                />
                <TextField 
                    id="outlined-basic" 
                    label="Enter Password" 
                    variant="outlined"
                    sx={{
                        marginBottom:'2vh', 
                        width:'35vh', 
                        '& .MuiOutlinedInput-root': { 
                            backgroundColor: 'primary.main', 
                            color:'#ffffff', 
                            borderRadius: '15px',
                            '& fieldset': { borderColor: 'white !important'}
                        },'& .MuiInputLabel-root':{ color: '#97CA8B'}
                    }}
                />
                <Button sx={{width:'10vh',padding:'1vh',backgroundColor:'primary.main', color:'white', borderRadius: '15px',borderColor: 'white', border:'1px solid white'}}>Log In</Button>
            </Box>
            

            </Container>



            <Container
            sx={{
                height: '100vh',
                display:'flex',
                flexDirection: 'row',
                width: '40vw',
                backgroundColor:'#ffffffff'
            }}>

            </Container>
            
        </Container>
        </ThemeProvider>
    );
}

export default Login;