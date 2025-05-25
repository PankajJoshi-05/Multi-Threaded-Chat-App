import React, { useState, useEffect } from 'react';
import Search from "../ui/Search";
import ChatListItem from '../chat/ChatListItem';
import useChatStore from '../../store/chatStore';
import { formatChatTime } from "./../../constants/formatChatTime.js"
import { useNavigate } from 'react-router-dom';

const ChatList = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { chats, fetchChats, isChatsLoading, setSelectedChat, unreadCounts,
    resetUnread } = useChatStore();

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  const filterChats = (chats || [])
    .filter(chat => {
      if (activeTab === "groups") return chat.groupChat;
      if (activeTab === "contacts") return !chat.groupChat;
      return true;
    })
    .filter(chat =>
      chat.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="h-full w-full space-y-4">
      <h2 className='text-2xl font-semibold text-base-content'>Chats</h2>
      <Search searchValue={searchQuery} setSearchValue={setSearchQuery} />

      <div className="flex items-center justify-evenly p-2 border-b border-base-300">
        {['all', 'groups', 'contacts'].map((tab) => (
          <button
            key={tab}
            className={`rounded-full px-4 py-1 capitalize text-sm transition-colors 
              ${activeTab === tab
                ? 'bg-primary text-primary-content'
                : 'bg-base-200 text-base-content hover:bg-base-300'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {isChatsLoading ? (
        <p className="text-center text-base-content/70 mt-4">Loading chats...</p>
      ) : filterChats.length > 0 ? (
        filterChats.map((chat) => (
          <div key={chat._id}
            onClick={() => {
              setSelectedChat(chat);
              resetUnread(chat._id);
              navigate(`/chat/${chat._id}`)
            }}
            className='cursor-pointer'
          >
            <ChatListItem
              name={chat.name}
              profilePic={chat.profile}
              lastMessage={chat.lastMessage || ''}
              time={formatChatTime(chat.updatedAt)}
              unreadCount={unreadCounts[chat._id]}
            />
          </div>
        ))
      ) : (
        <div className="flex justify-center h-full items-center">
          <p className='text-xl text-base-content/50'>No Chats Found</p>
        </div>
      )}
    </div>
  );
};

export default ChatList;
