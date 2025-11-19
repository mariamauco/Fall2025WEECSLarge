const express = require('express');
const Detection = require('../models/detection');
const UserData = require('../models/user');
const Category = require('../models/category');
const router = express.Router();

//GET /api/stats: This route should return a user’s points, and maybe how many recycled
router.get('/stats/:userId', async (req, res) => {
  try {
    //find user
    const user = await UserData.findById(req.params.userId)
    if (!user){
      return res.status(400).json({ error: 'User not found' });
    }

    res.status(200).json({name: user.name,
                          username: user.username, 
                          points: user.points,
                          recycled: user.detectionsCount || 0
                          }); //succesful
  } catch (err) {
    res.status(500).json({ error: 'Error getting user stats' });
  }
});

//GET /api/history: return all detections for user from detections collection in MongoDB 
router.get('/history/:userId', async (req, res) => {
  //TODO
  try {
    const userId = req.params.userId;

    //check if user exists, returns error if not
    const userExists = await UserData.findById(userId);
    if (!userExists) {
      return res.status(404).json({ error: 'User not found.' });
    }

    //finds detections linked to current user
    //sorts by newest detections to oldest
    const detections = await Detection.find({ userID: userId }).sort({ createdAt: -1 });

    // find total co2
    let totalCo2 = 0;
    if (detections.length > 0) {
      for (const det of detections) {
        // look up the category by name and get its co2
        const category = await Category.findOne({ catName: det.category });
        const co2 = category ? (Number(category.co2) || 0) : 0;
        totalCo2 += co2 * det.quantity; // add that co2 to the total
      }
    }
    
    //returns json of detections; json will be empty if no detections
    res.status(200).json({detections, totalCo2});

  } catch (err) {
    console.error('Error fetching user detection history:', err);
    res.status(500).json({ error: 'Error fetching user detection history' });
  }

});

//GET /api/leaderboard: route returns a leaderboard of top 5 users, sorted by points
router.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await UserData.find({}) //finds all users in db
      .sort({ points: -1 }) //sorts by 'points' field in descending order                      
      .limit(5) //gets top 5 users only
      .select('name username points -_id'); //only gets name, username, and points field (excludes id)

    res.status(200).json(leaderboard); //returns sorted json array

  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    res.status(500).json({ error: 'Error fetching leaderboard data' });
  }
});

module.exports = router;