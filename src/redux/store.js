import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/auth.reducer.js";
import chatSlice from "./reducers/chat.reducer.js";
import miscSlice from "./reducers/misc.reducer.js";

const store = configureStore({
   reducer:{
    [authSlice.name]:authSlice.reducer,
    [chatSlice.name]:chatSlice.reducer,
    [miscSlice.name]:miscSlice.reducer,
   }
})
export default store ;