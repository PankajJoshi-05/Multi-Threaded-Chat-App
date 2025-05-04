import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import userChats from "./routes/chat.routes.js";
import cors from "cors";

dotenv.config();
const app=express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/user",userRoutes);
app.use("/api/v1/chats",userChats);
const PORT=process.env.PORT;
app.listen(PORT,()=>{
    console.log(PORT);
    console.log(`Server is running on PORT ${PORT}`);
    connectDB();
})
