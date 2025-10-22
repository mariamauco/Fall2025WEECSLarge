// Main Express server file
const express = require('express');
require('dotenv').config();
const app = express();
const {mongoose} = require('mongoose');


// database
mongoose
.connect(process.env.MONGO_URL)
.then(() => console.log("DB Connected"))
.catch((err) => console.log("DB not connected"))

