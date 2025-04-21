import React,{Profiler, useState} from 'react'
import ChatList from '../panels/ChatList';
const MainPannel = () => {
  return (
    <div className="h-[100%] w-full md:w-[30%] flex flex-col bg-gray-400 p-2">
       <h2 className='text-2xl font-semibold text-white'>Chats</h2>
       <ChatList/>
    </div>
  )
}

export default MainPannel
