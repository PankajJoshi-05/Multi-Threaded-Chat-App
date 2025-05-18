import React,{ useState} from 'react'
import {Outlet} from "react-router-dom"
const MainPannel = () => {
  return (
    <div className="h-[100%] w-full md:w-[40%] lg:w-[30%] flex flex-col bg-gray-400 p-2 overflow-y-auto scrollbar-hide">
       <Outlet/>
    </div>
  )
}

export default MainPannel
