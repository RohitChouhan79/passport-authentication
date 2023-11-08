const mongoose=require("mongoose");
const postModel=new mongoose.Schema({
    title:String,
    description:String,
    User:{type: mongoose.Schema.Types.ObjectId ,ref:"user"}
})

module.exports=mongoose.model("post",postModel);
