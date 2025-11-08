// For users API
const express = require("express");
const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs"); //safely compares entered pass to hashed pass in db
const jwt = require("jsonwebtoken"); //provides secure login token
const UserData = require("../models/user.js"); //path to schema file
const router = express.Router(); //attach to server.js later
const db = require("../db/connection.js");
//const JWT_SECRET = process.env.JWT_SECRET //jwt secret key

// router.get("/userStats")

// router.get("/history") //consider deleting if history is inside userStats

router.post("/login", async (req, res) => {
  try{
    const { email, password } = req.body;
    //find user by email or username
    const identifier = (req.body.email || req.body.username || '').trim().toLowerCase();
    const user = await UserData.findOne({
      $or: [
        { email: identifier },
        { username: identifier }
      ]
    });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Compare passwords with hashing
    const isMatch = await bcrypt.compare(password, user.password); 
    //const isMatch = password === user.password;

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


//register/signing up user
router.post("/signup", async (req,res) =>{
    //API 
    try{
      console.log('Signup request body:', req.body);
    const{name, username, email, password} = req.body;
    if(!name || !username || !email || !password){ 
      return res.status(400).json({error:"All fields required"});
    }

    // normalize inputs (store email and username in lowercase to match login lookup)
    const normalizedUsername = String(username).trim().toLowerCase();
    const normalizedEmail = String(email).trim().toLowerCase();
    const displayName = String(name).trim();

    //check if user exists (username)
    const userExists = await UserData.findOne({ username: normalizedUsername });
    if(userExists){
      return res.status(400).json({error:"Username already exists"});
    }
    //check if user exists (email)
    const emailExists = await UserData.findOne({ email: normalizedEmail });
    if(emailExists){
      return res.status(400).json({error:"Email already linked to an account"});
    }

    //hash password, 11 salt rounds
    const hashPassword = await bcrypt.hash(password,11);

    //create user: ensure the hashed password is stored under the 'password' field
        const newUser = {
      name: displayName,
      username: normalizedUsername,
      email: normalizedEmail,
      password: hashPassword
    };
        console.log('Creating new user object:', newUser);
        const result = await UserData.create(newUser);

        if(result && result._id){
            res.status(200).json({message: "Registered succesfully", userId: result._id}) //return insert res

        } else{
            res.status(500).json({error: "Failed to create new user"});
        }   

  }catch(err){
    console.error('Signup error:', err);
    // return the validation message to help debugging (strip in production)
    const msg = err && err.message ? err.message : 'Error registering user';
    res.status(500).json({error: msg});
  }
} )//200 if created, 500 if not created

module.exports = router; //can import so server.js can use /login route
