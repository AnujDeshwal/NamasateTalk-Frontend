import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    isMobile :false,
    noDrawer:true,
    isFileMenu:false,
    isNewGroupDialog:false
}

const miscSlice = createSlice({
    name:"misc",
    initialState,
    reducers:{
        setMobile:(state,action)=>{
            state.isMobile=true
        },
        unSetMobile:(state,action)=>{
            state.isMobile=false
        },
        setNoDrawer:(state,action)=>{
            state.noDrawer=true
        },
        unSetNoDrawer:(state,action)=>{
            state.noDrawer=false
        } , 
        setMobileAndunSetNoDrawer:(state)=>{
            state.isMobile=true;
            state.noDrawer=false;
        },
        setFileMenu:(state,action)=>{
            state.isFileMenu=true
        },
        unSetFileMenu:(state,action)=>{
            state.isFileMenu=false
        },
        setNewGroupDialog:(state,action)=>{
            state.isNewGroupDialog=action.payload
        }
    }
})
export default miscSlice;
export const {setMobile , unSetMobile ,setNoDrawer , unSetNoDrawer , setMobileAndunSetNoDrawer,setFileMenu  ,unSetFileMenu ,setNewGroupDialog} = miscSlice.actions;