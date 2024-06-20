import React, { useState } from "react";
import { Link } from "react-router-dom";
import { InputComp } from "../components/styles/StyledComponent";
import { ButtonComp } from "../components/styles/StyledComponent";
import axios from "axios";
import { server } from "../constants/server";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { userExists } from "../redux/reducers/auth.reducer";
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading("Logging In...");
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .post(
        `${server}/user/login`,
        {
          username: username,
          password: password,
        },
        config
      )
      .then(({ data }) => {
        dispatch(userExists(data.user));
        toast.success(data.message, {
          id: toastId,
        });
      })
      .catch((err) =>
        {
          toast.error(err?.response?.data?.message || "Something went wrong ", {
          id: toastId,
        })}
      )
      .finally(() => setIsLoading(false));
  };
  return (
    <>
      <div className="w-screen  h-screen flex justify-center items-center ">
        <div className="w-[25rem] h-[33rem] shadow-2xl bg-white flex flex-col  py-[3rem]">
          <h1 className="text-[2.3rem]  text-center">Log In </h1>
          <form
            autoComplete="off"
            onSubmit={handleSubmit}
            className="flex flex-col  justify-center items-center text-[1.2rem] gap-[2rem]  p-[1.7rem] "
          >
            <InputComp set={setUsername} username ={username} type="text" placeholder="username" />
            <InputComp
              setPassword={setPassword}
              password = {password}
              type="password"
              placeholder="password"
            />
            <div className="  w-full flex flex-col gap-[1rem]">
              <ButtonComp
                disable={isLoading}
                type={"submit"}
                Content={"Login"}
              />
              <h1 className="text-center">Or</h1>
              <Link to="/signup">
                <ButtonComp disable={isLoading} Content={"Signup Instead"} />
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
export default Login;
