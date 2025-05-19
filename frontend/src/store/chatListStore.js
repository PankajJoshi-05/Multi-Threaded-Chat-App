import { create } from 'zustand';
import axios from 'axios';
const API_URL = 'http://localhost:3000/api/v1/chats';
const useChatStore = create((set) => ({
  chats: [],
  loading: false,
  error: null,

  fetchChats: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/get-chats`, {
        withCredentials: true, 
      });

      if (response.data.success) {
        set({ chats: response.data.chats, loading: false });
      } else {
        set({ error: response.data.message || 'Failed to fetch chats', loading: false });
      }
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  }
}));

export default useChatStore;
