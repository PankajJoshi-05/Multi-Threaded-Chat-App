import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";;
import {createServer} from "http";
import cors from "cors";
import {v4 as uuid} from "uuid";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import userChats from "./routes/chat.routes.js";
import { NEW_MESSAGE, NEW_MESSAGE_ALERT } from "./constants/events.js";
import { getSockets } from "./utils/getSockets.js";
import Message from "./models/message.model.js";

dotenv.config();
const app=express();
const server=createServer(app);
const io=new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        credentials:true,
    }
});

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/user",userRoutes);
app.use("/api/v1/chats",userChats);

const userSocketIds=new Map();

io.on("connection",socket=>{
      console.log("user connected",socket.id);
      const user={
        _id:"abc",
        name:"User",
        profile:"https://randomuser.me/api/portraits/men/1.jpg"
      }
      userSocketIds.set(user._id.toString(),socket.id);

      socket.on(NEW_MESSAGE,async(chatId,members,messages)=>{
        const messageForRealTime={
            content:messages,
            _id:uuid(),
            sender:{
                _id:userChats._id,
                name:user.name,
                profile:user.profile
            },
            chat:chatId,
            createdAt:Date.now()
        }
        const messageForDB={
            content:messages,
            sender:user._id,
            chat:chatId
        }
        const memberSocket=getSockets(members);

        io.to(memberSocket).emit(NEW_MESSAGE,{
            chatId,message:messageForRealTime});

        io.to(members).emit(NEW_MESSAGE_ALERT,{chatId});

        // await Message.create(messageForDB);
        console.log("New message",messageForRealTime);
      })
      socket.on("disconnect",()=>{
        userSocketIds.delete(user._id,toString());
        console.log("user disconnected")
    });  

})
const PORT=process.env.PORT;
server.listen(PORT,()=>{
    console.log(PORT);
    console.log(`Server is running on PORT ${PORT}`);
    connectDB();
})
