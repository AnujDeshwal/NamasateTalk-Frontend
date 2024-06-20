import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setNoDrawer, unSetMobile } from "../../redux/reducers/misc.reducer";

const Drawer = ({children}) => {
    const {isMobile} = useSelector(state=>state.misc)
    const {noDrawer} = useSelector(state=>state.misc)
    const dispatch = useDispatch();
    const drawerRef = useRef();
    const [changes , setChanges] = useState(" translate-x-[-100vw]");
useEffect(()=>{
    if(isMobile && !noDrawer){
       setChanges(" translate-x-0 ");
    }
    else setChanges("translate-x-[-66vw] ");
},[isMobile])
const handleOutSideClick = (e) =>{
    if(drawerRef.current && !drawerRef.current.contains(e.target)){
        dispatch(unSetMobile())
        dispatch(setNoDrawer())
    }
}
useEffect(()=>{
    if(isMobile  ){
        document.addEventListener("mousedown" , handleOutSideClick);
    }else {
        document.removeEventListener('mousedown', handleOutSideClick);
      }
      return () => {
        document.removeEventListener('mousedown', handleOutSideClick);
      };
} , [isMobile])
  return (
    <>
{!noDrawer &&       <div className={`z-10 flex sm:hidden absolute top-0 bg-opacity-50 ${isMobile?"bg-black":"hidden"} w-screen h-screen `}>
        <div  ref={drawerRef} className={`flex flex-col ${changes}  transition-all ease-in-out duration-1000 w-[66vw] min-h-screen bg-white`}>
          {children}
        </div>
      </div>}
    </>
  );
};
export default Drawer;
