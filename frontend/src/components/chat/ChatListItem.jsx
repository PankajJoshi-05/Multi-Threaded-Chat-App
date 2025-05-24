import React from 'react';
import Avatar from '../ui/Avatar';

const ChatListItem = ({ name, profilePic, lastMessage, time }) => {
  return (
    <div className="flex items-center bg-base-200 gap-3 p-3 hover:bg-base-300 rounded-lg cursor-pointer transition-colors mt-2 border-b border-base-100">
      <div className="flex items-center justify-center w-10 h-10 bg-base-100 rounded-full overflow-hidden">
        <Avatar src={profilePic} alt={name} />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center gap-2">
          <h3 className="font-semibold text-base-content truncate">{name}</h3>
          <span className="text-xs text-base-content opacity-60 whitespace-nowrap">{time}</span>
        </div>
        
        <div className="flex justify-between items-center gap-2">
          <p className="text-sm text-base-content opacity-70 truncate">{lastMessage}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatListItem;