import React from "react";
import {
  Face as FaceIcon,
  AlternateEmail as UserNameIcon,
  CalendarMonth as CalendarIcon,
} from "@mui/icons-material";
const Profile = ({ user }) => {
// console.log(user.avatar)
  return (
    <>
      <div className="h-full  flex flex-col justify-start gap-8  w-full p-16 bg-black bg-opacity-80 text-white">
        <div
          className={` border-[3px] border-white m-auto rounded-full w-[10em] h-[10em] `}
          style={{ backgroundImage:`url("${user.avatar.url}")` , backgroundSize:"cover" , backgroundPosition:"center"}}
        ></div>
        <div className="w-full   flex flex-col gap-[0.6rem]">
          <h1 className="text-center">{user?.bio}</h1>
          <h3 className="text-center text-white text-opacity-45 text-sm ">
            Bio
          </h3>
        </div>
        <div className="flex">
          <UserNameIcon />
          <div className="w-full   flex flex-col gap-[0.6rem]">
            <h1 className="text-center">{user?.username}</h1>
            <h3 className="text-center text-white text-opacity-45 text-sm ">
              Username
            </h3>
          </div>
        </div>
        <div className="flex">
          <FaceIcon/>
          <div className="w-full flex flex-col gap-[0.6rem]">
            <h1 className="text-center">{user?.name}</h1>
            <h3 className="text-center text-white text-opacity-45 text-sm ">
              Name
            </h3>
          </div>
        </div>
        <div className="flex">
          <CalendarIcon />
          <div className="w-full  flex flex-col gap-[0.6rem]">
            <h1 className="text-center">2 month ago</h1>
            <h3 className="text-center text-white text-opacity-45 text-sm ">
              Joined
            </h3>
          </div>
        </div>
      </div>
    </>
  );
};
export default Profile;
