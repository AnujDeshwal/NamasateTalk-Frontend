import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Signup from "./Pages/Signup";
import { Toaster } from "react-hot-toast";
import Login from "./Pages/Login";
import Chat from "./Pages/Chat";
import axios from "axios";
import { server } from "./constants/server";
import { useDispatch, useSelector } from "react-redux";
import { userExists, userNotExists } from "./redux/reducers/auth.reducer";
import ProtectRoute from "./components/auth/ProtectRoute";
import { SocketProvider } from "./socket";
import ChatWithKey from "./components/specific/ChatWithKey";
import Modal from "./components/shared/Modal";
import NotFound from "./Pages/NotFound";
const App = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  useEffect(() => {
    axios
      .get(`${server}/user/me`, { withCredentials: true })
      .then(({ data }) => {
        dispatch(userExists(data.user));
      })
      .catch((err) => {
        dispatch(userNotExists());
      });
  }, [dispatch]);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            element={
              <SocketProvider>
                <ProtectRoute user={user} />
              </SocketProvider>
            } 
          > 

            <Route path="/" element={<Home />}></Route>
            
            <Route path="/chat/:chatId" element={<ChatWithKey />}></Route>
          </Route>

          <Route
            path="/login"
            element={
              <ProtectRoute user={!user} redirect="/">
                <Login />
              </ProtectRoute>
            }
          ></Route>
          <Route
            path="/signup"
            element={
              <ProtectRoute user={!user} redirect="/">
                <Signup />
              </ProtectRoute>
            } 
          ></Route>
          <Route path="*" element ={<NotFound/>} />
        </Routes>
        <Toaster position="bottom-center" />
      </BrowserRouter>
    </>
  );
};
export default App;
