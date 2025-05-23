import React from 'react'
import MessageInput from '../ui/MessageInput'
import ChatHeader from '../ui/ChatHeader'
import Message from '../chat/Message'
import { useEffect } from 'react'
import useChatStore from '../../store/chatStore'
import { useParams } from 'react-router-dom'

const ChatWindow = () => {

  const {id} = useParams();
  const {fetchMessages, messages,isMessagesLoading} = useChatStore();
  useEffect (()=>{
      fetchMessages(id);
  },[id]);
  
  if(isMessagesLoading){
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading...</p>
      </div>
    )
  }
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

export default ChatWindow;
