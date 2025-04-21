import React from 'react'
import Sidebar from '../components/core/Sidebar'
import MainPannel from '../components/core/MainPannel'
import ChatWindow from '../components/core/ChatWindow'
import Header from '../components/core/Header'
const Home = () => {
  return (
    <div className='h-screen w-full flex flex-col '>
       <Header/>
       <div className="flex flex-1">
        <Sidebar />
        <MainPannel />
        <ChatWindow />
      </div>   
       </div>
  )
}

export default Home
