import { create } from 'zustand'
import { axiosInstance } from '../lib/axios.js'
import toast from 'react-hot-toast'
import { io } from 'socket.io-client'

const BASE_URL = import.meta.env.MODE === 'development' ? 'http://localhost:5000/' : '/'

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLogining: false,
    isUpdatingProfile: false,
    socket: null,
    onlineUsers: [],

    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('/auth/check')
            set({ authUser: res.data })
            get().connectSocket()
        } catch (error) {
            console.log("Error in check auth: ", error.message);
            set({ authUser: null })
        }
        finally {
            set({ isCheckingAuth: false })
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true })
        try {
            const res = await axiosInstance.post("/auth/signup", data)
            set({ authUser: res.data })
            get().connectSocket()
            return toast.success("Account created Succesfully")
        } catch (error) {
            toast.error(error.response.data.message)
        }
        finally {
            set({ isSigningUp: false })
        }
    },

    login: async (data) => {
        set({ isLogining: true })
        try {
            const res = await axiosInstance.post("/auth/login", data)
            set({ authUser: res.data })
            get().connectSocket()
            return toast.success("Logged In Succesfully")
        } catch (error) {
            toast.error(error.response.data.message)
        }
        finally {
            set({ isLogining: false })
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout")
            set({ authUser: null })
            toast.success("Logged out Successfully")
            get().disconnectSocket()
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true })
        try {
            const res = await axiosInstance.put("/user/update", data)
            if (res) {
                set({ authUser: res.data.user })
                toast.success('Profile Updated Successfully')
            }
        } catch (error) {
            toast.error(error.response.data.message)
        }
        finally {
            set({ isUpdatingProfile: false })
        }
    },

    connectSocket: () => {
        const { authUser } = get()
        if (!authUser || get().socket?.connected) return "not connected";
        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id
            }
        })
        socket.connect()
        set({ socket: socket })
        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds })
        })
    },
    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect()
    }
}))