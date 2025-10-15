// For users API
const express = require("express");
const jwt = require("jsonwebtoken");


const { ObjectId } = require("mongodb");
const db = require("../db/connection.js");

const router = express.Router()

//const JWT_SECRET = process.env.JWT_SECRET //jwt secret key


//register user
router.post("/register", async (req,res) =>{
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

module.exports = router;
