import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";
import fs from "fs";
import cloudinary from "../utils/cloudinary.js";
import User from "../models/user.model.js";
import validateGroup from "../utils/validateGroups.js";
import emitEvent from "../utils/emitEvent.js";
import { ALERT,NEW_ATTACHMENT,NEW_MESSAGE_ALERT,REFETCH_CHATS} from "../constants/events.js";

//get all chats
export const getChats=async(req,res)=>{
    try {
        const chats = await Chat.find({ members: req.userId })
        .populate("members", "userName profile")
        .populate("latestMessage")
        .sort({ updatedAt: -1 })
        .lean();

      const processedChats = chats.map(chat => {
      if (chat.groupChat) {
        // Keep group chat name/profile as-is
        return {
          _id: chat._id,
          name: chat.name,
          profile: chat.profile,
          groupChat:true,
          lastMessage: chat.lastMessage || null,
          updatedAt: chat.updatedAt,
        };
      } else {
        // Find the other user
        const otherUser = chat.members.find(
          member => member._id.toString() !== req.userId.toString()
        );

        return {
          _id: chat._id,
          name: otherUser?.userName,
          profile: otherUser?.profile,
          groupChat: false,
          lastMessage: chat.lastMessage || null,
          updatedAt: chat.updatedAt,
        };
      }
    });
        res.status(200).json({success:true, message: "Chats fetched successfully", chats:processedChats });
      } catch (error) {
        res.status(500).json({ success:false,message: "Failed to fetch chats", error: error.message });
      }
}
// create group
export const createGroup=async(req,res)=>{
    try{
     const {name,members}=req.body;
     if(!name) return res.status(400).json({message:"Group name is required"});

     if(!Array.isArray(members) || members.length < 1){
        return res.status(400).json({message:"Group must have at least 1 members"});
     }

     const group=await Chat.create({
        name,
        profile:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSu1W91ZeJWfVGv-P1Q9MEc5NoG5jHTzDIlwA&s",
        creator:req.userId, 
        members:[...members,req.userId],
        groupChat:true}
    );

    emitEvent(req,"ALERT",group.members,`Welcome to ${name}`);
    emitEvent(req,REFETCH_CHATS,members);
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
    
        emitEvent(req,ALERT,group.members, `Group name changed to ${name}`);

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
    
        const allUserNames=await newMembers.map(m=>m.userName).josin(",");
        emitEvent(req,ALERT,group.members,`${allUserNames} added to ${group.name}`);
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
    
        const removedUserName=await User.findOneById(memberId).select("userName");
        emitEvent(req,ALERT,removedUserName,`You have been removed from ${group.name}`);

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
    
        const leftUserName=await User.findOneById(req.userId).select("userName");
        emitEvent(req,ALERT,chat.members,`User ${leftUserName} has left the group`);
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
          .select("userName  profile");
    
        res.status(200).json({ users });
      } catch (error) {
        res.status(500).json({ message: "Failed to fetch users", error: error.message });
      }
};

export const sendAttachments=async (req,res)=>{
  try{
    const {chatId}=req.body;
    const files=req.files||[];
    if(files.length<1){
      throw new Error("No attachments found");
    }
    if(files.length>10){
      throw new Error("Too many attachments");
    }
    const [chat,me]=await Promise.all([
      Chat.findById(chatId),
      User.findById(req.userId)
    ])
    if(!chat){
      throw new Error("Chat not found");
    }
    if(!me){
      throw new Error("User not found");
    }

    const messages=[];
    let lastMessageType="file";
    for(const file of files){
      let type="file";
       if (file.mimetype.startsWith("image")) type = "image";
      else if (file.mimetype.startsWith("video")) type = "video";
       else if (file.mimetype.startsWith("audio")) type = "audio";
       const result = await cloudinary.uploader.upload(file.path, {
        resource_type: type === "video" || type === "audio" ? "video" : "auto",
        folder: "chat_attachments"
      });

      fs.unlinkSync(file.path);

      const newMessage=await Message.create({
        chat:chatId,
        sender:me._id,
        content:result.secure_url,
        type
      });
      messages.push(newMessage);

    const messageForRealTime={
      ...newMessage,
      sender:{
        _id:me._id,
        userName:me.userName,
        profile:me.profile
      },
      chatId
    };
     
  emitEvent(req,NEW_ATTACHMENT,chat.members,{
    message:messageForRealTime,
    chatId});
  
    lastMessageType=type;
    emitEvent(req,NEW_MESSAGE_ALERT,chat.members,{
      chatId,
      sender:me._id
    });
  }

  chat.lastMessage=lastMessageType;
  chat.updatedAt=new Date();
  await chat.save();
   return res.status(200).json({
    success:true,
    message:"Attachment sent Successfully",
    messages
   });
  }catch(error){
    res.status(500).json({message:"Failed to send attachments",error: error.message })
  }
};

export const sendVoiceMessage = async (req, res) => {
  try {
    const { chatId } = req.body;

    if (!req.file) return res.status(400).json({ message: "Voice message is required" });

    const [chat, me] = await Promise.all([
      Chat.findById(chatId),
      User.findById(req.userId)
    ]);

    if (!chat) return res.status(404).json({ message: "Chat not found" });
    if (!me) return res.status(404).json({ message: "User not found" });

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video",
      folder: "voice_messages"
    });

    fs.unlinkSync(req.file.path); 

   
    const messageForDB ={
      chat: chatId,
      sender: req.userId,
      type: "audio",
      content: result.secure_url,
      timestamp: Date.now(),
    };

    const messageForRealTime={
      ...messageForDB,
      sender:{
        _id:me._id,
        name:me.userName,
        profile:me.profile
      }
    }
    const message=await Message.create(messageForDB);
    chat.lastMessage = "Voice Message";
    chat.updatedAt = new Date();
    await chat.save();

    emitEvent(req,NEW_ATTACHMENT,chat.members,{message:messageForRealTime,chatId});
    emitEvent(req,NEW_MESSAGE_ALERT,chat.members,{chatId});

    res.status(201).json({ message: "Voice message sent successfully", message });
  } catch (error) {
    res.status(500).json({ message: "Failed to send voice message", error: error.message });
  }
};

export const getMessages=async(req,res)=>{
   try{
     const {chatId}=req.params;
     const {page}=req.query;
     const limit=20;
     const skip=(page-1)*limit;
     const [messages,totalMessagesCount]=await Promise.all([
       Message.find({chat:chatId})
       .limit(limit)
       .skip(skip)
       .sort({createdAt: -1})
       .populate("sender","userName profile")
       .lean(),
       Message.countDocuments({chat:chatId})
     ]);
     const totalPages=Math.ceil(totalMessagesCount/limit);
     res.status(200).json({
      success:true,
      messages,
      totalPages});
   }catch(error){
     res.status(500).json({message:"Failed to get messages",error: error.message })
   }
}