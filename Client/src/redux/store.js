import { configureStore } from "@reduxjs/toolkit";
import { alertSlice } from "./features/alertSlice";
import authReducer from "./features/authSlice";
import { userSlice } from "./features/userSlice";

export default configureStore({
  reducer: {
    alerts: alertSlice.reducer,
    user: userSlice.reducer,
    auth: authReducer,
  },
});