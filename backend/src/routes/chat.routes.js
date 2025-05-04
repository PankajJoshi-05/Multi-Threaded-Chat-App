import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {getChats,createGroup} from "../controller/chat.controller.js";
const router=express.Router();

router.get("/get-chats",verifyToken,getChats);
router.post("/create-group",verifyToken,createGroup);
export default router;