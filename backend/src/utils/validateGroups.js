import Chat from "../models/chat.model.js";
const validateGroup = async (chatId, userId) => {
    console.log(chatId,userId);
    const group = await Chat.findById(chatId);
    if (!group) throw new Error("Group not found");
    if (!group.groupChat) throw new Error("This is not a group chat");
    if (group.creator.toString() !== userId) throw new Error("You are not the creator of this group");
    return group;
  };

  export default validateGroup;