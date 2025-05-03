import React from 'react'
import {User, Users, MessageSquare, Plus, Settings, LogOut} from "lucide-react"
import { useAuthStore } from '../../store/authStore'
import Avatar from "../ui/Avatar"

const Sidebar = () => {
    const {user} = useAuthStore()
    user.profilePic = ""
    
    return (
        <div className='w-20 flex-shrink-0 h-full flex flex-col justify-between items-center bg-gray-900 text-white sticky top-16'>
            {/* Top Icons */}
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
            
            {/* Bottom Icons */}
            <div className='flex flex-col gap-4 mb-4'>
                <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                    <Avatar src={user.profile} alt={user.userName} />
                </div>
                <div className='bg-gray-800 p-2 rounded-full'> 
                    <Settings/>
                </div>   
                <div className='bg-gray-800 p-2 rounded-full'><LogOut/></div>
            </div>
        </div>
    )
}

export default Sidebar