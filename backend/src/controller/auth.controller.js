import { generateToken } from "../utils/generateToken.utils.js";
import User from "../models/user.model.js";

export const signup=async(req,res)=>{
   res.send("signup");
};

export const login=async(req,res)=>{
   res.send("login");
};

export const logout=(req,res)=>{
   res.send("logout");
};

