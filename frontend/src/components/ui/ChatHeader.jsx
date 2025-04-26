import React from 'react'
import Avatar from './Avatar'

const ChatHeader = () => { 
    const chatHeader = {
        name: "John Doe",
        status: "online", // "online" or "offline"
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        lastSeen: "last seen today at 12:45 PM",
    }

    return (
        <div className='w-full  bg-white shadow-sm  p-3 absolute top-0 '>
            <div className='flex items-center gap-3'>
                <div className='relative w-12 h-12 rounded-full overflow-hidden'>
                    <Avatar src={chatHeader.avatar} alt={chatHeader.name} />
                    {chatHeader.status === "online" && (
                        <div className='absolute bottom-1 right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white'></div>
                    ) }
                </div>
                <div>
                    <p className='font-semibold'>{chatHeader.name}</p>
                    <p className='text-xs text-gray-500'>
                        {chatHeader.status === "online" ? "Online" : chatHeader.lastSeen}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ChatHeader