import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";;
import { createServer } from "http";
import cors from "cors";
import { v4 as uuid } from "uuid";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import userChats from "./routes/chat.routes.js";
import { getSockets } from "././utils/getSockets.js";
import Message from "./models/message.model.js";
import { socketAuthticator } from "./controller/auth.controller.js";
import { corsOptions } from "././utils/corsOptions.js";
import {
  CHAT_JOINED,
  CHAT_LEAVED,
  NEW_MESSAGE,
  NEW_MESSAGE_ALERT,
  ONLINE_USERS,
  START_TYPING,
  STOP_TYPING,
} from "./constants/events.js"
dotenv.config();
const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: corsOptions,
});
app.set("io", io);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/chats", userChats);

const userSocketIDs = new Map();
const onlineUsers = new Set();

io.use((socket, next) => {
    cookieParser()(
        socket.request,
        {},
        async (err) => {
            try{
            await socketAuthticator(err, socket, next);
            }catch(error){
                console.log("Error in socket authenticator", error);
                next(error);
            }
        }
    );
});

io.on("connection", socket => {
    console.log("user connected", socket.id);
    const user = socket.request.user;
    userSocketIDs.set(user._id.toString(), socket.id);

    socket.on(NEW_MESSAGE, async (chatId, members, messages) => {
        const messageForRealTime = {
            content: messages,
            type:"text",
            _id: uuid(),
            sender: {
                _id: user._id,
                name: user.userName,
                profile: user.profile
            },
            chat: chatId,
            updatedAt: Date.now()
        }
        const messageForDB = {
            content: messages,
            sender: user._id,
            chat: chatId
        }
        const memberSocket = getSockets(members);
        io.to(memberSocket).emit(NEW_MESSAGE, messageForRealTime);

        io.to(memberSocket).emit(NEW_MESSAGE_ALERT, { chatId });

        try {
            await Message.create(messageForDB);
        }
        catch (error) {
            console.log("Error in saving message to DB", error);
        }
    })

    socket.on(START_TYPING, ({ members, chatId }) => {
        const membersSockets = getSockets(members);
        socket.to(membersSockets).emit(START_TYPING, { chatId });
    });

    socket.on(STOP_TYPING, ({ members, chatId }) => {
        const membersSockets = getSockets(members);
        socket.to(membersSockets).emit(STOP_TYPING, { chatId });
    });

    socket.on(CHAT_JOINED, ({ userId, members }) => {
        onlineUsers.add(userId.toString());

        const membersSocket = getSockets(members);
        io.to(membersSocket).emit(ONLINE_USERS, Array.from(onlineUsers));
    });

    socket.on(CHAT_LEAVED, ({ userId, members }) => {
        onlineUsers.delete(userId.toString());

        const membersSocket = getSockets(members);
        io.to(membersSocket).emit(ONLINE_USERS, Array.from(onlineUsers));
    });

    socket.on("disconnect", () => {
        userSocketIDs.delete(user._id.toString());
        console.log("user disconnected")
    });

})

const PORT = process.env.PORT;
server.listen(PORT, () => {
    console.log(PORT);
    console.log(`Server is running on PORT ${PORT}`);
    connectDB();
})

export  {userSocketIDs};