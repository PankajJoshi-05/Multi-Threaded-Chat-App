import Chat from "../models/chat.model.js";
import fs from "fs";
import cloudinary from "../utils/cloudinary.js";
import User from "../models/user.model.js";
import validateGroup from "../utils/validateGroups.js";

//get all chats
export const getChats=async(req,res)=>{
    try {
        const chats = await Chat.find({ members: req.userId })
        .select(
          "name profile lastMessage unreadCount isGroup updatedAt"
        )
        .sort({ updatedAt: -1 });
        res.status(200).json({ message: "Chats fetched successfully", chats });
      } catch (error) {
        res.status(500).json({ message: "Failed to fetch chats", error: error.message });
      }
}


// create group
export const createGroup=async(req,res)=>{
    try{
     const {name,members}=req.body;
     if(!name) return res.status(400).json({message:"Group name is required"});

     if(!Array.isArray(members) || members.length < 2){
        return res.status(400).json({message:"Group must have at least 2 members"});
     }

     const group=await Chat.create({
        name,
        profile:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSu1W91ZeJWfVGv-P1Q9MEc5NoG5jHTzDIlwA&s",
        creator:req.userId, 
        members:[...members,req.userId],
        groupChat:true}
    );

    res.status(201).json({
        message:"Group created successfully",
        groupData:group});
    }catch(error){
        res.status(500).json({message:"Failed to create group",error:error.message});
    }
}

//update groupName
export const changeGroupName=async(req,res)=>{
    try {
        const { chatId, name } = req.body;
        if (!name) return res.status(400).json({ message: "Group name is required" });
        if (!chatId) return res.status(400).json({ message: "Chat ID is required" });
    
       const group=await validateGroup(chatId,req.userId);

        group.name = name;
        await group.save();
    
        res.status(200).json({ message: "Group name changed successfully", group });
      } catch (error) {
        res.status(500).json({ message: "Failed to change group name", error: error.message });
      }
}

//Update groupProfile
export const changeGroupProfile=async(req,res)=>{
   try{
        if(!req.file) return res.status(400).json({message:"Group profile is required"});
     
        const chatId=req.params.id;

       const group= await validateGroup(chatId,req.userId);

        const filePath=req.file.path;
        const result=await cloudinary.uploader.upload(filePath,{folder:'profile'});

        try {
            fs.unlinkSync(filePath);
          } catch (err) {
            console.warn("Failed to delete local file:", err.message);
          }

       group.profile=result.secure_url;
       await group.save();

        res.status(200).json({message:"Group profile changed successfully",group});    
    }catch(error){
        res.status(500).json({message:"Failed to change group profile",error:error.message});
    }
}

// Add Members to group
export const addMembers=async(req,res)=>{
    try {
        const { chatId, members } = req.body;
        if (!members || !Array.isArray(members) || members.length === 0)
          return res.status(400).json({ message: "At least one member is required" });
        if (!chatId) return res.status(400).json({ message: "Chat ID is required" });
    
        const group =await validateGroup(chatId, req.userId);

        const newMembers = members.filter(
          id => !group.members.map(m => m.toString()).includes(id)
        );
    
        group.members.push(...newMembers);
        await group.save();
    
        res.status(200).json({ message: "Members added successfully", group });
      } catch (error) {
        res.status(500).json({ message: "Failed to add members", error: error.message });
      } 
}

// Remove Member from group
export const removeMember=async(req,res)=>{
    try {
        const { chatId, memberId } = req.body;
    
        if (!chatId || !memberId) {
          return res.status(400).json({ message: "Chat ID and Member ID are required" });
        }
    
        const group =await validateGroup(chatId, req.userId);
    
        if (!group.members.includes(memberId)) {
          return res.status(400).json({ message: "User is not a member of this group" });
        }
    
        group.members = group.members.filter(id => id.toString() !== memberId);

        await group.save();
    
        res.status(200).json({ message: "Member removed successfully", group });
      } catch (error) {
        res.status(500).json({ message: "Failed to remove member", error: error.message });
      }
}

// get groupMembers
export const getGroupMembers = async (req,res)=>{
    try {
      const { chatId } = req.body;
    
      if (!chatId) {
        return res.status(400).json({ message: "Chat ID is required" });
      }
      const group = await Chat.findById(chatId).populate("members", "name profile");
  
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }
     
      if(!group.groupChat){
        return res.status(400).json({ message: "This is not a group chat" });
      }
      
      const currentUserId = req.userId;
      const creatorId = group.creator.toString();
  
      // Sort members: current user → creator → others
      const sortedMembers = group.members.sort((a, b) => {
        if (a._id.toString() === currentUserId) return -1;
        if (b._id.toString() === currentUserId) return 1;
  
        if (a._id.toString() === creatorId) return -1;
        if (b._id.toString() === creatorId) return 1;
  
        return 0;
      });

      res.status(200).json({ members: sortedMembers });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch members", error: error.message });
    }
  }; 

//leave Group
export const leaveGroup=async(req,res)=>{
    try {
        const chatId = req.params.id;
        const { newCreator } = req.body;
        const chat = await Chat.findById(chatId);
        if (!chat) {
          return res.status(404).json({ message: "Chat not found" });
        }
        if(!chat.groupChat){
          return res.status(400).json({message:"This is not a group chat"});
        }

        //check if user is a member
        const isMember = chat.members.some(memberId => memberId.toString() === req.userId);
        
        if (!isMember) {
            return res.status(403).json({ message: "You are not a member of this group" });
        }

        const isCreator = chat.creator.toString()===req.userId;

         //if only creator is left delete the group 
         if(chat.members.length===1 && isCreator){  
          await Chat.findByIdAndDelete(chatId);
          return res.status(200).json({message:"Group deleted successfully"});
        }
       
        const remainingMembers=chat.members.filter(
          (memberId) => memberId.toString() !== req.userId
        )
        // Prevent creator from leaving the group unless ownership is transferred
        if(isCreator){
          if (!newCreator) {
            return res.status(400).json({ message: "Need to tranfer the ownership first" });
          }
            const isNewCreatorMember = remainingMembers.some(
              memberId => memberId.toString() === newCreator
          );
          
          if (!isNewCreatorMember) {
              return res.status(400).json({ 
                  message: "New creator must be a member of the group" 
              });
          }
        
          chat.creator = newCreator;
        }
        // Remove the user from the group
        chat.members = remainingMembers
    
        await chat.save();
    
        res.status(200).json({ message: "You have left the group successfully",chat});
      } catch (error) {
        res.status(500).json({ message: "Failed to leave group", error: error.message });
      }
}

//delete the group
export const deleteGroup=async(req,res)=>{
  const chatId=req.params.id;
  try{
    const group=await validateGroup(chatId,req.userId);
    await Chat.deleteOne({_id:chatId});
    res.status(200).json({message:"Group deleted successfully"});
  }catch(error){
    console.log("Error deleting group",error);
    res.status(500).json({message:"Failed to delete group",error:error.message});
  }
}

//get All the users
export const getAllUsers=async (req,res)=>{
    try {
        const users = await User.find({ _id: { $ne: req.userId } })
          .select("name  profile");
    
        res.status(200).json({ users });
      } catch (error) {
        res.status(500).json({ message: "Failed to fetch users", error: error.message });
      }
};

