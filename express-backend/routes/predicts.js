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

// POINTS PER CATEGORY
const RECYCLINGPOINTS = {
  Cardboard: 5,
  Glass: 5,
  Paper: 5,
  Plastic: 5,
  Metal: 10,
  Battery: 20,
  Keyboard: 20,
  Microwave: 40,
  Mobile: 35,
  Mouse: 15,
  Organic: 5,
  PCB: 30,
  Player: 20,
  Printer: 35,
  Television: 60,
  Trash: 0,
  WashingMachine: 80
};

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

const updateUser = async (userID, detectionData) => {
  let user;
  try{
    user = await UserData.findOne({ userID });
    if (!user) {
      return res.status(403).json({ error: "No user found." });
    }
  } catch (error) {
    console.error('Error finding user:', error);
    return res.status(500).json({ error: 'Database error' });
  }
  const pointsInc = RECYCLINGPOINTS[detectionData.category] ?? 0;

  await UserData.updateOne(
    { _id: userID },
    { $inc: { points: pointsInc } },
    { $inc: {detectionsCount: 1} }
  );

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
  if (!prediction) {
    console.error('No prediction returned for file:', req.file.filename, 'response:', prediction);
    return res.status(500).json({ error: 'Prediction failed' });
  }

  // Normalize the expected response shape from the Flask server.
  // Expected shape: { annotated_image, counts, detections, top_category }
  const detectionsFromFlask = Array.isArray(prediction.detections) ? prediction.detections : [];
  const countsFromFlask = prediction.counts || {};
  const topCategory = prediction.top_category || null;

  // Choose category to store: prefer top_category.label, then the highest-count key, then first detection class_name
  let cat = null;
  if (topCategory && topCategory.label) {
    cat = topCategory.label;
  } else if (Object.keys(countsFromFlask).length > 0) {
    // pick the key with the highest count
    cat = Object.keys(countsFromFlask).reduce((a, b) => countsFromFlask[a] >= countsFromFlask[b] ? a : b);
  } else if (detectionsFromFlask.length > 0 && detectionsFromFlask[0].class_name) {
    cat = detectionsFromFlask[0].class_name;
  } else {
    cat = 'Unknown';
  }

  const newDetection = new DetectionData({
    userID: user._id,
    itemName: req.file.originalname,
    category: cat,
    timestamp: new Date(),
    // allow user to input quantity. used to calculate total environsavings from category
    quantity: quantity || 1,
    points: RECYCLINGPOINTS[cat] ?? 0
  });

  try {
    await newDetection.save();
  } catch (err) {
    console.error('Error saving detection:', err);
    return res.status(500).json({ error: 'Failed to save detection' });
  }

  // fetch detection environmental info
  let catInfo;
  try {
    // use case-insensitive match for category name to be more robust
    catInfo = await Category.findOne({ catName: { $regex: new RegExp(`^${cat}$`, 'i') } });
    if (!catInfo) {
      return res.status(404).json({ error: "No environmental info found." });
    }
  } catch (error) {
    console.error('Error querying category:', error);
    return res.status(500).json({ error: 'Database error' });
  }

  const infoData = typeof catInfo.toObject === 'function' ? catInfo.toObject() : catInfo;
  const detectionData = typeof newDetection.toObject === 'function' ? newDetection.toObject() : newDetection;

  // Build response constants (use detectionData and the Flask response)
  const message = "Detection successful";
  const info = infoData;
  const detect = detectionData;
  const filename = req.file.filename;

  // Normalize prediction object coming from Flask
  const predictionResponse = {
    annotated_image: prediction.annotated_image || prediction.annotatedImage || null,
    counts: prediction.counts || {},
    detections: Array.isArray(prediction.detections) ? prediction.detections : (prediction.predictions || []),
    top_category: prediction.top_category || prediction.topCategory || null
  };

  updateUser(user._id, cat);

  // return all info packaged to the frontend
  return res.status(200).json({
    message,
    info,
    detect,
    filename,
    prediction: predictionResponse
  });

});

module.exports = router;