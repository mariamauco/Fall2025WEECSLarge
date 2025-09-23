// Start server here

//import express from "express";

const PORT = process.env.PORT || 5050; //http://localhost:5050/
const app = require('./app');

//start express server
app.listen(PORT,() => {
    console.log(`Server listening on port ${PORT}`);
})