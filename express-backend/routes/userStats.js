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

    res.status(200).json({username: user.username, 
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
});

module.exports = router;