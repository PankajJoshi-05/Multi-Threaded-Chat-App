import React,{Profiler, useState} from 'react'
import ChatList from '../panels/ChatList';
import Profile from '../panels/Profile';
const MainPannel = () => {
  return (
    <div className="h-[100%] w-full md:w-[40%] lg:w-[30%] flex flex-col bg-gray-400 p-2 overflow-y-auto scrollbar-hide">
       {/* <ChatList/> */}
       <Profile/>
    </div>
  )
}

export default MainPannel
