import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    userName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
      type:String,
      required:true
    },
    profile:{
        type:String
     },
    bio:{
        type:String,
    },
    lastLogin:{
        type:Date,
        default:Date.now,
    },
    isVerified:{
      type:Boolean,
      default:false,
    },
    resetPasswordToken:String,
    resetPasswordTokenExpiredAt:Date,
    verificationToken:String,
    verificationTokenExpiresAt:Date,
},{
    timestamps:true
})
const User = mongoose.model("User", userSchema);
export default User;