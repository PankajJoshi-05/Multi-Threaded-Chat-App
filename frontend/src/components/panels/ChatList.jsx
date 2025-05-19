import React, { useState, useEffect } from 'react';
import Search from "../ui/Search";
import ChatListItem from '../chat/ChatListItem';
import useChatStore from '../../store/chatListStore.js';

const ChatList = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { chats, loading, error, fetchChats } = useChatStore();

  useEffect(() => {
    fetchChats();
  }, []);
  const filterChats = chats
    .filter(chat => {
      if (activeTab === "groups") return chat.groupChat;
      if (activeTab === "contacts") return !chat.groupChat;
      return true;
    })
    .filter(chat => 
      chat.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <>
      <h2 className='text-2xl font-semibold text-white'>Chats</h2>
      <Search searchValue={searchQuery} setSearchValue={setSearchQuery} />
      <div className="flex items-center justify-evenly p-2 border-b">
        {['all', 'groups', 'contacts'].map((tab) => (
          <button
            key={tab}
            className={`rounded-full px-4 py-1 capitalize ${activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center text-gray-400 mt-4">Loading chats...</p>
      ) : error ? (
        <p className="text-center text-red-500 mt-4">Error: {error}</p>
      ) : filterChats.length > 0 ? (
        filterChats.map((chat) => (
          <div key={chat._id}>
            <ChatListItem 
              name={chat.name} 
              profilePic={chat.profile} 
              lastMessage={chat.lastMessage?.content || ''} 
              time={new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
            />
          </div>
        ))
      ) : (
        <div className="flex justify-center h-full items-center">
          <p className='text-xl text-gray-500'>No Chats Found</p>
        </div>
      )}
    </>
  );
};

export default ChatList;
