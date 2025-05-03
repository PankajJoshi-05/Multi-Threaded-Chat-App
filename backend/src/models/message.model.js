import mongoose from 'mongoose';
const MessageSchema = new mongoose.Schema;({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    chat:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Chat",
        required:true
    },
    content:{
        type:String,
        required:true
    },
    type:{
        type:String,
        enum:["text","image","video","audio"],
        default:"text"
    }
},{
    timestamps:true
})

const Message = mongoose.model("Message",MessageSchema);
export default Message;