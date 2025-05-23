import User from "../models/user.model.js";
import cloudinary from "../utils/cloudinary.js";
import fs from 'fs';
import Request from "../models/request.model.js";
import Chat from "../models/chat.model.js";
import emitEvent from "../utils/emitEvent.js";
import { NEW_REQUEST, REFETCH_CHATS } from "../constants/events.js";

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
        const user = await User.findById(userId).select('-password');
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

export const searchUser = async (req, res) => {
  try {
    const getChats = await Chat.find({
      groupChat: false,
      members: req.userId
    });

    const allUsersFromMyChats = getChats.flatMap(chat => chat.members.map(id => id.toString()));

    const allUsersExceptFromMyChats = await User.find({
      _id: { $nin: allUsersFromMyChats.concat(req.userId) } 
    }).select("userName profile").lean();

    return res.status(200).json({
      success: true,
      users: allUsersExceptFromMyChats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Search failed",
      error: error.message
    });
  }
};

export const sendFriendRequest=async(req,res)=>{
    try{
     const {receiverId}=req.body;
     if(!receiverId)return res.status(400).json({success:false,message:"Receiver id is required"});
     const request=await Request.findOne({
      $or: [
    {
      sender: receiverId,
      receiver: req.userId
    },
    {
      sender: req.userId,
      receiver: receiverId
    }
  ]
});
   if(request){
     return res.status(409).json({success:false,message:"Request already sent"});
   }
     const senderData=await User.findById(req.userId).select("userName profile");
     const newRequest=await Request.create({sender:req.userId,receiver:receiverId});
    console.log("New Request",newRequest);
     emitEvent(req,NEW_REQUEST,[receiverId],{
    _id: newRequest._id,
    sender: {
      _id: newRequest.sender._id,
      name:senderData.userName,
      profile:senderData.profile
    },
    createdAt: new Date()
     });

     return res.status(200).json({success:true,message:"Request sent successfully"});
    }catch(error){
        console.log("Error in sendFriendRequest", error);
        res.status(500).json({success:false,message:"Failed to send request",error: error.message });
    }
}

export const acceptFriendRequest=async(req,res)=>{
    try{
       const {requestId,accept}=req.body;

       const request=await Request.findById(requestId)
       .populate("sender","userName profile")
       .populate("receiver","userName profile");
       if(!request){
        return res.status(404).json({success:false,message:"Request not found"});
       }
       if(request.receiver._id.toString()!==req.userId.toString()){
        return res.status(403).json({success:false,message:"You are not authorized to accept this request"});
       }
       if(!accept){
        await request.deleteOne();
       return res.status(200).json({
      success:true,
      message:"Friend Request Rejected",
       })
      }

     const members=[request.sender._id,request.receiver._id];

     await Promise.all([
        Chat.create({
            members,
            groupChat: false,
        }),
        Request.deleteOne({
            _id:requestId
        })
     ]);
    emitEvent(req,REFETCH_CHATS,members);
    emitEvent(req,"REFETCH_NEW_USERS",members);
      return res.status(200).json({
        status:true,
        message:"Friend Request Accepted",
        senderId:request.sender._id,
      })
    }catch(error){
        console.log("Error in acceptFriendRequest", error);
        res.status(500).json({success:false,message:"Failed to accept request",error: error.message });
    }
}

export const getMynotifications=async(req,res)=>{
  try{
    const requests=await Request.find({receiver:req.userId}).populate("sender","userName profile");
    const allRequests=requests.map(({_id,sender})=>({
      _id,
      sender:{
        _id:sender._id,
        name:sender.userName,
        profile:sender.profile
      }
    }));
    return res.status(200).json({success:true,allRequests});
  }catch(error){
     return res.status(500).json({success:false,message:"Failed to get notifications",error: error.message });
  }
}
