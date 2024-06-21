import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";


import { saveMembers, setGroupChat, setGroupCreator } from "../../redux/reducers/chat.reducer";
const ChatItem = ({
  onClick,
  avatar = [],
  name = "",
  _id,
  creator="",
  groupChat=false,
  sameChat,
  members,
}) => {
  const user = useSelector((state) => state.auth.user);
  const [same , setSame] = useState(false);
  // console.log("fromchatitem",members)
  useEffect(()=>{
    if(sameChat===true)setSame(true)
  },[])
  const dispatch = useDispatch();
  useEffect(() => {
    // basically when i am in a chat so i am getting it know by the same or sameChat so then i am storing there values in the redux 
    dispatch(saveMembers(members));
    if(groupChat === true)
    {dispatch(setGroupChat(true))}
    else dispatch(setGroupChat(false))
  if(creator!=="")
    {dispatch(setGroupCreator(creator))}
  else dispatch(setGroupCreator(""))
  }, [same]);
let neededname="";
  return (
    <>
      {/* let me tell you significance of sameChat , it is basically that for chats we are using map means many chats would be coming up at once so when i will click on the particular chat then only its messages would be seen in the middle section but how will you get to know that yes this chat has been clicked you can simple keep a state and trigger it on onClick but when you will click on any other thing so then previous state would be as it is , wont change , so a genius way is that from the params just take the chatId whcih is being provide only on the click on the particular chat then when then pass it to chatList then while chatItems would be being iterated so at that time we would simpley check if chatId and current id of chat getting from the map is same sameChat hai toh black kardenge   */}
      <div
        onClick={onClick}
        className={` ${
          sameChat ? "bg-black text-white " : ""
        } flex   h-[6rem] w-full   py-[2.2em]  `}
      >
        <div className="  relative flex  w-[40%]  h-[6em]  ">
          {/* i have done slicing just to get three avatars in case of groupChat  */}
          {members
            ?.filter((data) => data._id !== user._id).slice(0,3)
            .map((data, index) => {
              // very important here that tailwind css can not process calculationo inside of the classes that is why i used inline styling

              // here basically  , if there is groupChat so then we will be like one specific name of the group and if this is a chat of two peoples only so of course again we gonna get only one name so i am taking that one name from the members , of course the count of members be goona two only right now i am developing this app for for two person chat only
              neededname=data.name;
              return (
                <div
                  key={index}
                  className={` bottom-[3.3em] absolute border-white border-[2px ]  m-auto rounded-full w-[4em] h-[4em]`}
                  style={{
                    left: `${index + 0.5}rem`,
                    backgroundImage: `url("${data?.avatar?.url}")`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
              );
            })}
        </div>
        <h1 className="  text-left w-[70%] h-full ">
          {name!==""?name:neededname}
        </h1>
      </div>
    </>
  );
};
export default ChatItem;
