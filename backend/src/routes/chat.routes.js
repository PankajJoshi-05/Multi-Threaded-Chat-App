import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {getChats,createGroup,changeGroupName,changeGroupProfile,addMembers,removeMember,getGroupMembers,leaveGroup,deleteGroup,getAllUsers,sendAttachments, sendVoiceMessage,getMessages} from "../controller/chat.controller.js";
import {singleUpload,multipleUpload} from "../middleware/multer.js";

const router=express.Router();

router.get("/get-chats",verifyToken,getChats);
router.post("/create-group",verifyToken,createGroup);
router.put("/change-group-name",verifyToken,changeGroupName);
router.put("/change-group-profile/:id",verifyToken,singleUpload,changeGroupProfile);
router.put("/add-members",verifyToken,addMembers);
router.put("/remove-member",verifyToken,removeMember);
router.get("/get-group-members",verifyToken,getGroupMembers);
router.delete("/leave-group/:id",verifyToken,leaveGroup);
router.delete("/delete-group/:id",verifyToken,deleteGroup);
router.get("/get-all-users",verifyToken,getAllUsers);

router.put("/send-attachments",verifyToken,multipleUpload,sendAttachments);
router.put("/send-voice-message",verifyToken,singleUpload,sendVoiceMessage);

router.get("/get-messages/:chatId",getMessages);
export default router;
