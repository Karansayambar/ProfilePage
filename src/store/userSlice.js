// src/store/userSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export const fetchUser = createAsyncThunk("user/fetchUser", async () => {
  const user = auth.currentUser;
  if (user) {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      throw new Error("User data not found");
    }
  } else {
    throw new Error("No user is signed in");
  }
});

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (userData) => {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, userData);
      return userData;
    } else {
      throw new Error("No user is signed in");
    }
  }
);

const handlePending = (state) => {
  state.loading = true;
  state.error = null;
};

const handleFulfilled = (state, action) => {
  state.userData = action.payload;
  state.loading = false;
};

const handleRejected = (state, action) => {
  state.loading = false;
  state.error = action.error.message;
};

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, handlePending)
      .addCase(fetchUser.fulfilled, handleFulfilled)
      .addCase(fetchUser.rejected, handleRejected)
      .addCase(updateUser.pending, handlePending)
      .addCase(updateUser.fulfilled, handleFulfilled)
      .addCase(updateUser.rejected, handleRejected);
  },
});

export default userSlice.reducer;
