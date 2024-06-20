import React, { useEffect, useRef, useState } from "react";
import { Search as SearchIcon } from "@mui/icons-material";
import { InputComp } from "../styles/StyledComponent";
import axios from "axios";
import { server } from "../../constants/server";
import toast from "react-hot-toast";
import { Button } from "@mui/material";
import { REFETCH_CHATS } from "../../../../server/utils/events";
import { getSocket } from "../../socket";
const NotificationDialog = ({isNotification , setIsNotification}) => {
  const socket = getSocket();
  const [requests , setRequests] = useState([])
    const dialogRef = useRef();
    const handleOutSideClick = (e) =>{
        if(dialogRef.current && !dialogRef.current.contains(e.target)){
            setIsNotification(false);
        }
    }
    useEffect(()=>{
        if(isNotification  ){
            document.addEventListener("mousedown" , handleOutSideClick);
        }else {
            document.removeEventListener('mousedown', handleOutSideClick);
          }
          return () => {
            document.removeEventListener('mousedown', handleOutSideClick);
          };
    } , [isNotification])
    useEffect(()=>{
      const config = {
        withCredentials: true,
      };
      axios
        .get(`${server}/user/allrequests`, config)
        .then(({ data }) => {
         setRequests(data.allUsers)
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message || "Something went wrong ")
        });
    } , [requests])
    
    const handleRequest = (request , userId)=>{
      const config = {
        withCredentials: true,
        headers:{
          "Content-Type":"application/json"
        }
      };
      axios
        .post(`${server}/user/handlerequest`,{request , userId}, config)
        .then(({ data }) => {
          console.log("chat",data.chat)
          if(data.chat)
         {console.log('members',data.chat.members); socket.emit(REFETCH_CHATS,{members:data?.chat?.members})}
          if(data.friendName){ toast.success(`Congrats ,Now you are friend with ${data.friendName}`)}
         
         setRequests(data.allUsers)
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message || "Something went wrong ")
        });
    }
  return (
    <div className=" z-10  h-screen absolute top-0 w-screen bg-opacity-50 bg-black  flex justify-center items-center">
      <div ref = {dialogRef}
        className=" bg-white  flex flex-col justify-center items-center  rounded w-[30rem] 
         min-h-[13rem] shadow-2xl "
      >
        <h1 className="text-center text-[1.5rem] py-4">Notifications</h1>
        {/* List of all requests  */}
       {requests.length>0 ?  <div className="flex flex-col">
          {requests?.map((user, index) => {
            // very important here that tailwind css can not process calculationo inside of the classes that is why i used inline styling

            return (
              <div
                key={index}
                className={` flex w-full   h-[6rem]  py-[2.2em]  `}
              >
                {/* avatar section */}
                <div className="  relative flex w-[8rem] h-[6em]  ">
                  <div
                    key={index}
                    className={` bottom-[3.3em] absolute  m-auto rounded-full w-[4em] h-[4em]`}
                    style={{
                      backgroundImage: `url("${user.avatar.url}")`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  ></div>
                </div>
                <div className="h-full w-[7em]">
                  <h1>{user.name}</h1>
                </div>

                
                  <Button 
                    onClick={e=>handleRequest(true , user._id)}
                  >Accept</Button>
                  <Button 
                  onClick={e=>handleRequest(false , user._id)}
                    sx={{color:"red"}}
                  >Reject</Button>
              </div>
            );
          })}
        </div>:  <h1 className="text-center text-[1rem] py-4 " >0 Notifications</h1>}
       
      </div>
    </div>
  );
};
export default NotificationDialog;
