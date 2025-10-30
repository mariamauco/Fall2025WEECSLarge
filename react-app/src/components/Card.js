import React from 'react';
import { Box, Typography } from '@mui/material';

function Card({ title, icon, backgroundColor, cardInfo, width = 300, height = 200, titleColor = 'inherit' }) {
    return (
        <Box
            sx={{
                width: width,
                height: height,
                backgroundColor: backgroundColor,
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                padding: '20px'
            }}
        >
            {/* Title and icon centered at the top */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginBottom: '16px'
                }}
            >
                {icon && <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    color: titleColor 
                }}>
                    {icon}
                </Box>}
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 'bold',
                        color: titleColor
                    }}
                >
                    {title}
                </Typography>
            </Box>

            {/* Card info */}
            <Box
                sx={{
                    color: 'inherit',
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center'
                }}
            >
                {cardInfo}
            </Box>
        </Box>
    );
}

export default Card;

