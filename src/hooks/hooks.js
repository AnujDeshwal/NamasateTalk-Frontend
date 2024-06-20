import { useEffect } from "react"
// basically you wouuld be wonddering why i am using useEffect here because it is necessary because listeners should listen the event again and again so that when  
export const useSocketEvents =(socket , handlers) =>{

    // Object.entries converts this object into an array of key-value pairs (entries), where each entry is an array itself:

// here handler is key:value pairs means it is a object basically 
    useEffect(()=>{
        if (!socket) {
            console.log("Socket is not connected");
            return;
          }
        // Object.entries is just  a way to iterate over object  , map could not be used with object
        Object.entries(handlers).forEach(([event , handler])=>{
            // Once you set up event listeners using socket.on within useEffect, those listeners will remain active and will respond to events emitted on the socket. This behavior is independent of whether useEffect is currently executing or not. 
            // console.log("Listening for the event"  , event)
            socket.on(event , handler);
        })  
        return ()=>{
            Object.entries(handlers).forEach(([event , handler])=>{
                socket.off(event , handler);
            })  
        }
    },[socket , handlers])
}