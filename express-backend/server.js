// Start server here

//import express from "express";

const PORT = process.env.PORT || 5050; //http://localhost:5050/
const app = require('./app');

app.get("/", (req, res) => {
  res.send("Server is running and connected to the database");
});


//start express server
app.listen(PORT,() => {
    console.log(`Server listening on port ${PORT}`);
})