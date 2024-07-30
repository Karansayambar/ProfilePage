import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";

// Configure the Redux store
const store = configureStore({
  reducer: {
    // Add the user slice reducer to the store
    user: userReducer,
  },
});

export default store;
