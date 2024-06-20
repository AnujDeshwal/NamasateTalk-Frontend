import { createContext, useMemo, useContext } from "react";
import io from "socket.io-client";
import {server} from "./constants/server"

const SocketContext = createContext();

const getSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {
  const socket = useMemo(() => io(server, { withCredentials: true }), []);

  return (
    // basically socketContext is same as store to access the thing from anywhere but what value will be accessed that is socket through the use of useContext hook and you will have to provide it like store is provided to the app 
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export { SocketProvider, getSocket };
