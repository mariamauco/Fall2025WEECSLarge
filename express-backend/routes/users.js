// For users API
const express = require("express");
const bcrypt = require("bcryptjs"); //safely compares entered pass to hashed pass in db
const jwt = require("jsonwebtoken"); //provides secure login token
const UserData = require("./models/user.js"); //path to schema file
const router = express.Router(); //attach to server.js later

router.post("/Login", async (req, res) => {
  try{
    const { email, password } = req.body;

    //find user by email
    const user = await UserData.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    //compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    //create a token if email and pass are correct
    const token = jwt.sign(
      { id: user._id, username: user.username },
      "secret key from .env", //need to change to a env. variable
      { expiresIn: "1h" }
    );

    //send response to frontend
    res.json({
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        points: user.points
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; //can import so server.js can use /login route