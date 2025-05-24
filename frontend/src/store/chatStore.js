import { create } from 'zustand';
import axios from 'axios';
import useSocketStore from './socketStore';
import toast from 'react-hot-toast';
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
  totalPages: 1,
currentPage: 1,
isPaginationLoading: false,
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

  fetchMessages:async(chatId,page=1)=>{
    if (page > 1) set({ isPaginationLoading: true })
else set({ isMessagesLoading: true })
    try {
      const response = await axios.get(`${API_URL}/get-messages/${chatId}?page=${page}`, {
        withCredentials: true, 
      });
     console.log("Messages Response", response.data);
      if (response.data.success) {
       set((state) => ({
        messages: page === 1
          ? response.data.messages
          : [...response.data.messages,...state.messages], 
        totalPages: response.data.totalPages,
        currentPage: page,
        isMessagesLoading: false,
        isPaginationLoading: false,
      }));
      console.log(response.data);
      } else {
        set({ error: response.data.message || 'Failed to fetch messages', isMessagesLoading: false,isPaginationLoading:false });
      }
    } catch (err) {
      set({ error: err.message, isMessagesLoading: false,isPaginationLoading });
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

  addMessage:(newMessage)=>{
    console.log("newMessage",newMessage);
    set((state)=>({
      messages:[...state.messages,newMessage]
    }))
  },

  sendAttachments:async(formData)=>{
    try{
    const response = await axios.put(`${API_URL}/send-attachments`,formData,{
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });
    console.log("Attachments Response", response.data);
    toast.success(response.data.message);
  }catch(err){
    console.log("Error in sending attachments", err);
    toast.error(err.response?.data?.message || err.message);
  }
  },

  sendVoiceMessage:async(formData)=>{
    try{
      const response= await axios.put(`${API_URL}//send-voice-message`,formData,{
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      toast.success(response.data.message);
    }catch(error){
      console.log("Error in sending voice message", error);
      toast.error(error.response?.data?.message || error.message);
    }
  } ,
  sendMessage:async(chatId,members,message)=>{
     const memberIds = members.map(member => member._id);
     const socket = useSocketStore.getState().socket;
     socket.emit("NEW_MESSAGE",chatId,memberIds,message);
  }
}));

export default useChatStore;
