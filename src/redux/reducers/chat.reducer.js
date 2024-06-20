import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    members: [],
    refetch:false,
    creator:"",
    groupChat:false,
}

const chatSlice = createSlice({
    name:"chat",
    initialState,
    reducers:{
       saveMembers :(state , action)=>{
        state.members = action.payload
       },
       setRefetch:(state)=>{
        state.refetch=true
       },
       setGroupCreator:(state,action)=>{
        state.creator=action.payload;
       },
       setGroupChat:(state,action)=>{
        state.groupChat=action.payload;
       },
    }
})
export default chatSlice;
export const {saveMembers ,setRefetch,setGroupCreator,setGroupChat} = chatSlice.actions;