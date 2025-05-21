import React from 'react';
import { Check, CheckCheck, Clock, FileText, FileAudio } from 'lucide-react';
import Avatar from '../ui/Avatar';

const Message = ({ message }) => {
  const isCurrentUser = message.sender === "currentUser";

  const renderMessageContent = () => {
    switch (message.type) {
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
        );
      case 'audio':
        return (
          <div className="flex items-center gap-2 mt-1">
            <FileAudio className="text-primary" />
            <audio controls src={message.content} className="max-w-full" />
          </div>
        );
      case 'file':
        return (
          <div
            className="flex items-center gap-2 p-2 bg-base-300 rounded-md cursor-pointer mt-1"
            onClick={() => window.open(message.content, '_blank')}
          >
            <FileText className="text-base-content" />
            <span className="text-sm text-base-content">{message.fileName || 'Document'}</span>
          </div>
        );
      default:
        return <p className="text-sm mt-1 text-base-content">{message.content}</p>;
    }
  };

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
          <p className="text-sm font-medium text-base-content">{message.senderName || "User"}</p>
          <div>
            <div className="bg-base-100 text-base-content rounded-lg rounded-tl-none px-4 py-2 shadow-sm">
              {renderMessageContent()}
              <div className="flex items-center justify-end mt-1 space-x-1 text-sm text-base-content opacity-70">
                <span className="text-xs">{message.time}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0 h-12 w-12 rounded-full overflow-hidden">
              <Avatar src={message.avatar} alt="You" />
            </div>
            <p className="text-sm font-medium text-base-content">You</p>
          </div>
          <div className="flex items-end gap-2">
            <div className="bg-primary text-primary-content rounded-lg rounded-br-none px-4 py-2">
              {renderMessageContent()}
              <div className="flex items-center justify-end mt-1 space-x-1 text-sm opacity-80">
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
          </div>
        </div>
      )}
    </div>
  );
};

export default Message;