import React, { useEffect, useState } from 'react'
import { useChatStore } from '../store/useChatStore'
import SidebarSkeleton from './skeletons/SidebarSkelton'
import { Users, Plus, Mail, X } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast'

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUserLoading, addContact } = useChatStore()

  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false)
  const [showAddContact, setShowAddContact] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [searchEmail, setSearchEmail] = useState("")
  const [searchResult, setSearchResult] = useState(null)
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState("")
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    getUsers()
  }, [getUsers])

  useEffect(() => {
    if (showAddContact) {
      setModalVisible(true)
      document.body.classList.add('overflow-hidden')
    } else {
      const timeout = setTimeout(() => setModalVisible(false), 200)
      document.body.classList.remove('overflow-hidden')
      return () => clearTimeout(timeout)
    }
  }, [showAddContact])

  const filteredUsers = showOnlineOnly ? users.filter(user => onlineUsers.includes(user._id)) : users

  const handleSearch = async (e) => {
    e.preventDefault()
    setIsSearching(true)
    setSearchError("")
    try {
      const res = await axiosInstance.get(`/user/findUserByEmail?email=${encodeURIComponent(searchEmail)}`)
      setSearchResult(res.data.user)
    } catch (error) {
      setSearchError(error.response?.data?.message || "User not found - frontend")
    } finally {
      setIsSearching(false)
    }
  }

  const handleAddContact = async (userId) => {
    setIsAdding(true)
    try {
      await addContact(userId)
      setShowAddContact(false)
      setSearchResult(null)
      setSearchEmail("")
    } catch (error) {
      toast.error("Failed to add contact")
    } finally {
      setIsAdding(false)
    }
  }

  const AddUserForm = (
    <form className="mt-4 flex flex-col gap-4 w-full max-w-xs mx-auto" onSubmit={handleSearch}>
      <div className="flex flex-col gap-3 w-full lg:flex-row">
        <input
          type="email"
          className="input input-bordered w-full px-2 py-2 text-sm rounded-lg flex-1 lg:py-0"
          placeholder="Enter email to add"
          value={searchEmail}
          onChange={e => setSearchEmail(e.target.value)}
          required
          disabled={isSearching}
          autoFocus
        />
        <button
          type="submit"
          className="btn btn-primary w-full text-sm py-2 rounded-lg lg:w-fit"
          disabled={isSearching}
        >
          {isSearching ? "Searching..." : "Search"}
        </button>
      </div>
      {searchError && <div className="text-xs text-red-500 px-1 text-center">{searchError}</div>}
      {searchResult && (
        <div className="relative flex flex-col items-center gap-3 p-4 bg-base-200 rounded-xl mt-2 shadow-md border border-base-300 w-full">
          <button
            className="absolute cursor-pointer top-2 right-2 rounded-full bg-base-300 p-2 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary"
            style={{ zIndex: 2 }}
            onClick={() => { setSearchEmail(''); setSearchResult(null); }}
            type="button"
            aria-label="Close"
          >
            <X size={22} />
          </button>
          <img src={searchResult.avatar || "/avatar.png"} alt={searchResult.fullName} className="size-16 rounded-full border-2 border-base-300" />
          <div className="w-full text-center">
            <div className="font-semibold truncate text-base">{searchResult.fullName}</div>
            <div className="text-xs text-zinc-400 truncate">{searchResult.email}</div>
          </div>
          <button
            type="button"
            className="btn btn-success w-full text-base py-3 rounded-lg"
            onClick={() => handleAddContact(searchResult._id)}
            disabled={isAdding}
          >
            {isAdding ? "Adding..." : "Add"}
          </button>
        </div>
      )}
    </form>
  );

  if (isUserLoading) return <SidebarSkeleton />

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex flex-col items-center gap-2 gap-y-4 justify-center sm:flex-row lg:justify-between">
          <div className="flex items-center lg:gap-1">
            <Users className="size-5" />
            <span className="font-medium hidden lg:block">Contacts</span>
          </div>
          <button
            className="btn btn-xs btn-primary flex items-center gap-1"
            onClick={() => setShowAddContact((v) => !v)}
            title="Add Contact"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden lg:inline">Add</span>
          </button>
        </div>

        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">({onlineUsers.length > 0 ? onlineUsers.length - 1 : '0'} online)</span>
        </div>

        {/* Mobile/Tablet Modal Popup */}
        {modalVisible && (
          <div className={`fixed inset-0 z-40 flex items-center justify-center lg:hidden transition-all duration-200 ${showAddContact ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} >
            <div className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ${showAddContact ? 'opacity-100' : 'opacity-0'}`} onClick={() => setShowAddContact(false)} />
            <div className={`relative z-50 w-full max-w-xs mx-auto transition-all duration-200 transform ${showAddContact ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-4 opacity-0'}`} onClick={e => e.stopPropagation()} >
              <div className="bg-base-100 rounded-xl shadow-2xl p-6 animate-fade-in flex flex-col gap-2 gap-y-0">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg">Add Contact</span>
                  <button
                    className="rounded-full bg-base-300 p-2 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary"
                    onClick={() => setShowAddContact(false)}
                    type="button"
                    aria-label="Close"
                  >
                    <X size={22} />
                  </button>
                </div>
                {AddUserForm}
              </div>
            </div>
          </div>
        )}
        {/* Inline form for desktop */}
        <div className="hidden lg:block">
          {showAddContact && AddUserForm}
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3 no-scrollbar">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors cursor-pointer
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.avatar || "/avatar.png"}
                alt={user.fullName}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>
    </aside>
  )
}

export default Sidebar
