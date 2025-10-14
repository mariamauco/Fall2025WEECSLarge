const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    //fileId: {},//
    {
        username: {type: String, required: true, unique: true},
        email: {type: String, required: true, unique:true},
        password: {type: String, required: true},
        //joinDate: {type: Date, default: Date.now}, automatically added as createdAt
        points: {type: Number, default: 0}
        //consider others: numberScans,etc 
        // 
        
    }, {timestamps: true} //automatically saves when doc was created}   
)
//compile model from schema
const UserData = mongoose.model("User", UserSchema);
module.exports = UserData;
