import React from 'react'
import MessageInput from '../ui/MessageInput'
import ChatHeader from '../ui/ChatHeader'
import Message from '../chat/Message'

const ChatWindow = () => {
  const messages=[{
    id: 1,
    type: 'text',
    content: "Hey there!",
    sender: "otherUser",
    time: "12:30 PM",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    status: "delivered"
  },
  {
    id: 2,
    type: 'text',
    content: "Hi! Check out this photo",
    sender: "currentUser",
    time: "12:32 PM",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    status: "read"
  },
  {
    id: 3,
    type: 'image',
    content: "https://picsum.photos/400/300",
    sender: "currentUser",
    time: "12:33 PM",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    status: "read"
  },
  {
    id: 4,
    type: 'audio',
    content: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    sender: "otherUser",
    time: "12:35 PM",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    status: "delivered"
  },
  {
    id: 5,
    type: 'file',
    content: "https://www.africau.edu/images/default/sample.pdf",
    fileName: "Document.pdf",
    sender: "currentUser",
    time: "12:36 PM",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    status: "delivered"
  }]
  return (

    <div className="relative h-full w-full bg-gray-200 flex flex-col overflow-hidden">
    <ChatHeader />
    <div className="flex-1 overflow-y-auto mt-20 p-2 scrollbar-hide">
    {messages.map((msg) => (
          <Message 
            key={msg.id}
            message={msg}
          />
        ))}
    </div>
    <MessageInput />
  </div>
  )
}

export default ChatWindow
