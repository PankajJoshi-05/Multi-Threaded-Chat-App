import {useState} from 'react';
import Avatar from './Avatar';
import  useChatStore from '../../store/chatStore';
import useSocketStore from '../../store/socketStore';
import { useAuthStore } from '../../store/authStore'
import ChatProfile from '../chat/ChatProfile';
const ChatHeader = () => {
  const {selectedChat} = useChatStore();
  const {onlineUsers} = useSocketStore();
   const { user } = useAuthStore();

  const otherUser = selectedChat?.members?.find(m => m._id !== user._id);
  const isOnline = !selectedChat?.groupChat && otherUser && onlineUsers.has(otherUser._id);

  const onlineMembersCount = selectedChat?.groupChat
    ? selectedChat.members.filter(m => m._id !== user._id && onlineUsers.has(m._id)).length
    : 0;

  const [showProfile, setShowProfile] = useState(false);

  return (
    <>
    <div className="w-full bg-base-100 border-b border-base-300 shadow-sm p-3 absolute top-0 z-10"
      onClick={() => setShowProfile(true)}>
      <div className="flex items-center gap-3">
        <div className="relative w-12 h-12 rounded-full overflow-hidden">
          <Avatar src={selectedChat.profile} alt={selectedChat.name} />
          {!selectedChat.groupChat && isOnline && (
            <div className="absolute bottom-1 right-1 w-3 h-3 bg-success rounded-full border-2 border-base-100"></div>
          )}
        </div>
        <div>
          <p className="font-semibold text-secondary">{selectedChat.name}</p>
          <p className="text-xs text-base-content opacity-60">
            {selectedChat?.groupChat 
              ? `${onlineMembersCount+1}/${selectedChat.members.length} online` 
              : isOnline ? "Online" : "Offline"
            }
          </p>
        </div>
      </div>
    </div>
    {showProfile && (
        <ChatProfile onClose={() => setShowProfile(false)} />
      )}
    </>
  );
};

export default ChatHeader;
