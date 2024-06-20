import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {userExists} from "../redux/reducers/auth.reducer.js";
import toast from "react-hot-toast";
import { Link, Navigate } from "react-router-dom";
import { InputComp } from "../components/styles/StyledComponent";
import { ButtonComp } from "../components/styles/StyledComponent";
import { server } from "../constants/server";
const defaultUrl =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSqd3aUgUhuYh6g2nhNXfOToiDd68GIxM6L1H9pluybok5oEF3XXjm5fdAzQK5ItUoOJk&usqp=CAU";
const Signup = () => {
  const [name, setName] = useState("");
  const user = useSelector(state=>state.auth.user)
  const [isLoading , setIsLoading] = useState(false);
  // console.log("this is the user:",user)
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState();
  const dispatch = useDispatch();
  const [requiredFeildError, setRequiredFeildError] = useState("");
  const [url, setUrl] = useState(defaultUrl);
  useEffect(() => {
    setRequiredFeildError("");
  }, [url]);
  const fileInputRef = useRef();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (url === defaultUrl) {
      setRequiredFeildError("Photo is required");
      return;
    }
    setIsLoading(true)
    const toastId = toast.loading("Signing Up...")

    const formData = new FormData();
    formData.append("avatar", avatar);
    formData.append("name", name);
    formData.append("bio", bio);
    formData.append("username", username);
    formData.append("password", password);
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
        // "Content-Type": "application/json",
      },
    };

    axios
      .post(`${server}/user/newUser`, formData, config)
      .then(({data}) => {
        dispatch(userExists(data.user))
        toast.success(
          data.message,
          {
            id:toastId
          }
        )
      })
      .catch((err) => console.log(err))
      .finally(()=>setIsLoading(false))
  };
  const handleFileInputChange = (e) => {
    // console.log("this is the file:" , e.target.files[0])
    const file = e.target.files[0];
    setAvatar(file);
    const reader = new FileReader();
    //here onLoad is like when image will fully readed by the fileReader then only .onload will work
    reader.onload = function (event) {
      const ImageUrl = event.target?.result;
      setUrl(ImageUrl);
    };
    // When you call readAsDataURL(blob), the FileReader starts reading the contents of the specified file asynchronously. Once the reading operation is complete, the load event is triggered, and you can access the data URL representing the file's contents from the result property of the FileReader object.
    reader.readAsDataURL(file);
  };
  const handleFileButton = () => {
    fileInputRef.current.click();
  };
  return (
    <>
   { user && <Navigate to="/"/>}
      <div className="w-screen  h-screen flex justify-center items-center ">
        <div className="w-[25rem] h-[44rem] shadow-2xl bg-white flex flex-col  ">
          <h1 className="text-[2.3rem]  text-center">Sign Up </h1>
          <div
            className={` m-auto rounded-full w-[10em] h-[10em] `}
            style={{
              backgroundImage: ` url("${url}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <input
              required
              ref={fileInputRef}
              onChange={handleFileInputChange}
              type="file"
              className="hidden"
            />
            <button
              onClick={handleFileButton}
              className="w-[3em] h-[3em] rounded-full bg-cover bg-center bg-[url('https://i.pinimg.com/564x/c0/6a/08/c06a08ea9251aa54cd177b6fb1af1d90.jpg')]"
            ></button>
            {requiredFeildError && (
              <h1 className="relative top-[7rem] left-[0.7rem] text-red-700">
                {requiredFeildError}
              </h1>
            )}
          </div>
          <form
            autoComplete="off"
            onSubmit={handleSubmit}
            className="flex flex-col  justify-center items-center text-[1.2rem] gap-[0.7rem]  p-[1.7rem] "
          >
            <InputComp setName={setName} name={name} type="text" placeholder="name" />
            <InputComp setBio={setBio} bio={bio} type="text" placeholder="bio" />
            <InputComp
              setUsernmae={setUsername}
              username ={username}
              type="text"
              placeholder="username"
            />
            <InputComp
              setPassword={setPassword}
              password ={password}
              type="password"
              placeholder="password"
            />
            <div className="  w-full mt-[1.3rem] flex flex-col gap-[0.2rem]">
              <ButtonComp disable={isLoading} type={"submit"} Content={"Signup"} />
              <h1 className="text-center">Or</h1>
              <Link to="/login">
                <ButtonComp disable = {isLoading} Content={"Login Instead"} />
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
export default Signup;
