import React,{useState} from 'react'
import Search from "../ui/Search";
import ChatListItem from '../chat/ChatListItem';
const ChatList = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery,setSearchQuery] = useState('');
  const ChatListData = [
    {
        id:1,
        name:"John Doe",
        lastmessage:"Hello",
        time:"10:00 AM",
        isGroup:false,
        profilePic:"",
        unreadMessages: 2,
    },
    {
        id:2,
        name:"Nex",
        lastmessage:"Hi",
        time:"10:00 AM",
        profilePic:"",
        isGroup:false
    },
    {
      id:3,
      name:"TeamX",
      lastmessage:"Meeting at 10 AM",
      time:"10:00 AM",
      profilePic:"https://via.placeholder.com/150",
      isGroup:true,
    },
    {
        id:4,
        name:"TeamDev",
        lastmessage:"Meeting at 10 AM",
        time:"10:00 AM",
        profilePic:"",
        isGroup:true,
    },
    ];

    const filterChats=ChatListData.filter(chat=>
{      if(activeTab==="groups") return chat.isGroup;
        if(activeTab==="contacts") return !chat.isGroup;
        return true; //all  chats
}).filter(chat => 
  chat.name.toLowerCase().includes(searchQuery.toLowerCase())
);

      return (
    <>
      <h2 className='text-2xl font-semibold text-white'>Chats</h2>
      <Search 
      searchValue={searchQuery}
      setSearchValue={setSearchQuery}
      />
      <div className="flex items-center justify-evenly p-2 border-b">
        {['all', 'groups', 'contacts'].map((tab) =>(
          <button
           key={tab}
           className={`rounded-full px-4 py-1 capitalize ${activeTab===tab?'bg-blue-500 text-white':'bg-gray-200 text-gray-700'}`}
           onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
        
        </div>
      {filterChats.length>0 ?(filterChats.map((chat)=>(
        <div key={chat.id}>
            <ChatListItem name={chat.name} profilePic={chat.profilePic} lastMessage={chat.lastmessage} time={chat.time} unreadMessages={chat.unreadMessages}/>                     
            </div>
      ))
    ):(
     <div className="flex justify-center h-full items-center ">
      <p className='text-xl text-gray-500'>No Chats Found</p>
      </div>
    )}
    </>
  )
}

export default ChatList
