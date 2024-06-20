import React, { useEffect, useRef, useState } from "react";
import { Search as SearchIcon } from "@mui/icons-material";
import { Add as AddIcon } from "@mui/icons-material";
import toast from 'react-hot-toast'
import axios from "axios";
import { useSelector } from "react-redux";
import { InputComp } from "../styles/StyledComponent";
import { server } from "../../constants/server";
const SearchDialog = ({ isSearch, setIsSearch }) => {
  const [searchValue, setSearchValue] = useState("");
  const [users, setUsers] = useState([]);
  const dialogRef = useRef();
  const handleOutSideClick = (e) => {
    if (dialogRef.current && !dialogRef.current.contains(e.target)) {
      setIsSearch(false);
    }
  };

  useEffect(() => {
    // basically i have used timeOut because as soon as i was typing something immediately result were coming out so i need some delay for good user Experience , basically first let user completely write its searchValue 
    const timeOutId = setTimeout(() => {
      axios
        .get(`${server}/user/allUsers?name=${searchValue}`, {
          withCredentials: true,
        })
        .then(({ data }) => {
          setUsers(data.users);
        })
        .catch((err) => {
          console.log(err);
        });
    }, 500);
    return ()=>{
      clearTimeout(timeOutId)
    }
  }, [searchValue]);
  useEffect(() => {
    if (isSearch) {
      document.addEventListener("mousedown", handleOutSideClick);
    } else {
      document.removeEventListener("mousedown", handleOutSideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutSideClick);
    };
  }, [isSearch]);

  const handleRequest = (receiverId) => {
    const config = {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    };
    axios
      .post(`${server}/user/request`, { receiver: receiverId }, config)
      .then(({ data }) => {
        toast.success("Request sent successfully")
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || "Something went wrong ")
      });
  };
  return (
    <div className=" flex z-10  h-screen absolute top-0 w-screen bg-opacity-50 bg-black   justify-center items-center">
      {/* whole middle white box which contain search box as well as all list of users  */}
      <div
        ref={dialogRef}
        className="  overflow-auto py-4  bg-white flex flex-col  items-center  rounded w-[27rem] 
        min-h-[17rem] max-h-[33rem] shadow-2xl "
      >
        <h1 className="text-center text-[1.5rem] py-4">Find People </h1>
        {/* Search box  */}
        <div className="  px-4 flex   border-2 border-gray-300 rounded">
          <SearchIcon sx={{ position: "relative", top: "0.7rem" }} />
          <InputComp
            setSearchValue={setSearchValue}
            searchValue ={searchValue}
            style={"w-[18.2em] h-[3em] border-none"}
          />
        </div>
        {/* List of all users  */}
        <div className="flex flex-col">
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
                      backgroundImage: `url("${user.avatar}")`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  ></div>
                </div>
                <div className="h-full w-[7em]">
                  <h1>{user.name}</h1>
                </div>

                {/* Add icon  */}
                <button onClick={(e) => handleRequest(user._id)}>
                  {" "}
                  <AddIcon
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
                </button>
              </div>
            );
          }):<h1 className="text-center mt-8">No people</h1>}
        </div>
      </div>
    </div>
  );
};
export default SearchDialog;
