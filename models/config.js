const mongoose=require("mongoose");

mongoose
.connect("mongodb://127.0.0.1:27017/m7")
.then(()=>console.log("Db connected"))
.catch((err)=>console.log(err.message));