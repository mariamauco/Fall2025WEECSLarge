const mongoose = require("mongoose");

const DetectionSchema = new mongoose.Schema({

    userID:{type: Number, required: true},
    itemName:{type: String, required: true},
    category:{type: String, required: true},
    timestamp:{type: Date, default: Date.now},
    environSavings:{type: Number, default: 0}
    //consider co2 savings or something else

})

//compile model from schema
const DetectionData = mongoose.model("Detection",DetectionSchema);
module.exports = DetectionData;