import React, { useState } from "react";
import ChatItem from "../shared/ChatItem";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setNoDrawer,
  unSetMobile,
} from "../../redux/reducers/misc.reducer";

import { REFETCH_CHATS } from "../../utils/events.js"
import { setRefetch } from "../../redux/reducers/chat.reducer";
import { useSocketEvents } from "../../hooks/hooks";
import { getSocket } from "../../socket";
const ChatList = ({ chats = [], chatId }) => {
  const socket = getSocket();
  const dispatch = useDispatch();

// console.log("newchats",chats)
  
  const refetchHandler = (chatId)=>{
    console.log("refetch for chatlist")
    dispatch(setRefetch());
  }
  const handlers ={
    [REFETCH_CHATS]:refetchHandler
  }
  useSocketEvents(socket,handlers)
  return (
    <>
      <div className="  w-full ">
        {chats.length > 0 ? (
          chats?.map((data, index) => {
            // const { avatar, name, _id, members } = data;
            const { _id, members , name ,groupChat , creator } = data;
            // console.log("name",name)
            return (
              <div
              key={index} 
                className={` flex  relative h-[6rem]   w-full`}
              >
                {" "}
                <Link className="w-full" key={index} to={`/chat/${_id}`}>
                  <ChatItem
                    onClick={() => {
                      dispatch(setNoDrawer());
                      dispatch(unSetMobile());
                    }}
                    key={index}
                    sameChat={_id === chatId}
                    _id={_id}
                    members={members}
                    name={name}
                    index={index}
                    groupChat={groupChat}
                    creator={creator}
                  />
                </Link>
              </div>
            );
          })
        ) : (
          <h1 className="text-center text-[1.3em] mt-[1rem]">No Friends</h1>
        )}
      </div>
     
    </>
  );
};
export default ChatList;
