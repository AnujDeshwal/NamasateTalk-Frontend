import React, { useRef } from "react";
import ImageIcon from "@mui/icons-material/Image";
import VideoCameraBackIcon from "@mui/icons-material/VideoCameraBack";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CloseIcon from "@mui/icons-material/Close";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import { useDispatch } from "react-redux";
import { unSetFileMenu } from "../../redux/reducers/misc.reducer";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { server } from "../../constants/server";
import axios from "axios";
const FileMenu = ({ fileMenuRef = null }) => {
  const dispatch = useDispatch();
  const { chatId } = useParams();
  const imageRef = useRef(null);
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const fileRef = useRef(null);

  const selectImage = () => imageRef.current?.click();
  const selectAudio = () => audioRef.current?.click();
  const selectVideo = () => videoRef.current?.click();
  const selectFile = () => fileRef.current?.click();

  //   console.log(chatId)
  // console.log("hello")
  const fileChangeHandler = (e, key) => {
    const files = Array.from(e.target.files);
    // console.log("files",fi   les)
    if (files.length <= 0) return;
    else if (files.length > 5)
      return toast.error(`You can only send 5 ${key} at a time`);
    dispatch(unSetFileMenu());
    const toastId = toast.loading(`Sending ${key}...`);
    const formData = new FormData();
    // console.log("before" ,formData)

    // formData.append("chatId", chatId);
    files.forEach((file) => formData.append("files", file));
    // console.log("after" ,formData)
    const config = {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
          // "Content-Type": "application/json",
        },
      };
    axios.post(`${server}/chat/sendAttachment` ,formData , config).then(({data})=>{
        toast.success(`${key} sent successfully`, { id: toastId })

    }).catch((err)=>toast.error(err?.response?.data?.message, { id: toastId }))
  };
  return (
    <>
      <div
        ref={fileMenuRef}
        className="absolute left-4 w-[8rem] h-[9rem] bottom-[1rem] shadow-3xl py-4 z-10  bg-white"
      >
        <div
          onClick={() => dispatch(unSetFileMenu())}
          className="absolute right-0 top-0 hover:bg-gray-500 hover:text-white cursor-pointer "
        >
          <CloseIcon sx={{fontSize:"1.3rem"}} />
        </div>
        <div onClick={selectImage} className=" relative w-full h-[25%] flex px-4 cursor-pointer hover:bg-gray-200 gap-[0.7rem] items-center  text-[1rem]">
          <ImageIcon /> <h1>Image</h1>
          <input
            className="absolute w-full h-full"
            type="file"
            multiple
            accept="image/png, image/jpeg, image/gif"
            style={{ display: "none" }}
            onChange={(e) => fileChangeHandler(e, "Images")}
            ref={imageRef}
          />
        </div>
        <div onClick={selectAudio}  className="w-full h-[25%] flex px-4 cursor-pointer hover:bg-gray-200   gap-[0.7rem] items-center  text-[1rem]">
          <AudioFileIcon /> <h1>Audio</h1>
          <input
            type="file"
            multiple
            accept="audio/mpeg, audio/wav"
            style={{ display: "none" }}
            onChange={(e) => fileChangeHandler(e, "Audios")}
            ref={audioRef}
          />
        </div>
        <div onClick={selectVideo}  className="w-full h-[25%] flex px-4 cursor-pointer  hover:bg-gray-200  gap-[0.7rem] items-center  text-[1rem]">
          <VideoCameraBackIcon /> <h1>Video</h1>
          <input
            type="file"
            multiple
            accept="video/mp4, video/webm, video/ogg"
            style={{ display: "none" }}
            onChange={(e) => fileChangeHandler(e, "Videos")}
            ref={videoRef}
          />
        </div>
        <div onClick={selectFile}  className="w-full h-[25%] flex px-4 cursor-pointer hover:bg-gray-200  gap-[0.7rem] items-center  text-[1rem]">
          <InsertDriveFileIcon /> <h1>File</h1>
          <input
            type="file"
            multiple
            accept="*"
            style={{ display: "none" }}
            onChange={(e) => fileChangeHandler(e, "Files")}
            ref={fileRef}
          />
        </div>
      </div>
    </>
  );
};
export default FileMenu;
