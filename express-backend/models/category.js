const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
    catName:{type: String, required: true, unique: true},
    disposalInfo:{type: String, required: true},
    desc: {type: String},
    co2: Number,
    energy: Number,
    water: Number,
    links: {type: String}
})
//compile model from schema
const CategoryData = mongoose.model("Category", CategorySchema, "categories");

module.exports = CategoryData;