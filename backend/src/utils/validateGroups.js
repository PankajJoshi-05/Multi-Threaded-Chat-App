const validateGroup = async (chatId, userId, res) => {
    const group = await Chat.findById(chatId);
    if (!group) return res.status(404).json({ message: "Group not found" });
    if (!group.groupChat) return res.status(400).json({ message: "Not a group chat" });
    if (group.creator.toString() !== userId) return res.status(403).json({ message: "Only the creator can perform this action" });
    return group;
  };

  export default validateGroup;