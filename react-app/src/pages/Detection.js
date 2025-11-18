import * as React from 'react';
import { useRef, useState, useEffect } from "react";
import { Box, Paper, Button, Container, createTheme, ThemeProvider, Typography, CircularProgress, Backdrop } from "@mui/material";
import { Air, EmojiEvents, CheckCircle, Cancel, SignalCellularNullTwoTone } from '@mui/icons-material';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';
import wasteImage from "../assets/waste_placeholder.jpg";

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
    
    // detection info to display
    const [predictionResponse, setPredictionResponse] = useState({
        message: '',
        info: {
            catName: '',
            desc: '',
            disposalInfo: '',
            links: [],
            co2: null,
            energy: null,
            water: null
        },
        detect: {
            quantity: 0,
            points: 0
        },
        prediction: {
            annotated_image: null,
            top_category: {
                confidence: null
            }
        }
    });

    const [uploadError, setUploadError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [token, setToken] = useState(null);
    const [userName, setUserName] = useState("Guest");
    const [detection, setDetection] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const storedToken = localStorage.getItem('token');
                if(storedToken){
                    setToken(storedToken);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, []);

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
        
        setIsLoading(true);
        setMessage(null);
        
        try{
            const form = new FormData();
            // Multer expects the file field to be named "image"
            form.append('image', selectedFile, selectedFile.name); 

            const user = localStorage.getItem('user') || 'testuser';
            form.append('username', JSON.parse(user).username); // parse the user json before passing the username
            form.append('quantity', '1');

            const token = localStorage.getItem('token'); // example
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            // const response = await fetch('http://localhost:5050/api/predict',{ // if running server locally
            const response = await fetch('http://138.197.16.179:5050/api/predict/detect',{
                method: 'POST',
                headers,
                body: form // passes the image using multer
            });

            if(response.ok){
                const data = await response.json();
                // data shape: { message, info, detect, filename, prediction }
                setDetection(data.detect || null);

                // Normalize predictionResponse for UI
                const pred = data.prediction || {};
                const thisPrediction = {
                    message: data.message || '',
                    info: data.info || predictionResponse.info,
                    detect: data.detect || predictionResponse.detect,
                    prediction: {
                        annotated_image: pred.annotated_image || pred.annotatedImage || null,
                        counts: pred.counts || {},
                        detections: Array.isArray(pred.detections) ? pred.detections : (pred.predictions || []),
                        top_category: pred.top_category || pred.topCategory || null
                    }
                };

                setPredictionResponse(thisPrediction);

                // If server returned an annotated image, show it in place of the preview
                if (thisPrediction.prediction.annotated_image) {
                    // revoke old object URL if it was created
                    if (previewUrl && previewUrl.startsWith('blob:')) {
                        URL.revokeObjectURL(previewUrl);
                    }
                    setPreviewUrl(thisPrediction.prediction.annotated_image);
                }

                setMessage('Detection saved');
                setMessageType('success');
            }
            else{
                setDetection(null);
                setPredictionResponse(null);
                setMessage('Detection failed');
                setMessageType('error');
            }

            
           

        }catch(error){
                console.error('Upload error', error);
                setUploadError('Network error');
                setPredictionResponse(null);
                setMessage('Network error occurred');
                setMessageType('error');
        } finally {
            setIsLoading(false);
        }
    };

    // NEXT TO IMPLEMENT: DISPLAY THE RESPONSE


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
            <Container 
                maxWidth={false}
                disableGutters
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100vw',
                    background: 'linear-gradient(135deg, #D4BFED 0%, #FCD5E5 50%, #E5EEC8 100%)',
                    paddingTop: '90px',
                    paddingBottom: '40px',
                    paddingX: 0,
                    margin: 0,
                    gap: 4
                }}
            >
            {/* Loading Backdrop */}
            <Backdrop
                open={isLoading}
                sx={{
                    color: '#fff',
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3
                }}
            >
                <CircularProgress 
                    size={80} 
                    thickness={4}
                    sx={{ 
                        color: theme.palette.primary.light 
                    }} 
                />
                <Typography 
                    variant="h5" 
                    sx={{ 
                        color: '#fff',
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }}
                >
                    Scanning your item...
                </Typography>
                <Typography 
                    variant="body1" 
                    sx={{ 
                        color: 'rgba(255, 255, 255, 0.8)',
                        textAlign: 'center'
                    }}
                >
                    This may take a few seconds
                </Typography>
            </Backdrop>

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
                    disabled={isLoading}
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
                        },
                        "&:disabled": {
                            backgroundColor: "#f5f5f5",
                            color: "#ccc"
                        }
                    }}>
                    {isLoading ? 'Detecting...' : 'Submit'}
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

            {/* Stats Card */}
            <Paper
                    elevation={3}
                    sx={{
                        width: 350,
                        borderRadius: 3,
                        backgroundColor: "#fff",
                        padding: 3,
                        marginTop: 2,
                        border: "2px solid #E0E0E0"
                    }}
                >
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {predictionResponse.info.catName !== "Trash" ? (
                            <>
                                {/* Item Name */}
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontWeight: 'bold',
                                        color: theme.palette.primary.dark,
                                        textAlign: 'center',
                                        mb: 1
                                    }}
                                >
                                    {predictionResponse.info.catName || 'Recyclable Item'}
                                </Typography>

                                {/* Top category and counts */}
                                {predictionResponse.prediction?.top_category?.label && (
                                    <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary', mb: 1 }}>
                                        {predictionResponse.prediction.top_category.label} ({(predictionResponse.prediction.top_category.confidence || 0).toFixed(2)*100}% Confidence) 
                                    </Typography>
                                )}
                                {predictionResponse.prediction?.counts && Object.keys(predictionResponse.prediction.counts).length > 0 && (
                                    <Box sx={{ textAlign: 'center', color: 'text.secondary', mb: 1 }}>
                                        {Object.entries(predictionResponse.prediction.counts).map(([k,v]) => (
                                            <Typography key={k} variant="caption" sx={{ display: 'block' }}>{k}: {v}</Typography>
                                        ))}
                                    </Box>
                                )}

                                {/* Recycle Pink Box */}
                                {/* Only if there's a detection */}
                                {predictionResponse.info.disposalInfo && (
                                    <Box sx={{
                                            backgroundColor: theme.palette.secondary.light,
                                            borderRadius: 2,
                                            padding: 2,
                                            mb: 2,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 1.5,
                                            textAlign: 'center'
                                        }}>
                                        {/* Recycle Indicator */}
                                        <Box
                                            sx={{
                                            backgroundColor: theme.palette.secondary.light,
                                            mt: 2,
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <CheckCircle sx={{ fontSize: 32, color: theme.palette.primary.dark }} />
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.secondary.dark }}>
                                            Recycle
                                            </Typography>
                                        </Box>
                                        {/* Disposal Information */}
                                            <Typography variant="body1" sx={{ color: 'dimgray', mb: 1 }}>
                                                {predictionResponse.info.disposalInfo}
                                            </Typography>

                                            {Array.isArray(predictionResponse.info.links) && predictionResponse.info.links.length > 0 && (
                                                <Box sx={{ width: '100%', textAlign: 'left', mt: 1 }}>
                                                    <Typography variant="subtitle2" sx={{ color: theme.palette.primary.dark, mb: 0.5 }}>
                                                        Some helpful links to learn more:
                                                    </Typography>
                                                    {predictionResponse.info.links.map((link, idx) => (
                                                        <Typography key={idx} variant="body2" sx={{ color: 'text.secondary', wordBreak: 'break-word' }}>
                                                            {link}
                                                        </Typography>
                                                    ))}
                                                </Box>
                                            )}
                                        </Box>
                                    )}
                                <Box
                                    sx={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(2, 1fr)',
                                        gap: 2,
                                        mb: 2
                                    }}
                                >
                                    {/* CO2 Saved */}
                                    {predictionResponse.info.co2 !== undefined && (
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Air sx={{ fontSize: 32, color: theme.palette.primary.dark, mb: 0.5 }} />
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'dimgray' }}>
                                                {(predictionResponse.info.co2 * (predictionResponse.detect?.quantity || 1)).toFixed(1)}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'darkgray' }}>
                                                CO₂ (lbs)
                                            </Typography>
                                        </Box>
                                    )}
                                    {/* Energy Saved */}
                                    {predictionResponse.info.energy !== undefined && (
                                        <Box sx={{ textAlign: 'center' }}>
                                            <EnergySavingsLeafIcon sx={{ fontSize: 32, color: theme.palette.primary.dark, mb: 0.5 }} />
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'dimgray' }}>
                                                {(predictionResponse.info.energy * (predictionResponse.detect?.quantity || 1)).toFixed(1)}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'darkgray' }}>
                                                Energy (kWh)
                                            </Typography>
                                        </Box>
                                    )}
                                    {/* Water Saved */}
                                    {predictionResponse.info.water !== undefined && (
                                        <Box sx={{ textAlign: 'center' }}>
                                            <WaterDropIcon sx={{ fontSize: 32, color: theme.palette.primary.dark, mb: 0.5 }} />
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'dimgray' }}>
                                                {(predictionResponse.info.water * (predictionResponse.detect?.quantity || 1)).toFixed(1)}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'darkgray' }}>
                                                Water (liters)
                                            </Typography>
                                        </Box>
                                    )}

                                    {/* Points Earned */}
                                    {predictionResponse.detect.points !== undefined && (
                                        <Box sx={{ textAlign: 'center' }}>
                                            <EmojiEvents sx={{ fontSize: 32, color: theme.palette.primary.dark, mb: 0.5 }} />
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'dimgray' }}>
                                                {predictionResponse.detect.points}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'darkgray' }}>
                                                Points
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </>
                        ) : (
                            <>
                                {/* Trash Title */}
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontWeight: 'bold',
                                        color: theme.palette.primary.dark,
                                        textAlign: 'center',
                                        mb: 1
                                    }}
                                >
                                    Trash
                                </Typography>

                                {/* Trash Indicator */}
                                <Box
                                    sx={{
                                        backgroundColor: theme.palette.secondary.light,
                                        borderRadius: 2,
                                        padding: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 1.5
                                    }}
                                >
                                    <Cancel sx={{ fontSize: 32, color: theme.palette.secondary.dark }} />
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.secondary.dark }}>
                                        Throw Away
                                    </Typography>
                                </Box>
                            </>
                        )}
                    </Box>
                </Paper>
            </Container>
        </ThemeProvider>
    );
}

export default Detection;