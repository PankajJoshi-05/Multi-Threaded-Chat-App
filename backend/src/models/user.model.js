import mongoose from "mongoose";

const User=new mongoose.Schema({
    userName:{
        type:string,
        required:true
    },
    email:{
        type:string,
        requireed:true
    },
    password:{
      type:string,
      required:true
    }
},{
    timestamps:true
})

export default User;