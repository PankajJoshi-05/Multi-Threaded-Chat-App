import { create } from 'zustand';
import axios from 'axios';
import useSocketStore from './socketStore';
import toast from 'react-hot-toast';
const API_URL = 'http://localhost:3000/api/v1/chats';

const useChatStore = create((set,get) => ({
  messages:[],
  chats:null,
  selectedChat: null,
  groupMembers:[],
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
      const response= await axios.put(`${API_URL}/send-voice-message`,formData,{
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
  },

  //group functionalities
  changeGroupProfile:async(formData)=>{
     try{
        const response=await axios.put(`${API_URL}/change-group-profile`,formData,{
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });
        get().fetchChats();
        toast.success(response.data.message);
     }catch(err){
        console.log("Error in changing group profile", err);
        toast.error(err.response?.data?.message || err.message);
     }
  },
  changeGroupName:async(chatId,name)=>{
    try{
      const response=await axios.put(`${API_URL}/change-group-name`,{chatId,name});
      get().fetchChats();
      toast.success(response.data.message);
    }catch(err){
      console.log("Error in changing group name", err);
      toast.error(err.response?.data?.message || err.message);
    }
  },
  changeGroupBio:async(chatId,bio)=>{
    try{
      const response=await axios.put(`${API_URL}/change-group-bio`,{chatId,bio});
      get().fetchChats();
      toast.success(response.data.message);
    }catch(err){
      console.log("Error in changing group bio", err);
      toast.error(err.response?.data?.message || err.message);
    }
  },
  addMemberstoGroup: async (chatId, members) => {
    try {
      const response = await axios.put(`${API_URL}/add-members`, { chatId, members });
      toast.success(response.data.message);
      get().fetchAllUsers();
      get().getGroupMembers(chatId);
    } catch (err) {
      console.log("Error in adding members to group", err);
      toast.error(err.response?.data?.message || err.message);
    }
  },
  removeMembersFromGroup:async(chatId,memberId)=>{
     try{
      const response=await axios.put(`${API_URL}/remove-member`,{chatId,memberId});
       toast.success(response.data.message);
       get().getGroupMembers(chatId);

     }catch(err){
       console.log("Error in removing members from group", err);
       toast.error(err.response?.data?.message || err.message);
     }
  },
  getGroupMembers:async(chatId)=>{
    try{
      const response=await axios.get(`${API_URL}/get-group-members`, {
        params: { chatId },
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true,
      });
      console.log(response.data);
      set({groupMembers:response.data.members});
    }catch(err){
      console.log("Error in getting group members", err);
      toast.error(err.response?.data?.message || err.message);
    }
  },
  leaveGroup:async(chatId,newCreator)=>{
    try{
       const response = await axios.delete(`${API_URL}/leave-group/${chatId}`, {
      data: { newCreator },
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
     get().setSelectedChat(null);
     get().fetchChats();
      toast.success(response.data.message);
    }catch(err){
      console.log("Error in leaving group", err);
      toast.error(err.response?.data?.message || err.message);
    }
  },

  deleteChat:async(chatId)=>{
    try{
      const response=await axios.delete(`${API_URL}/delete-chat/${chatId}`);
      get().fetchChats();
      toast.success(response.data.message);
    }catch(err){
      console.log("Error in deleting group", err);
      toast.error(err.response?.data?.message || err.message);
    }
  }
}));

export default useChatStore;
