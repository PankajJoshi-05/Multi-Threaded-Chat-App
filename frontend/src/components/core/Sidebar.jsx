import React from 'react'
import {User, Users, MessageSquare, Plus, Settings, LogOut} from "lucide-react"
import { useAuthStore } from '../../store/authStore'
import Avatar from "../ui/Avatar"
import { NavLink } from 'react-router-dom'
const Sidebar = () => {
    const {user} = useAuthStore()
    user.profilePic = ""
    
    const navItems=[
        { to: '/', icon: <MessageSquare />, label: 'Chats' },
      { to: '/search-friend', icon: <Users />, label: 'Find new friend' },
      { to: '/create-group', icon: <Plus />, label: 'Create Group' },
    ]
    return (
        <div className='w-20 flex-shrink-0 h-full flex flex-col justify-between items-center bg-gray-900 text-white sticky top-16'>
            {/* Top Icons */}
          <div className='flex flex-col gap-4 mt-4'>
           {navItems.map(item => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `p-2 rounded-full flex items-center justify-center transition-colors ${isActive ? 'bg-[#25c494] text-[white] scale-110' : 'hover:bg-[rgb(32,146,118)] hover:text-[aqua]'}`
                    }
                    title={item.label}
                  >
                    {item.icon}
                  </NavLink>
                ))}
             </div>
            
            {/* Bottom Icons */}
           <div className='flex flex-col gap-4 mb-4'>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `flex items-center justify-center w-10 h-10 rounded-full overflow-hidden border-2 ${isActive ? 'border-[#169680] scale-110' : 'border-transparent'} transition-all`
                  }
                  title="Profile"
                >
                  <Avatar src={user.profile} alt={user.userName} />
                </NavLink>
                <NavLink
                  to="/settings"
                  className={({ isActive }) =>
                    `p-2 rounded-full flex items-center justify-center transition-colors ${isActive ? 'bg-[#1f9985] text-[aqua] scale-110' : 'hover:bg-[#16c9ab] hover:text-[aqua]'}`
                  }
                  title="Settings"
                >
                  <Settings />
                </NavLink>
                <div className='bg-[#20bea9] p-2 rounded-full cursor-pointer' title="Logout">
                  <LogOut/>
                </div>
            </div>
        </div>
    )
}

export default Sidebar