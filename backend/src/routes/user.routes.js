import express from "express";
import  {verifyToken}  from "../middleware/verifyToken.js";
import {updateProfile,getProfile} from "../controller/user.controller.js";
import {singleUpload} from "../middleware/multer.js";

const router=express.Router();

router.put("/update-profile",verifyToken,singleUpload,updateProfile);
router.get("/get-profile",verifyToken,getProfile);

export default router;
