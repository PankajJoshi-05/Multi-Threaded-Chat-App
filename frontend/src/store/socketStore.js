// useSocketStore.js
import { create } from 'zustand';
import { io } from 'socket.io-client';
import { useUserStore } from './userStore';
import useChatStore from './chatStore';
import { useAuthStore } from './authStore';
import { toast } from "react-hot-toast";

const useSocketStore = create((set, get) => {
    let socket = null;

    return {
        socket,
        onlineUsers: new Set(),
        typingStatus: {},
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

                socket.on('NEW_REQUEST', (newNotification) => {
                    console.log('Received notification:', newNotification);
                    const audio = new Audio('/sounds/newnotification.mp3');
                    console.log("Audio", audio);
                    audio.volume = 0.3;
                    audio.play().catch(e => console.log("Sound error:", e));
                    useUserStore.getState().addNotification(newNotification);
                });

                socket.on('REFETCH_CHATS', () => {
                    useChatStore.getState().fetchChats();
                });
                socket.on("REFETCH_NEW_USERS", () => {
                    console.log("Refetching new users");
                    useUserStore.getState().fetchNewUsers();
                })
                socket.on('NEW_MESSAGE_ALERT', ({ chatId }) => {
                    const { selectedChat } = useChatStore.getState();
                    if (!selectedChat || selectedChat._id !== chatId) {
                        useChatStore.getState().incrementUnread(chatId);
                    }
                });
                socket.on('NEW_MESSAGE', (newMessage) => {
                    const { selectedChat } = useChatStore.getState();
                    if (selectedChat && selectedChat._id === newMessage.chat) {
                        useChatStore.getState().resetUnread(newMessage.chat);
                    }
                    const audio = new Audio('/sounds/notification.wav');
                    audio.volume = 0.3;
                    audio.play().catch(e => console.log("Sound error:", e));
                    useChatStore.getState().addMessage(newMessage);
                });
                socket.on('NEW_ATTACHMENT', (newAttachment) => {
                    console.log("new Attcahment", newAttachment);
                    const audio = new Audio('/sounds/notification.wav');
                    audio.volume = 0.3;
                    audio.play().catch(e => console.log("Sound error:", e));
                    useChatStore.getState().addMessage(newAttachment);
                })
                socket.on("ALERT", (data) => {
                    const { members, message } = data;
                    console.log("Alert received:", members, message);
                    const currentUserId = useAuthStore.getState().user?._id;
                    if (members.includes(currentUserId)) {
                        const audio = new Audio('/sounds/notification.wav');
                        audio.volume = 0.3;
                        audio.play().catch(e => console.log("Sound error:", e));

                        toast.success(message, {
                            duration: 5000,
                            position: 'top-center'
                        });
                    }

                });
                socket.on("START_TYPING", ({ chatId }) => {
                    set((state) => ({
                        typingStatus: { ...state.typingStatus, [chatId]: true }
                    }));
                });

                socket.on("STOP_TYPING", ({ chatId }) => {
                    set((state) => ({
                        typingStatus: { ...state.typingStatus, [chatId]: false }
                    }));
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
        startTyping: (members, chatId) => {
            if (socket) {
                socket.emit("START_TYPING", { members, chatId });
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