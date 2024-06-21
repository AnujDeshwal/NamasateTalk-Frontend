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
        // always try to give different value to state.refetch so that it would change on each refetch otherwise it will have same value and react will take it same so refetch will not happen 
        state.refetch=!state.refetch
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