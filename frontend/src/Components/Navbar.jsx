import React from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Link } from 'react-router-dom'
import { LogOut, User, Settings, MessageSquare } from 'lucide-react'

const Navbar = () => {
  const { logout, authUser } = useAuthStore()
  return (
    <header className='bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg sm:bg-base-100/80'>
      <div className='container mx-auto px-2 h-16'>
        <div className="flex items-center justify-between h-full">
          {/* Left Section */}
          <Link to={'/'} className='flex items-center gap-2.5 hover:opacity-80 transition-all'>
            <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center  group-hover:bg-primary/20 transition-colors" >
              <MessageSquare className="size-6 text-primary" />
            </div>
            <h1 className='text-lg font-bold'>Chatty</h1>
          </Link>

          {/* Right section */}
          <div className='flex items-center gap-x-4'>
            <Link to={`/setting`} className='btn btn-sm gap-2 transition-colors rounded-lg py-5'>
              <Settings className='w-4 h-4' />
              <span className='hidden sm:inline text-base'>Settings</span>
            </Link>
            {authUser && (
              <>
                <Link to={`/profile`} className='btn btn-sm gap-2 rounded-lg py-5'>
                  <User className='w-4 h-4' />
                  <span className='hidden sm:inline text-base'>Profile</span>
                </Link>

                <button className='flex gap-2 items-center rounded-lg py-5 cursor-pointer' onClick={logout}>
                  <LogOut className='size-5' />
                  <span className='hidden sm:inline text-base'>Logout</span>
                </button>

              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
