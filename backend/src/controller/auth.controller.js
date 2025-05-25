import { generateToken } from "../utils/generateToken.utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationEmail,sendWelcomeEmail,sendPasswordResetEmail,sendResetSuccessEmail} from "../utils/email.utils.js";
import jwt from "jsonwebtoken";
import { toNamespacedPath } from "path";

export const signup = async (req, res) => {
    const { userName, email, password } = req.body;
    try {
        if (!userName || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        email = email.toLowerCase();
        //check for the existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already exists." });
        }
        
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long and include 1 uppercase letter, 1 number, and 1 special character."
            });
        }
        //encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10);

        //generates 6 digit verification code
        const verificationToken = crypto.randomInt(100000, 999999).toString();
        const newUser = new User({
            userName,
            email,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 5 * 60 * 1000 //5min
        });

        //save the user at the database
        await newUser.save();
        //generate authenticate token 
        generateToken(newUser._id, res);

        //send the verificationCode to user mail
        await sendVerificationEmail(email, verificationToken);

        const user = newUser.toObject();
        delete user.password;

        return res.status(201).json({ success: true, message: "User registered successfully", user });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        //check for the user
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
        //validate the password
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(401).send({ success: false, message: "Invalid credentials" });
        }

        existingUser.lastLogin = Date.now();
        await existingUser.save();

        //generate the authenticate token
        generateToken(existingUser._id, res);

        const userData = existingUser.toObject();
        delete userData.password;
        return res.status(200).json({ success: true, message: "Login successful", user: userData });
    } catch (error) {
        console.log("Error in login");
        res.status(500).send({ success: false, message: error.message });
    }
};

export const verifyEmail = async (req, res) => {
    const { code } = req.body;
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(400).json({ status: false, message: "Invalid verification code" });
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        await sendWelcomeEmail(user.email, user.userName);

        const {password, ...userData} = user.toObject();
        delete userData.password;
        res.status(200).json({
            status: true,
            message: "Email verified successfully",
            user:userData
        });
    } catch (error) {
        console.log("Error in verifyMail ", error);
        res.status(500).json({ success: false, message: "server error" });
    }
};

export const resendVerificationCode=async(req,res)=>{
   try{
    const userId=req.userId;
    const user=await User.findById(userId);
    if(!user){
      return res.status(404).json({success:false,message:"User not Found"});
    }

    if(user.isVerified){
        return res.status(400).json({success:false,message:"email is already verified"});
    }

    const verificationCode=crypto.randomInt(100000,999999).toString();
    user.verificationToken=verificationCode;
    user.verificationTokenExpiresAt=Date.now()+5*60*1000; // 5 min

    await user.save();

    await sendVerificationEmail(user.email,verificationCode);

    res.status(200).json({
        success:true,
        message:"Verifiaction code resent successfully"
    });
}catch(error){
    console.log("Error in resendVerificationCode","error");
    res.status(500).json({success:false,message:"Internal server error"});
}
};

export const logout = (req, res) => {
    res.cookie("jwt", "");
    return res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const forgotPassword=async(req,res)=>{
  const {email}=req.body;
  try{
     const user=await User.findOne({email});
     if(!user)
     return res.status(400).json({success:false,message:"User not found"});

     //generate reset token
     const resetPasswordToken=crypto.randomBytes(20).toString("hex");
     const resetPasswordTokenExpiresAt=Date.now()+1*60*60*1000; // 1 hour

     user.resetPasswordToken=resetPasswordToken;
     user.resetPasswordTokenExpiredAt=resetPasswordTokenExpiresAt;
     
     await user.save();

     await sendPasswordResetEmail(user.email,`${process.env.CLIENT_URL}/reset-password/${resetPasswordToken}`);

     res.status(200).json({success:true,message:"Password reset link sent to your email"});

  }catch(error){
    console.log("Error in forgotPassword : ",error);
    res.status(500).json({success:false,message:"Internal Server Error"});
  }
};

export const resetPassword=async(req,res)=>{
    try{
       const {token}=req.params;
       const {password}=req.body;

       const user=await User.findOne({
        resetPasswordToken:token,
        resetPasswordTokenExpiredAt:{$gt:Date.now()}
       })

       if(!user){
        return res.status(400).json({success:false,message:"Invalid or expired reset token"});
       }

       //update password
       const hashedPassword=await bcrypt.hash(password,10);

       user.password=hashedPassword;
       user.resetPasswordToken=undefined;
       user.resetPasswordTokenExpiredAt=undefined;
       await user.save();

       sendResetSuccessEmail(user.email);
       res.status(200).json({success:true,message:"Password reset successsful"});
    }catch(error){
      console.log("Error in reset Password : ",error);
      res.status(500).json({success:false,message:"Internal Server Error"});
    }
};

export const checkAuth=async(req,res)=>{
    try{
       const user=await User.findById(req.userId).select("-password");
       if(!user){
        return res.status(400).json({success:false,message:"User not found"});
       }
       res.status(200).json({success:true,user});
    }catch(error){
        console.log("Error in checkAuth ", error);
		res.status(400).json({ success: false, message: error.message });
    }
};

export const socketAuthticator=async(err,socket,next)=>{
  try{
    if(err)  return next(new Error("Authentication error"));
    const token=socket.request.cookies.jwt;
    if(!token) {
      return next(new Error("Unauthorized"));
    }
    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    
    const user=await User.findById(decoded.userId).select("-password");

    if(!user){
      return next(new Error("Unauthorized"));
    }
    socket.request.user=user;
    next();
  }catch(error){
    console.log("Error in socketAuthenticator ",error);
      next(new Error("Unauthorized,login again"));
  }
  }
