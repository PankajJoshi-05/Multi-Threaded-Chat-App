import {Outlet} from "react-router-dom"
const MainPannel = () => {
  return (
      <div className="h-full w-full md:w-[40%] flex flex-col bg-base-200 text-base-content p-2 overflow-y-auto scrollbar-hide">
      <Outlet />
    </div>
  )
}

export default MainPannel
