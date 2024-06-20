import React, { useEffect, useRef, useState } from "react";
import { Search as SearchIcon } from "@mui/icons-material";
import { Add as AddIcon } from "@mui/icons-material";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { InputComp } from "../styles/StyledComponent";
import { server } from "../../constants/server";
import { setRefetch } from "../../redux/reducers/chat.reducer";
import { getSocket } from "../../socket";
import { REFETCH_CHATS } from "../../../../server/utils/events";
const NewGroup = ({ isNewGroup, setIsNewGroup }) => {
    const socket = getSocket();
  const [groupName, setGroupName] = useState("");
  const [toggle, setToggle] = useState({});
  const [users, setUsers] = useState([]);
  const[selectedUsers , setSelectedUsers] = useState([]);
  const dialogRef = useRef();
  const handleOutSideClick = (e) => {
    if (dialogRef.current && !dialogRef.current.contains(e.target)) {
      setIsNewGroup(false);
    }
  };

  useEffect(() => {
    // basically i have used timeOut because as soon as i was typing something immediately result were coming out so i need some delay for good user Experience , basically first let user completely write its searchValue
    const timeOutId = setTimeout(() => {
      axios
        .get(`${server}/user/myfriends`, {
          withCredentials: true,
        })
        .then(({ data }) => {
            let needed ={}
           data.friends.map((data)=>{
            needed[data._id] = true
           })
           setToggle(needed);
          setUsers(data.friends);
        })
        .catch((err) => {
          console.log(err);
        });
    }, 500);
    return () => {
      clearTimeout(timeOutId);
    };
  }, []);
  useEffect(() => {
    if (isNewGroup) {
      document.addEventListener("mousedown", handleOutSideClick);
    } else {
      document.removeEventListener("mousedown", handleOutSideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutSideClick);
    };
  }, [isNewGroup]);

  const handleCreateGroup = () => {
    if(groupName===""){
        return toast.error("Please provide group name");
    }
    // selected members will be two and including you it will become three which is needed 
    if(selectedUsers.length<=1)return toast.error("Selected Members should be at least two");
    const config = {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    };
    axios
      .post(`${server}/chat/createGroup`, { selectedUsers,groupName }, config)
      .then(({ data }) => {
        // console.log(data.groupId ,data.members)
        socket.emit(REFETCH_CHATS ,{members:data.members})
        toast.success("Group created successfully");
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || "Something went wrong ");
      });
  };
  return (
    <div className=" flex  z-10 h-screen absolute top-0 w-screen bg-opacity-50 bg-black   justify-center items-center">
      {/* whole middle white box which contain search box as well as all list of users  */}
      <div
        ref={dialogRef}
        className="  overflow-auto py-4  bg-white flex flex-col  items-center  rounded w-[27rem] 
        min-h-[17rem] max-h-[33rem] shadow-2xl "
      >
        <h1 className="text-center text-[1.5rem] py-4">Create Group </h1>
        {/* Search box  */}
        <div className="  px-4 flex   border-2 border-gray-300 rounded">
          <InputComp
            setGroupName={setGroupName}
            groupName={groupName}
            style={"w-[18.2em] h-[3em] border-none"}
            placeholder={"Enter Group Name"}
          />
        </div>
        <h1 className="  mt-8 text-[1.2rem] text-gray-500 ">Select members </h1>
        {/* List of all users  */}
        <div className="flex overflow-y-auto w-[22rem] flex-col">
          {users.length>0?users?.map((user, index) => {
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

                {/* Add icon  */}
                <button>
                  {" "}
                  {toggle[user._id] ? (
                    <AddIcon
                      onClick={() => {
                        setToggle(prev=>({...prev , [user._id]:!prev[user._id]}))
                        
                        setSelectedUsers((prev)=>[...prev , user._id])
                    }}
                      sx={{
                        marginLeft: "2rem",
                        color: "white",
                        borderRadius: "50%",
                        backgroundColor: "#1976D2",
                        width: "1.7rem",
                        height: "1.7rem",
                        cursor: "pointer",
                        "&:active": {
                          backgroundColor: "#6495ED",
                          transform: "scale(0.95)",
                        },
                        transition:
                          "transform 0.2s ease, background-color 0.2s ease",
                      }}
                    />
                  ) : (
                    <RemoveCircleIcon
                      onClick={() => {
                        setToggle(prev=>({...prev , [user._id]:!prev[user._id]}))
                        const remaining  = selectedUsers.filter((data)=>data!==user._id)
                        setSelectedUsers(remaining)
                    }}
                      sx={{
                        marginLeft: "2rem",
                        borderRadius: "50%",
                        width: "1.7rem",
                        height: "1.7rem",
                        cursor: "pointer",
                        "&:active": {
                          backgroundColor: "white",
                          transform: "scale(0.95)",
                        },
                        transition:
                          "transform 0.2s ease, background-color 0.2s ease",
                      }}
                    />
                  )}
                </button>
              </div>
            );
          }):<h1 className=" mt-4 text-center">No friends </h1>}
        </div>
        <div className="mt-8 flex justify-center items-center gap-[2rem]">
        <button onClick={ ()=>setIsNewGroup(false)} className="h-[2.7rem] active:scale-90 transition-all ease-in-out duration-600  rounded min-w-[5rem] border-red-700 border-[2px]">Cancel</button>
            <button onClick={handleCreateGroup} className="h-[2.7rem] active:scale-90 transition-all ease-in-out duration-600  rounded min-w-[5rem] border-blue-700 border-[2px]">Create</button>
           
        </div>
      </div>
    </div>
  );
};
export default NewGroup;
