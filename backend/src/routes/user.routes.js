import express from "express";
import  {verifyToken}  from "../middleware/verifyToken.js";
import {updateProfile,getProfile,sendFriendRequest, searchUser,acceptFriendRequest,getMynotifications} from "../controller/user.controller.js";
import {singleUpload} from "../middleware/multer.js";

const router=express.Router();

router.put("/update-profile",verifyToken,singleUpload,updateProfile);
router.get("/get-profile",verifyToken,getProfile);

router.get("/search-user",verifyToken,searchUser);
router.put("/send-request",verifyToken,sendFriendRequest);
router.put("/accept-request",verifyToken,acceptFriendRequest);
router.get("/get-my-notifications",verifyToken,getMynotifications);
export default router;
