const multer = require('multer'); // to install: npm install multer
const path = require('path');
const DetectionData = require('../models/detection.js');
const Category = require('../models/category.js');
const express = require("express");
const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs"); //safely compares entered pass to hashed pass in db
const jwt = require("jsonwebtoken"); //provides secure login token
const UserData = require("../models/user.js"); //path to schema file
const router = express.Router(); //attach to server.js later
const db = require("../db/connection.js");
//const JWT_SECRET = process.env.JWT_SECRET //jwt secret key

// NEED TO TEST: ADD TEST CATEGORY TO DATABASE


// Configure Multer for file storage
const fs = require('fs');

// Use an absolute uploads path relative to the project root
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
// Ensure the directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, UPLOAD_DIR); // absolute directory to save uploaded images
  },
  filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// sends the image user uploaded to the flask server for detection
const FormData = require('form-data'); // to install: npm install form-data
const fetch = require('node-fetch'); // to install: npm install form-data node-fetch@2

const handleDetect = async (file) => {
  try {
    // send the actual file as multipart/form-data to the flask server
    const form = new FormData();
    // multer sets file.path relative to project (e.g. 'uploads/xxxx'), make absolute
    // file.path will now be absolute because we set UPLOAD_DIR above
    const filePath = file.path;
    form.append('image', fs.createReadStream(filePath));
    form.append('filename', file.filename);

    const response = await fetch('http://138.197.16.179:5055/predict', {
      method: 'POST',
      headers: form.getHeaders(),
      body: form
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('Prediction failed', response.status, text);
      return null;
    }

    const data = await response.json(); // waits for prediction
    return data;
  } catch (error) {
    console.error('Error prediction in:', error);
    return null;
  }
}

router.post('/detect', upload.single('image'), async (req, res) => {
  console.log('Upload request, req.file =', req.file);
  if (!req.file) {
    return res.status(400).send('No image uploaded.');
  }

  // read expected fields from request body
  const { username, quantity } = req.body;

  // find user in database
  let user;
  try {
    user = await UserData.findOne({ username }); // Check if user exists
    if (!user) {
      return res.status(403).json({ error: "No user found." });
    }
  } catch (error) {
    console.error('Error finding user:', error);
    return res.status(500).json({ error: 'Database error' });
  }

  // call detection service and wait for result
  const prediction = await handleDetect(req.file);
  if (!prediction || !prediction.prediction) {
    console.error('No prediction returned for file:', req.file.filename, 'response:', prediction);
    return res.status(500).json({ error: 'Prediction failed' });
  }
  const cat = prediction.prediction;

  const newDetection = new DetectionData({
    userID: user._id,
    itemName: req.file.originalname,
    category: cat,
    timestamp: new Date(),
    // allow user to input quantity. used to calculate total environsavings from category
    quantity: quantity || 1
  });

  try {
    await newDetection.save();
  } catch (err) {
    console.error('Error saving detection:', err);
    return res.status(500).json({ error: 'Failed to save detection' });
  }

  // fetch detection environmental info
  let info;
  try {
    info = await Category.findOne({ catName: cat });
    if (!info) {
      return res.status(404).json({ error: "No environmental info found." });
    }
  } catch (error) {
    console.error('Error querying category:', error);
    return res.status(500).json({ error: 'Database error' });
  }

  const infoData = typeof info.toObject === 'function' ? info.toObject() : info;
  const detectionData = typeof newDetection.toObject === 'function' ? newDetection.toObject() : newDetection;

  // return all info packaged to the frontend
  return res.status(200).json({
    message: "Detection successful",
    info: infoData,
    detect: detectionData,
    filename: req.file.filename,
    prediction
  });

});

module.exports = router;