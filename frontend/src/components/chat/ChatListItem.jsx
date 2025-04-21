import React from 'react'
import Avatar from '../ui/Avatar'

const ChatListItem = ({ name, profilePic, lastMessage, time, unreadMessages }) => {
  return (
    <div className=" flex items-center bg-gray-300 gap-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors mt-2 ">
      <Avatar src={profilePic} alt={name} />
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center gap-2">
          <h3 className="font-semibold text-gray-800 truncate">{name}</h3>
          <span className="text-xs text-gray-500 whitespace-nowrap">{time}</span>
        </div>
        
        <div className="flex justify-between items-center gap-2">
          <p className="text-sm text-gray-600 truncate">{lastMessage}</p>
          {unreadMessages && (
            <div className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadMessages}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatListItem