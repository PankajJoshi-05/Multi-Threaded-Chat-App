import MessageInput from '../ui/MessageInput'
import ChatHeader from '../ui/ChatHeader'
import Message from '../chat/Message'
import { useEffect,useRef,useCallback } from 'react'
import useChatStore from '../../store/chatStore'
import { LoaderCircle } from 'lucide-react';
import useSocketStore from '../../store/socketStore'
import { useAuthStore } from '../../store/authStore'
const ChatWindow = () => {

  const {fetchMessages,
    messages,
    isMessagesLoading,
    selectedChat,
    currentPage,
    totalPages,
    isPaginationLoading
  } = useChatStore();
  
   const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const prevHeightRef = useRef(0);

  const {joinChat,leaveChat} = useSocketStore();
  const {user} = useAuthStore();
  useEffect(() => {
    if (selectedChat) {
      joinChat(user._id, selectedChat.members.map(m => m._id));
    }

    return () => {
      if (selectedChat) {
        leaveChat(user._id, selectedChat.members.map(m => m._id));
      }
    };
  }, [selectedChat]);

  useEffect(() => {
    if (selectedChat?._id) {
      fetchMessages(selectedChat._id, 1);
    }
  }, [selectedChat?._id]);

  // Auto-scroll to bottom when new messages arrive 
  useEffect(() => {
    if (bottomRef.current && currentPage === 1) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Infinite scroll - load more on top
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (container.scrollTop === 0 && currentPage < totalPages && !isMessagesLoading) {
      prevHeightRef.current = container.scrollHeight;
      fetchMessages(selectedChat._id, currentPage + 1).then(() => {
        requestAnimationFrame(() => {
          container.scrollTop = container.scrollHeight - prevHeightRef.current;
        });
      });
    }
  }, [currentPage, totalPages, fetchMessages, selectedChat, isMessagesLoading]);

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
      <div
        className="flex-1 overflow-y-auto mt-20 p-2 pb-20 scrollbar-hide"
        ref={containerRef}
        onScroll={handleScroll}
      >
        {isPaginationLoading && (
          <div className="flex justify-center py-2">
            <LoaderCircle className="animate-spin text-primary" size={24} />
          </div>
        )}

        {messages.map((msg) => (
          <Message key={msg._id + Date.now()} message={msg} />
        ))}

        <div ref={bottomRef} />
      </div>
      <MessageInput />
    </div>
  )
}

export default ChatWindow;
