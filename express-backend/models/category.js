const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
    catName:{type: String, required: true, unique: true},
    disposalInstructions:{type: String, required: true},
    environSavingsInfo:{
        co2: Number,
        energy: Number,
        water: Number
    } 
    // save co2, energy, and water savings in environSavingsInfo

})
//compile model from schema
const CategoryData= mongoose.model("Category",CategorySchema);

module.exports = CategoryData;