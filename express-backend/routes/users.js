// For users API
const express = require("express");
const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs"); //safely compares entered pass to hashed pass in db
const jwt = require("jsonwebtoken"); //provides secure login token
const UserData = require("./models/user.js"); //path to schema file
const router = express.Router(); //attach to server.js later
const db = require("../db/connection.js");
//const JWT_SECRET = process.env.JWT_SECRET //jwt secret key


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


//register/signing up user
router.post("/SignUp", async (req,res) =>{
    //API 
    try{
        const{name, username, email, password} = req.body;
        if(!name | !username || !email || !password){
            return res.status(400).json({error:"All fields required"});
        }

        const collection = await db.collection("users");
        
        //check if user exists (email)
        const exists = await collection.findOne({email});
        if(exists){
            return res.status(400).json({error:"User already exists"});
        }

        //create user: look how to link to schema:
        const newUser = {
            name,
            username,
            email,
            password
        };
        const result = await collection.insertOne(newUser);

        if(result.acknowledged){
            res.status(200).json({message: "Registered succesfully", userId: result.insertedId})

        } else{
            res.status(500).json({error: "Failed to create new user"});
        }   

    }catch(err){
        console.error(err);
        res.status(500).json({error: "Error registering user"});
    }
} )//200 if created, 500 if not created

module.exports = router; //can import so server.js can use /login route
