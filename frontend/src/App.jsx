import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/useAuthStore'
import Navbar from './Components/Navbar'
import HomePage from './Pages/HomePage'
import SignUp from './Pages/SignUp'
import Login from './Pages/Login'
import Setting from './Pages/Setting'
import Profile from './Pages/Profile'

import { Loader } from 'lucide-react'
import { useThemeStore } from './store/useThemeStore'

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore()
  const { theme } = useThemeStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isCheckingAuth && !authUser) return (
    <div className='flex items-center justify-center h-screen'>
      <Loader className="size-10 animate-spin" />
    </div>
  )

  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="login" />} />
        <Route path="/signup" element={!authUser ? <SignUp /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/" />} />
        <Route path="/setting" element={<Setting />} />
        <Route path="/profile" element={authUser ? <Profile /> : <Navigate to="login" />} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
