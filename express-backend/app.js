// Main Express server file/ app setup

const express = require('express');
const cors = require('cors');
require('dotenv').config({path: './config.env'});
const mongoose = require('mongoose');

//const records = require('./routes/records.js');

const app = express();


//
app.use(cors());
app.use(express.json());

//routes
//app.use("/record", records)

//console.log('Mongo URI:', process.env.ATLAS_URIS); //debug: check if reading URIS correctly

// database connection
mongoose
.connect(process.env.ATLAS_URIS)
.then(() => console.log("DB Connected"))
.catch((err) => console.log("DB not connected"))

//export
module.exports = app;

