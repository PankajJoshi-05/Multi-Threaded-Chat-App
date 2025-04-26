import React from 'react'
import { Check, CheckCheck, Clock,  FileText, FileAudio } from 'lucide-react'
import Avatar from '../ui/Avatar'

const Message = ({ message }) => {
  const isCurrentUser = message.sender === "currentUser"

  const renderMessageContent = () => {
    switch(message.type) {
      case 'image':
        return (
          <div className="rounded-md overflow-hidden mt-1">
            <img 
              src={message.content} 
              alt="Sent image" 
              className="max-w-full max-h-64 object-cover cursor-pointer"
              onClick={() => window.open(message.content, '_blank')}
            />
          </div>
        )
      case 'audio':
        return (
          <div className="flex items-center gap-2 mt-1">
            <FileAudio className="text-blue-500" />
            <audio controls src={message.content} className="max-w-full" />
          </div>
        )
      case 'file':
        return (
          <div 
            className="flex items-center gap-2 p-2 bg-gray-100 rounded-md cursor-pointer mt-1"
            onClick={() => window.open(message.content, '_blank')}
          >
            <FileText className="text-gray-600" />
            <span className="text-sm text-gray-600">{message.fileName || 'Document'}</span>
          </div>
        )
      default: // text
        return <p className="text-sm mt-1">{message.content}</p>
    }
  }

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isCurrentUser ? (
        <div className="flex items-start gap-2">
          <div className="flex-shrink-0 h-12 w-12 rounded-full overflow-hidden">
            <Avatar 
              src={message.avatar} 
              alt={message.senderName || "User"} 
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
            <p className="text-sm font-medium text-gray-800">{message.senderName || "User"}</p>
          <div>
            <div className="bg-white text-gray-800 rounded-lg rounded-tl-none px-4 py-2 shadow-sm">
              {renderMessageContent()}
              <div className="flex items-center justify-end mt-1 space-x-1 text-gray-500">
                <span className="text-xs">{message.time}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-end">
            <div className='flex items-center gap-2'>
             <div className="flex-shrink-0 h-12 w-12 rounded-full overflow-hidden">
              <Avatar 
              src={message.avatar} 
              alt="You" 
             />
            </div>
             <p className="text-sm font-medium text-gray-800 ">You</p>
            </div>
          <div className="flex items-end gap-2">
            <div className="bg-blue-500 text-white rounded-lg rounded-br-none px-4 py-2">
              {renderMessageContent()}
              <div className="flex items-center justify-end mt-1 space-x-1 text-blue-100">
                <span className="text-xs">{message.time}</span>
                {message.status === "read" ? (
                  <CheckCheck size={14} className="ml-1" />
                ) : message.status === "delivered" ? (
                  <Check size={14} className="ml-1" />
                ) : (
                  <Clock size={14} className="ml-1 animate-pulse" />
                )}
              </div>
            </div>
            <div>     
            </div>   
          </div>
        </div>
      )}
    </div>
  )
}

export default Message