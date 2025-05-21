import React from 'react';
import { User, Users, MessageSquare, Plus, Settings, LogOut } from "lucide-react";
import { useAuthStore } from '../../store/authStore';
import Avatar from "../ui/Avatar";
import { NavLink } from 'react-router-dom';
import useChatStore from '../../store/chatStore';
const Sidebar = () => {
  const { user } = useAuthStore();
  const {setSelectedChat}=useChatStore();
  
  const navItems = [
    { to: '/', icon: <MessageSquare />, label: 'Chats' },
    { to: '/search-friend', icon: <Users />, label: 'Find new friend' },
    { to: '/create-group', icon: <Plus />, label: 'Create Group' },
  ];
  return (
    <div className="w-20 flex-shrink-0 h-full flex flex-col justify-between items-center bg-base-200 text-base-content sticky top-16 shadow-inner">
      
      {/* Top Icons */}
      <div className="flex flex-col gap-4 mt-4">
        {navItems.map(item => (
          <NavLink 
            onClick={() => setSelectedChat(null)}
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `p-2 rounded-full flex items-center justify-center transition-all 
              ${isActive 
                ? 'bg-primary text-primary-content scale-110' 
                : 'hover:bg-primary hover:text-primary-content'}`
            }
            title={item.label}
          >
            {item.icon}
          </NavLink>
        ))}
      </div>

      {/* Bottom Icons */}
      <div className="flex flex-col gap-4 mb-4">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center justify-center w-10 h-10 rounded-full overflow-hidden border-2 transition-all 
            ${isActive 
              ? 'border-primary scale-110' 
              : 'border-base-100 hover:border-primary'}`
          }
          title="Profile"
        >
          <Avatar src={user.profile} alt={user.userName} />
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `p-2 rounded-full flex items-center justify-center transition-colors 
            ${isActive 
              ? 'bg-primary text-primary-content scale-110' 
              : 'hover:bg-primary hover:text-primary-content'}`
          }
          title="Settings"
        >
          <Settings />
        </NavLink>

        <button
          className="p-2 rounded-full bg-error text-error-content hover:bg-error-content hover:text-error transition-colors"
          title="Logout"
          onClick={() => console.log("Logout logic here")}
        >
          <NavLink to="/logout" >
            <LogOut />
          </NavLink>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;