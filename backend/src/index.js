import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import cors from "cors";

dotenv.config();
const app=express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth",authRoutes);

const PORT=process.env.PORT;
app.listen(PORT,()=>{
    console.log(PORT);
    console.log(`Server is running on PORT ${PORT}`);
    connectDB();
})
