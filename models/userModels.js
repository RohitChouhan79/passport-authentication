const mongoose=require("mongoose");
const plm =require("passport-local-mongoose");
const userModels= new mongoose.Schema({
    username:String,
    email:String,
    password:String,
});

userModels.plugin(plm,{usernameField:'email'})
// userModels.plugin(plm)
module.exports=mongoose.model("user",userModels);
