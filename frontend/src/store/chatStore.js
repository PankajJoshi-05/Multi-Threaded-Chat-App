import { create } from 'zustand';
import axios from 'axios';
const API_URL = 'http://localhost:3000/api/v1/chats';

const useChatStore = create((set) => ({
  messages:[],
  chats:null,
  selectedChat: null,
  isGroup: false,
  isMessagesLoading: false,
  isChatsLoading: false,
  allUsers:[],
  isAllUsersLoading: false,
  isGroupCreating: false,
  error: null,

  fetchChats: async () => {
    set({ isChatsLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/get-chats`, {
        withCredentials: true, 
      });
      console.log("Chats Response", response.data);
      if (response.data.success) {
        set({ chats: response.data.chats, isChatsLoading: false });
      } else {
        set({ error: response.data.message || 'Failed to fetch chats', isChatsLoading: false });
      }
    } catch (err) {
      set({ error: err.message, isChatsLoading: false });
    }
  },

  fetchMessages:async(chatId)=>{
    set({ isMessagesLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/get-messages/${chatId}`, {
        withCredentials: true, 
      });
     console.log("Messages Response", response.data);
      if (response.data.success) {
        set({ messages: response.data.messages, isMessagesLoading: false });
      } else {
        set({ error: response.data.message || 'Failed to fetch messages', isMessagesLoading: false });
      }
    } catch (err) {
      set({ error: err.message, isMessagesLoading: false });
    }
  },

  setSelectedChat: (chat) => set({ selectedChat: chat}),

  fetchAllUsers: async () => {
    set({ isAllUsersLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/get-all-users`, {
        withCredentials: true,
      });
      console.log("all Users ",response);
      if (response.data.success) {
        set({ allUsers: response.data.users, isAllUsersLoading: false });
      } else {
        set({ error: response.data.message || 'Failed to fetch users', isAllUsersLoading: false });
      }
    } catch (err) {
      set({ error: err.message, isAllUsersLoading: false });
    }
  },

   createGroup: async ({ name, members }) => {
    set({ isGroupCreating: true, error: null });
    try {
      const response = await axios.post(
        `${API_URL}/create-group`,
        { name, members },
        { withCredentials: true }
      );

      if (response.data.groupData) {
        set({ isGroupCreating: false });
        return { success: true, group: response.data.groupData };
      } else {
        set({ isGroupCreating: false });
        return { success: false, message: response.data.message || "Unknown error" };
      }
    } catch (err) {
      set({ isGroupCreating: false });
      return { success: false, message: err.response?.data?.message || err.message };
    }
  },

  sendAttachments:async()=>{
    
  }
}));

export default useChatStore;
