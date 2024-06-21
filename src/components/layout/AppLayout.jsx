import React, { useEffect, useState } from "react";
import Header from "./Header";
import Drawer from "../responsive/Drawer";
import Profile from "../specific/Profile";
import ChatList from "../specific/ChatList";

import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { server } from "../../constants/server";
const AppLayout = () => (WrappedComponent) => {
  return (props) => {
   const [chats , setChats] = useState([]);
    const user = useSelector((state) => state.auth.user);
    const params = useParams();
    const chatId = params.chatId;
    const {refetch} =useSelector(state=>state.chat) 
    useEffect(() => {
      axios
        .get(`${server}/chat/mychats`, { withCredentials: true })
        .then(({ data }) => {setChats(data.chats)})
        .catch((err) => console.log(err));
    } , [refetch]);
    return (
      <div className=" h-screen w-screen">
        <Header></Header>
        <Drawer>
          <ChatList chats={chats} chatId={chatId} />
        </Drawer>

        <div className=" h-[calc(100vh-4rem)] w-screen grid grid-cols-12 ">
          <div className="overflow-auto  sm:col-span-4 md:col-span-3 hidden sm:block">
            <ChatList chats={chats} chatId={chatId} />
          </div>
          <div className="   shadow-2xl  bg-gray-100 col-span-12 sm:col-span-8 md:col-span-5 lg:col-span-6">
            <WrappedComponent {...props } />
          </div>
          <div className="h-[calc(100vh-4rem)]   md:col-span-4 lg:col-span-3 hidden md:block">
            <Profile user={user} />
          </div>
        </div>
      </div>
    );
  };
};

export default AppLayout;
