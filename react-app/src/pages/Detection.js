import * as React from 'react';
import { useRef, useState, useEffect } from "react";
import { Box, Paper, Button, Container, createTheme, ThemeProvider, Typography } from "@mui/material";
import wasteImage from "../assets/waste_placeholder.jpg";
import { useNavigate } from 'react-router-dom';

let theme = createTheme({});
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
});

function Detection() {
    const fileInputRef = useRef(null);
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState('error'); // 'error' | 'success'
    const [predictionResponse, setPredictionResponse] = useState(null);
    const [uploadError, setUploadError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log("Selected file:", file.name);
            setSelectedFile(file);
            // create a preview URL for the selected file
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        } else {
            setSelectedFile(null);
            setPreviewUrl(null);
        }
    };

    const handleSubmit = async () => {
        if (!previewUrl){
            setMessage("Please enter an image")
            return;
        }
        try{
            const form = new FormData();
            // Multer expects the file field to be named "image"
            form.append('image', selectedFile, selectedFile.name); 

            const username = localStorage.getItem('username') || 'testuser';
            form.append('username', username);
            form.append('quantity', '1');

            const token = localStorage.getItem('token'); // example
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            // const response = await fetch('http://localhost:5050/api/predict',{ // if running server locally
            const response = await fetch('http://138.197.16.179:5050/api/predict',{
                method: 'POST',
                headers,
                body: form // passes the image using multer
            });

            const data = await response.json();
            // IF SUCESSFUL THIS RETURNS: 
            //    return res.status(200).json({
            //    message: "Detection successful",
            //    info: infoData, // this is the disposal and savings info (follows schema)
            //    detect: detectionData, // this is the detection (follows schema)
            //    filename: req.file.filename,
            //    prediction
            //  });

            // IMPLEMENT REST OF HANDLESUBMIT

            // handle if response is not ok

            // handle if response is ok: save the full response to display in the UI

        }catch(error){
                console.error('Upload error', error);
                setUploadError('Network error');
                setPredictionResponse(null);
        }
    };

    // NEXT TO IMPLEMENT: DISPLAY THE RESPONSE

    return (
        <ThemeProvider theme={theme}>
            <Container 
                maxWidth={false}
                disableGutters
                sx={{
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100vw',
                    background: 'linear-gradient(135deg, #D4BFED 0%, #FCD5E5 50%, #E5EEC8 100%)',
                    padding: 0,
                    margin: 0,
                    gap: 4
                }}
            >
            {message && (
                <Typography sx={{ color: messageType === 'error' ? 'red' : 'green', mb: 2 }}>
                    {message}
                </Typography>
            )}

            {/* Camera Box */}
            <Paper
                elevation={3}
                sx={{
                    width: 350,
                    height: 350,
                    borderRadius: 3,
                    backgroundColor: "#fff",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 3,
                    position: "relative",
                    border: "2px solid #E0E0E0"
                }}
            >
                {/* Corner brackets for camera frame effect */}
                <Box
                    sx={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        top: 0,
                        left: 0,
                        pointerEvents: "none"
                    }}
                >
                    {/* Top-left corner */}
                    <Box
                        sx={{
                            position: "absolute",
                            top: 15,
                            left: 15,
                            width: 30,
                            height: 30,
                            borderLeft: "5px solid #666",
                            borderTop: "5px solid #666"
                        }}
                    />
                    {/* Top-right corner */}
                    <Box
                        sx={{
                            position: "absolute",
                            top: 15,
                            right: 15,
                            width: 30,
                            height: 30,
                            borderRight: "5px solid #666",
                            borderTop: "5px solid #666"
                        }}
                    />
                    {/* Bottom-left corner */}
                    <Box
                        sx={{
                            position: "absolute",
                            bottom: 15,
                            left: 15,
                            width: 30,
                            height: 30,
                            borderLeft: "5px solid #666",
                            borderBottom: "5px solid #666"
                        }}
                    />
                    {/* Bottom-right corner */}
                    <Box
                        sx={{
                            position: "absolute",
                            bottom: 15,
                            right: 15,
                            width: 30,
                            height: 30,
                            borderRight: "5px solid #666",
                            borderBottom: "5px solid #666"
                        }}
                    />
                </Box>

                {/* Placeholder waste image */}
                <Box
                    sx={{
                        width: 300,
                        height: 300,
                        borderRadius: "50%",
                        marginTop: 0
                    }}
                >
                    <Box
                        component="img"
                        src={previewUrl || wasteImage}
                        alt={previewUrl ? "Selected file preview" : "Plastic waste"}
                        sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover"
                        }}
                    />
                </Box>

            </Paper>

            {/* Buttons */}
            <Box
                sx={{
                    display: "flex",
                    gap: 3,
                    marginTop: 2
                }}
            >
                <Button
                    variant="contained"
                    size="large"
                    onClick={handleUploadClick}
                    sx={{
                        borderColor: theme.palette.secondary.dark,
                        color: theme.palette.secondary.dark,
                        backgroundColor: "#fff",
                        borderRadius: 2,
                        paddingX: 4,
                        paddingY: 1.5,
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        textTransform: "none",
                        minWidth: 150,
                        "&:hover": {
                            borderColor: theme.palette.secondary.dark,
                            backgroundColor: theme.palette.secondary.light,
                            color: theme.palette.secondary.dark
                        }
                    }}
                >
                    Upload Image
                </Button>

                <Button
                    variant="contained"
                    size="large"
                    onClick={handleSubmit}
                    sx={{
                        borderColor: theme.palette.secondary.dark,
                        color: theme.palette.secondary.dark,
                        backgroundColor: "#fff",
                        borderRadius: 2,
                        paddingX: 4,
                        paddingY: 1.5,
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        textTransform: "none",
                        minWidth: 150,
                        "&:hover": {
                            borderColor: theme.palette.secondary.dark,
                            backgroundColor: theme.palette.secondary.light,
                            color: theme.palette.secondary.dark
                        }
                    }}>
                    Submit
                </Button>

                {/* File input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                />
            </Box>
            </Container>
        </ThemeProvider>
    );
}

export default Detection;