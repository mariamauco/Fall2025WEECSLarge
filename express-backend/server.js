const PORT = process.env.PORT || 5050; //http://localhost:5050/
const app = require('./app');
const multer = require('multer');
const path = require('path');
const User = require('./models/User');
const DetectionData = require('./models/DetectionData');
const Category = require('./models/Category');

// Configure Multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Directory to save uploaded images
  },
  filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// sends the image user uploaded to the flask server for detection
const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');

const handleDetect = async (file) => {
  try {
    // send the actual file as multipart/form-data to the flask server
    const form = new FormData();
    // multer sets file.path relative to project (e.g. 'uploads/xxxx'), make absolute
    const filePath = path.join(__dirname, file.path);
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

app.post('/api/detect', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No image uploaded.');
  }

  // read expected fields from request body
  const { username, quantity } = req.body;

  // find user in database
  let user;
  try {
    user = await User.findOne({ username }); // Check if user exists
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
    info = await Category.findOne({ name: cat });
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

app.get("/", (req, res) => {
  res.send("Server is running and connected to the database");
});


//start express server
app.listen(PORT,() => {
    console.log(`Server listening on port ${PORT}`);
})