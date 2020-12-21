const mongoose= require('mongoose')

//creating schema
const userSchema= new mongoose.Schema({ 
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true,minlength:8},
    name:{type:String},
    mobileno:{type:Number},
    role:{type:String, Default:'user'},
    address:{type:String}


})

module.exports=User=mongoose.model("USERS",userSchema)

