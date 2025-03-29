import express from "express";
import { signup,login,logout,verifyEmail} from "../controller/auth.controller.js";

const router=express.Router();

router.post("/signup",signup);
router.post("/login",login);
router.post("/verify-email",verifyEmail);
router.post("/logout",logout);
export default router;