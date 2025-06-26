import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import { encryptMessage, decryptMessage, deriveConversationKey } from "../lib/utils";

export const useChatStore = create((set, get) => ({
    message: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    contacts: [],
    isContactsLoading: false,

    getContacts: async () => {
        set({ isContactsLoading: true })
        try {
            const res = await axiosInstance.get('/user/contacts')
            set({ contacts: res.data.contacts, users: res.data.contacts })
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch contacts')
        } finally {
            set({ isContactsLoading: false })
        }
    },

    addContact: async (contactId) => {
        try {
            await axiosInstance.post('/user/contacts', { contactId })
            toast.success('Contact added successfully')
            await get().getContacts()
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add contact')
        }
    },

    getUsers: async () => {
        await get().getContacts()
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true })
        try {
            const { authUser } = useAuthStore.getState();
            const key = deriveConversationKey(authUser._id, userId);
            const res = await axiosInstance(`/message/${userId}`)
            // Decrypt all messages
            const decryptedMessages = res.data.messages.map(msg => ({
                ...msg,
                text: msg.text ? decryptMessage(msg.text, key) : ""
            }))
            set({ message: decryptedMessages })
        } catch (error) {
            toast.error(error.response.data.message)
        }
        finally {
            set({ isMessagesLoading: false })
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, message } = get()
        const { authUser } = useAuthStore.getState();
        const key = deriveConversationKey(authUser._id, selectedUser._id);
        const encryptedText = messageData.text ? encryptMessage(messageData.text, key) : "";
        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, {
                ...messageData,
                text: encryptedText
            })
            // Decrypt the returned message for local state
            const decryptedMsg = {
                ...res.data.message,
                text: res.data.message.text ? decryptMessage(res.data.message.text, key) : ""
            }
            set({ message: [...message, decryptedMsg] })
        } catch (error) {
            toast.error(error.response.data)
        }
    },

    listenMessages: () => {
        const { selectedUser } = get()
        if (!selectedUser) return;
        const { authUser } = useAuthStore.getState();
        const key = deriveConversationKey(authUser._id, selectedUser._id);
        const socket = useAuthStore.getState().socket
        socket.on("newMessage", (newMessage) => {
            if(newMessage.senderId !== selectedUser._id) return;
            // Decrypt incoming message
            const decryptedMsg = {
                ...newMessage,
                text: newMessage.text ? decryptMessage(newMessage.text, key) : ""
            }
            set({message: [...get().message, decryptedMsg]})
        })
    },

    notListenMessage: () => {
        const socket = useAuthStore.getState().socket
        socket.off("newMessage")
    },

    setSelectedUser: (selectedUser) => set({ selectedUser })
}))