import React from 'react'
import {User,Users,MessageSquare,Plus,Settings,LogOut} from "lucide-react"
import { useAuthStore } from '../../store/authStore';
import Avatar from "../ui/Avatar";
const Sidebar = () => {
    const {user}=useAuthStore();
    user.profilePic ="";
  return (
   <div className='w-20 h-[100%] flex flex-col justify-between items-center bg-gray-900 text-white'>
      <div className='flex flex-col gap-4 mt-4'>
      <div className='bg-gray-800 p-2 rounded-full'>
          <MessageSquare/>
        </div>
        <div className='bg-gray-800 p-2 rounded-full'>
          <Users/>
        </div>
        <div className='bg-gray-800 p-2 rounded-full'>
          <Plus/>
        </div>  
      </div>
      <div className='flex flex-col gap-4 mb-4'>
           <Avatar src={user.profilePic} alt={user.userName}/>
        < div className='bg-gray-800 p-2 rounded-full'> 
        <Settings/>
        </div>   
        <div className='bg-gray-800 p-2 rounded-full'><LogOut/></div>
      </div>
   </div>
  )
}

export default Sidebar;
