import Sidebar from '../components/core/Sidebar'
import MainPannel from '../components/core/MainPannel'
import ChatWindow from '../components/core/ChatWindow'
import Header from '../components/core/Header'
import useChatStore from '../store/chatStore'
import NoChatSelected from '../components/chat/NoChatSelected'
import { Outlet,useLocation, useParams} from 'react-router-dom'
import { useEffect } from 'react'
import { set } from 'mongoose'

const Home = () => {
  const location=useLocation();
  const isMainPannelShown=location.pathname === '/' || location.pathname==='/create-group' || location.pathname==='/search-friend'|| location.pathname.startsWith('/chat/');
   const {selectedChat,setSelectedChat,chats}=useChatStore();
   const {id}=useParams();
  useEffect(() => { 
    if (id && chats?.length > 0) {
    const chat = chats.find(chat => chat._id === id);
    if (chat) {
      setSelectedChat(chat);
    } else {
      console.error("Chat not found for ID:", id);
    }
    }
  }, [id,chats]);
  return (
    <div className='h-screen w-full flex flex-col'>
       <Header/>
       <div className="flex flex-1 min-h-0">
        <Sidebar />
        {isMainPannelShown?(
          <>
          <MainPannel />
        {selectedChat ? <ChatWindow /> : <NoChatSelected />}
         </>
        ):
        (
           <div className="flex-1 overflow-auto">
            <Outlet />
          </div>
        )
        }
      </div>   
       </div>
  )
}

export default Home
