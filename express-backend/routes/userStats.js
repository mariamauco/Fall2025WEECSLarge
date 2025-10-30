const express = require('express');
const Detection = require('../models/detection');
const UserData = require('../models/user');
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

    //returns json of detections; json will be empty if no detections
    res.status(200).json(detections);

  } catch (err) {
    console.error('Error fetching user detection history:', err);
    res.status(500).json({ error: 'Error fetching user detection history' });
  }

});

module.exports = router;