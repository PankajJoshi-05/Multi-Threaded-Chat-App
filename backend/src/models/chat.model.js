import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    profile:{
        type:String,
    },
    groupChat: {
        type: Boolean,
        default: false,
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            }
        ],
    latestMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
        },
}, {
    timestamps: true,
})

const Chat = mongoose.models.Chat||mongoose.model("Chat", ChatSchema);
export default Chat;