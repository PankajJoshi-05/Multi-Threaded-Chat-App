import User from "../models/user.model.js";
import cloudinary from "../utils/cloudinary.js";
import fs from 'fs';
export const getProfile = async (req, res) => {
    const userId = req.userId;
    try {
        const user = await User.findById(userId).select("userName email bio profile lastLogin");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error("Error in getProfile", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export const updateProfile = async (req, res) => {
    const { userName, bio} = req.body;
    if(!userName)return res.status(400).json({message:"User name is required"});
    const userId = req.userId;
    try {
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        user.userName = userName;
        user.bio = bio;
       
        if(req.file){
            const filePath=req.file.path;
            const result=await cloudinary.uploader.upload(filePath,{
                folder:'profile'
            })
            fs.unlinkSync(filePath);
            user.profile=result.secure_url;        }
        await user.save();
        return res.status(200).json({ message: "Profile updated successfully",user});
    } catch (err) {
        console.error("Error in updateProfile", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}
