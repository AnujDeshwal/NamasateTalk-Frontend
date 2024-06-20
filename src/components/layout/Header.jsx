import React, { useCallback, useState } from "react";
import {
  Add as AddIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
  Group as GroupIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import SearchDialog from "../dialog/SearchDialog";
import NotificationDialog from "../dialog/NotificationDialog";
import { server } from "../../constants/server";
import axios from "axios";
import { useDispatch } from "react-redux";
import { userNotExists } from "../../redux/reducers/auth.reducer";
import toast from "react-hot-toast";
import { getSocket } from "../../socket";
import { NEW_REQUEST } from "../../utils/events.js"
import { useSocketEvents } from "../../hooks/hooks";
import {setMobile,  setMobileAndunSetNoDrawer,  unSetNoDrawer} from "../../redux/reducers/misc.reducer"
import NewGroup from "../dialog/NewGroup";
const Header = () => {
  const dispatch = useDispatch();
  const [count  , setCount] = useState(0);
  const socket = getSocket();
  const newRequestListener = useCallback((data)=>{
    setCount(prev=>prev+1);
  } , [count])
  const handlers = {
    [NEW_REQUEST]:newRequestListener
  }
  useSocketEvents(socket , handlers);
  const [isSearch, setIsSearch] = useState(false);
  const [isNotification, setIsNotification] = useState(false);
  const [isNewGroup, setIsNewGroup] = useState(false);
  const logoutHandler = () =>{
    axios.get(`${server}/user/logout`,{withCredentials:true})
         .then(({data})=>{
          dispatch(userNotExists());
          toast.success(data.message);
         })
         .catch(error=>{
          toast.error(error?.response?.data?.message || "Something went wrong")
         })

  }
 
  return (
    <>
      <div className="w-screen h-[4rem] bg-red-400 flex justify-between items-center py-[1rem] px-[3rem] ">
        <h1 className="text-[1.8em] hidden sm:block text-white font-bold">
          NamasteTalk
        </h1>
        <div onClick={()=>{
          dispatch(setMobileAndunSetNoDrawer())
        }} className=" hover:cursor-pointer block sm:hidden text-white">
          <MenuIcon />
        </div>
        <div className=" text-white flex justify-center items-center gap-[5vw] ">
          {/* Search people and add  */}
          <div
            onClick={() => {
              setIsSearch(true);
            }}
            className="flex flex-col justify-center items-center   group hover:cursor-pointer"
          >
            <SearchIcon />
            <div className="justify-center items-center absolute mt-[5rem] bg-gray-600 p-[0.3rem] min-w-[3rem] h-[1.4rem]  text-center text-[0.7rem] rounded group-hover:flex hidden">
            <h1>Search</h1>
            </div>
          </div>

          {/* Create new group  */}
          <div
            onClick={() => {
              setIsNewGroup(true)
            }}
            className="flex flex-col justify-center items-center  group hover:cursor-pointer"
          >
            <AddIcon />
            <div className="justify-center items-center absolute mt-[5rem] bg-gray-600 p-[0.3rem] min-w-[3rem] h-[1.4rem]  text-center text-[0.7rem] rounded group-hover:flex hidden">
                <h1>New Group</h1>
            </div>
          </div>
          {/* notifications  */}
          <div
            onClick={() => {
              setIsNotification(true);
            }}
            className=" flex flex-col justify-center items-center  group hover:cursor-pointer"
          >
            {count>0 && <span className=" relative left-[2.5rem] bottom-[0.9rem] py-[0.4rem] inline-block w-[1.8rem] h-[1.8rem] text-center text-sm bg-red-700 rounded-full">{count }</span>}
            <NotificationsIcon />
            <div className="justify-center items-center absolute mt-[5rem] bg-gray-600 p-[0.3rem] min-w-[3rem] h-[1.4rem]  text-center text-[0.7rem] rounded group-hover:flex hidden">
                <h1>Notifications</h1>
            </div>
          </div>
          {/* logout  */}
          <div onClick={logoutHandler} className="flex flex-col justify-center items-center   group hover:cursor-pointer">
            <LogoutIcon />
            <div className="justify-center items-center absolute mt-[5rem] bg-gray-600 p-[0.3rem] min-w-[3rem] h-[1.4rem]  text-center text-[0.7rem] rounded group-hover:flex hidden">
            <h1>Logout</h1>
            </div>
          </div>
        </div>
      </div>
      {isSearch && <SearchDialog isSearch={isSearch} setIsSearch={setIsSearch}/>}
      {isNotification && <NotificationDialog isNotification={isNotification} setIsNotification={setIsNotification}  />}

      {isNewGroup && <NewGroup isNewGroup={isNewGroup} setIsNewGroup={setIsNewGroup}/>}
    </>
  );
};
export default Header;
