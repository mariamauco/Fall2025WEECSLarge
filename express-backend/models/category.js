const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
    catName:{type: String, required: true},
    disposalInstructions:{type: String, required: true},
    environSavingsInfo:{type: Number, default: 0} 
    //consider co2 savings or something else

})
//compile model from schema
const CategoryData= mongoose.model("Category",CategorySchema);

module.exports = CategoryData;