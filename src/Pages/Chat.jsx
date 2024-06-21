import React, { useCallback, useEffect, useRef, useState } from "react";
import { InputComp } from "../components/styles/StyledComponent";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import {
  AttachFile as AttachFileIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import GroupIcon from "@mui/icons-material/Group";
import AppLayout from "../components/layout/AppLayout";
import MessageComponent from "../components/shared/MessageComponent";
import { Navigate, useParams } from "react-router-dom";
import { getSocket } from "../socket";
import { NEW_MESSAGE, REFETCH_CHATS } from "../utils/events.js"
import { useDispatch, useSelector } from "react-redux";
import { useSocketEvents } from "../hooks/hooks";
import axios from "axios";
import { server } from "../constants/server";

import FileMenu from "../components/dialog/FileMenu";
import { setFileMenu, unSetFileMenu } from "../redux/reducers/misc.reducer";
import Modal from "../components/shared/Modal";
import toast from "react-hot-toast";
const Chat = () => {
  // This is the message which is to be sent by the sender
  const [refetch,setRefetch] = useState(false);
  const { chatId } = useParams();
  const dispatch = useDispatch();
  const socket = getSocket();
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  // console.log(page)
  const members = useSelector((state) => state.chat.members);
  const user = useSelector((state) => state.auth.user);
  const { creator } = useSelector((state) => state.chat);
  const { groupChat } = useSelector((state) => state.chat);
  // console.log("members", members);
  const messageEndRef = useRef(null);
  const fileMenuRef = useRef(null);
  const scrollableElementRef = useRef();
  // console.log("hi")
  // console.log("chatid",chatId)
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { isFileMenu } = useSelector((state) => state.misc);
  const [automaticScroll, setAutomaticScroll] = useState(true);
  const handleSendMessage = () => {
    if (message !== "") {
      socket.emit(NEW_MESSAGE, { chatId, members, message });
      setMessage("");
    }
  };

  const handleInfiniteScroll = async () => {
    // if(window.innerHeight + document.documentElement.scroll)
    if (scrollableElementRef?.current?.scrollTop === 0) {
      setAutomaticScroll(false);
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    scrollableElementRef?.current?.addEventListener(
      "scroll",
      handleInfiniteScroll
    );
    return () => {
      scrollableElementRef?.current?.removeEventListener(
        "scroll",
        handleInfiniteScroll
      );
    };
  }, [handleInfiniteScroll]);

  const config = {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  };

  let timeoutId = null;
  useEffect(() => {
    axios
      .post(`${server}/chat/mymessages?page=${page}`, { chatId }, config)
      .then(({ data }) => {
        // console.log(data.messages)
        const heightBeforeNewMessages =
          scrollableElementRef?.current?.scrollHeight;
        setMessages((prev) => [...data.messages, ...prev]);
        timeoutId = setTimeout(() => {
          requestAnimationFrame(() => {
            const heightAfterNewMessages =
              scrollableElementRef?.current?.scrollHeight;
            scrollableElementRef.current.scrollTop +=
              heightAfterNewMessages - heightBeforeNewMessages;
          });
        }, 60);

        return () => {
          if (timeoutId) clearTimeout(timeoutId);
        };
      })
      .catch((err) => console.log(err));
  }, [page]);

  useEffect(() => {
    if (!socket) {
      console.log("Socket is not Connected");
    }
  }, [socket]);
  useEffect(() => {
    // as soon as message new message will come so the document will be scroll till the div whose ref is resided in messageEndRef
    // console.log("anuj")
    if (automaticScroll) {
      messageEndRef?.current?.scrollIntoView({ behavior: "smooth" });
    }
    setAutomaticScroll(true);
  }, [messages]);
  // console.log("hello")

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // const { isModal } = useSelector((state) => state.misc);
  const handleConfirmUnfriend = () => {
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .post(`${server}/chat/remove`, { chatId }, config)
      .then(({ data }) => {
        toast.success("Friend Removed");
        console.log("friend removal",members)
        socket.emit(REFETCH_CHATS, {chatId, members: members });
        setIsModalOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleConfirmLeave = () => {
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .post(`${server}/chat/leave`, { chatId }, config)
      .then(({ data }) => {
        toast.success("Group left successfully");
        socket.emit(REFETCH_CHATS, {chatId, members: members });
        setIsModalOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getMessagelistener = (data) => {
    // console.log("chal le", data);
    // console.log(
    //   "first:",
    //   chatId,
    //   " ,second:",
    //   data.message.chat,
    //   data.message.sender.named
    // );
    if (chatId === data.message.chat) {
      // console.log("datacontent", data.content);
      // console.log(data.message);
      // console.log("realtime")
      setMessages((prev) => [...prev, data.message]);
    }
  };

  const handleOutSideClick = (e) => {
    if (fileMenuRef.current && !fileMenuRef.current.contains(e.target)) {
      // console.log("hell")
      dispatch(unSetFileMenu());
    }
  };

  useEffect(() => {
    if (isFileMenu) {
      document.addEventListener("mousedown", handleOutSideClick);
    } else {
      document.removeEventListener("mousedown", handleOutSideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutSideClick);
    };
  }, [isFileMenu, handleOutSideClick]);

  const refetchHandler=(Id)=>{
    console.log("refetching in the CHat.jsx")
  if(Id===chatId)setRefetch(true);
  }
  const handlers = {
    [NEW_MESSAGE]: getMessagelistener,
    [REFETCH_CHATS]:refetchHandler
  };
  useSocketEvents(socket, handlers);
  return (
    <>
    {refetch&& <Navigate to="/"/>}
      <div className="h-full w-full ">
        {/* Bar  */}
        <div className=" flex justify-between px-8 items-center h-[3rem] w-full bg-[#353935]">
          {groupChat ? (
            <h1 className="text-white">Group Chat</h1>
          ) : (
            <h1 className="text-white">Personal Chat</h1>
          )}
          {!groupChat && (
            <div
              onClick={(e) => handleOpenModal()}
              className="group flex flex-col justify-center  items-center cursor-pointer  "
            >
              <PersonRemoveIcon sx={{ color: "white", fontSize: "1.4rem  " }} />
              <div className=" z-10 absolute justify-center items-center    mt-20 bg-gray-600 w-[4rem] h-[1.6rem]  text-white  text-center text-[0.7rem] rounded  group-hover:flex  hidden">
                <h1> Unfriend</h1>
              </div>
            </div>
          )}
          {groupChat && (
            <div
              onClick={(e) => handleOpen()}
              className="group flex flex-col justify-center  items-center cursor-pointer  "
            >
              <ExitToAppIcon sx={{ color: "white", fontSize: "1.4rem  " }} />
              <div className=" z-10 absolute justify-center items-center    mt-20 bg-gray-600 w-[4rem] min-h-[1.6rem]  text-white  text-center text-[0.7rem] rounded  group-hover:flex  hidden">
                <h1> Leave Group</h1>
              </div>
            </div>
          )}

          {/* {groupChat && creator === user._id && (
            <div
              onClick={(e) => handleOpenModal()}
              className="group flex flex-col justify-center  items-center cursor-pointer  "
            >
              <GroupIcon sx={{ color: "white", fontSize: "1.4rem  " }} />
              <div className=" z-10 absolute justify-center items-center    mt-20 bg-gray-600 w-[4rem] min-h-[1.6rem]  text-white  text-center text-[0.7rem] rounded  group-hover:flex  hidden">
                <h1> Manage Group</h1>
              </div>
            </div>
          )} */}
        </div>
        {/* Message Place  */}
        <div
          ref={scrollableElementRef}
          className="h-[calc(100vh-12rem)] overflow-y-auto p-4 flex flex-col gap-[1rem] w-full"
        >
          {messages?.map((data, index) => {
            return (
              <MessageComponent
                key={index}
                // index={index}
                message={data}
              />
            );
          })}
          <div ref={messageEndRef} />
        </div>
        {/* Input and Send COmponent  */}
        <div className="flex relative gap-[0.5rem] justify-center items-center w-full h-[5rem] text-sm text-gray-600 bg-white">
          {isFileMenu && <FileMenu fileMenuRef={fileMenuRef} />}
          <div className="   w-[43rem] px-[1.3rem] flex  bg-gray-100  rounded-full ">
            <AttachFileIcon
              onClick={() => dispatch(setFileMenu())}
              sx={{
                position: "relative",
                transform: "rotate(45deg)",
                top: "0.5rem",
                cursor: "pointer",
              }}
            />
            <InputComp
              setMessage={setMessage}
              message={message}
              style={"  bg-gray-100 w-[18em] h-[3em] border-none"}
              placeholder={"Type Message Here..."}
            />
          </div>
          <span
            onClick={handleSendMessage}
            className="bg-red-400 rounded-full p-[0.7em]"
          >
            {" "}
            <SendIcon
              sx={{
                transform: "rotate(-45deg)",
                color: "white",
                maringRight: "5px",
                cursor: "pointer",
                "&:active": {
                  transform: "scale(0.95)",
                },
                transition: "transform 0.2s ease, background-color 0.2s ease",
              }}
            />
          </span>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        content="Are you sure you want to unfriend this person?"
        onConfirm={handleConfirmUnfriend}
      />
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        content="Are you sure you want to leave this group?"
        onConfirm={handleConfirmLeave}
      />
    </>
  );
};
export default AppLayout()(Chat);
