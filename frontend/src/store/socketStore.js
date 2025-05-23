// useSocketStore.js
import { create } from 'zustand';
import { io } from 'socket.io-client';
import { useUserStore } from './userStore';
import useChatStore from './chatStore';
const useSocketStore = create((set, get) => {
    let socket = null;

    return {
        socket,
        onlineUsers: new Set(),
        connectSocket: () => {
            if (!socket) {
                socket = io("http://localhost:3000", {
                    withCredentials: true,
                });

                socket.on('connect', () => {
                    console.log("Socket connected", socket.id);
                });

                socket.on('disconnect', () => {
                    console.log("Socket disconnected");
                });

                socket.on('connect_error', (error) => {
                    console.error('Connection Error:', error);
                });

                socket.on('error', (error) => {
                    console.error('Socket Error:', error);
                });

                socket.on('ONLINE_USERS', (users) => {
                    set({ onlineUsers: new Set(users) });
                });
                
                socket.on('NEW_REQUEST',(newNotification)=>{
                    console.log('Received notification:', newNotification);
                    const audio=new Audio('/sounds/newnotification.mp3');
                    console.log("Audio",audio);
                    audio.volume = 0.3; 
                    audio.play().catch(e => console.log("Sound error:", e));
                    useUserStore.getState().addNotification(newNotification);
                });

                socket.on('REFETCH_CHATS',()=>{
                     useChatStore.getState().fetchChats();
                });
                set({ socket });
            }
        },
        disconnectSocket: () => {
            if (socket) {
                socket.disconnect();
                socket = null;
                set({ socket: null });
                console.log("Socket manually disconnected");
            }
        },
        sendMessage: (chatId, members, message) => {
            if (socket) {
                socket.emit('NEW_MESSAGE', chatId, members, message);
            }
        },
        startTyping: (members, chatId) => {
            if (socket) {
                socket.emit('START_TYPING', { members, chatId });
            }
        },
        stopTyping: (members, chatId) => {
            if (socket) {
                socket.emit('STOP_TYPING', { members, chatId });
            }
        },
        joinChat: (userId, members) => {
            if (socket) {
                socket.emit('CHAT_JOINED', { userId, members });
            }
        },
        leaveChat: (userId, members) => {
            if (socket) {
                socket.emit('CHAT_LEAVED', { userId, members });
            }
        }
    };
});

export default useSocketStore;