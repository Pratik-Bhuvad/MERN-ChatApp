import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    message: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true })
        try {
            const res = await axiosInstance.get('/message/users')
            set({ users: res.data.users })
        } catch (error) {
            toast.error(error.response.data.message)
        }
        finally {
            set({ isUsersLoading: false })
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true })
        try {
            const res = await axiosInstance(`/message/${userId}`)
            set({ message: res.data.messages })
        } catch (error) {
            toast.error(error.response.data.message)
        }
        finally {
            set({ isMessagesLoading: false })
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, message } = get()
        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData)
            set({ message: [...message, res.data.message] })
        } catch (error) {
            toast.error(error.response.data)
        }
    },

    listenMessages: () => {
        const { selectedUser } = get()
        if (!selectedUser) return;
        const socket = useAuthStore.getState().socket
        
        socket.on("newMessage", (newMessage) => {
            if(newMessage.senderId !== selectedUser._id) return;
            set({message: [...get().message, newMessage]})
        })
    },

    notListenMessage: () => {
        const socket = useAuthStore.getState().socket
        socket.off("newMessage")
    },

    setSelectedUser: (selectedUser) => set({ selectedUser })
}))