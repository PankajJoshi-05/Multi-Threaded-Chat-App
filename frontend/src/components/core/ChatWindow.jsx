import React from 'react'
import MessageInput from '../ui/MessageInput'
import ChatHeader from '../ui/ChatHeader'
import Message from '../chat/Message'

const ChatWindow = () => {
  const messages=[];
  return (
    <div className="relative h-full w-full bg-base-100 text-base-content flex flex-col overflow-hidden">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto mt-20 p-2 scrollbar-hide">
        {messages.map((msg) => (
          <Message key={msg.id} message={msg} />
        ))}
      </div>
      <MessageInput />
    </div>
  )
}

export default ChatWindow
