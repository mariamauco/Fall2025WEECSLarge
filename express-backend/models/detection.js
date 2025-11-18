const mongoose = require("mongoose");

const DetectionSchema = new mongoose.Schema({
    // this makes sure the userID is referencing an actual user from user document
    userID:{type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}, 
    itemName:{type: String, required: true},
    // references a specific category instance instead of the name of it
    category:{type: String, ref: "Category", required: true},
    // allow user to input quantity. used to calculate total environsavings from category
    quantity:{type: Number, default: 1},
    points:{type: Number, default: 0}

}, {timestamps: true}
)

//compile model from schema
const DetectionData = mongoose.model("Detection", DetectionSchema, "Detection");
module.exports = DetectionData;