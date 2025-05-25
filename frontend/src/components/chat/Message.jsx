import React from 'react';
import { FileText, FileAudio } from 'lucide-react';
import Avatar from '../ui/Avatar.jsx';
import { useAuthStore } from '../../store/authStore';
import {formatChatTime} from "../../constants/formatChatTime.js"
const Message = ({ message }) => {
  const{user} = useAuthStore();

  if (!message?.sender) {
  return (
    <div className="text-sm text-warning px-4 py-1">
      Sending...
    </div>
  );
}

  const isCurrentUser = message?.sender?._id === user._id;


  const renderMessageContent = () => {
    switch (message.type) {
      case 'image':
        return (
          <div className="rounded-md overflow-hidden mt-1">
            <img
              src={message.content}
              alt="image"
              className="max-w-[280px] max-h-[280px] object-cover cursor-pointer"
              onClick={() => window.open(message.content, '_blank')}
            />
          </div>
        );
      case 'audio':
        return (
          <div className="flex items-center gap-2 mt-1">
            <FileAudio className="text-accent" />
            <audio controls src={message.content} className="max-w-[240px] " />
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
              src={message.sender.profile }
              alt={message.sender.userName}
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
          <div>
            <div className="bg-base-200 text-base-content rounded-lg rounded-tl-none px-4 py-2 shadow-sm">
              <p className="text-secondary font-semibold ">{message.sender.userName}</p>
              {renderMessageContent()}
              <div className="flex items-center justify-end mt-1 space-x-1 text-sm text-base-content opacity-70">
                <span className="text-xs">{formatChatTime(message.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-end">
          <div className="flex items-end gap-2">
            <div className="bg-primary text-primary-content rounded-lg rounded-br-none px-4 py-2">
               <p className="text-accent font-semibold">You</p>
                {renderMessageContent()}
              <div className="flex items-center justify-end mt-1 space-x-1 text-sm opacity-80">
                <span className="text-xs">{formatChatTime(message.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Message;