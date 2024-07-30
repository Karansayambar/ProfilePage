import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { auth, db } from "../firebase"; // Ensure Firebase is correctly initialized
import { doc, getDoc, updateDoc } from "firebase/firestore";

// Fetch user data from Firestore
export const fetchUser = createAsyncThunk("user/fetchUser", async () => {
  return new Promise((resolve, reject) => {
    // Listen for authentication state changes
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          // Fetch user document from Firestore
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            resolve(userDoc.data()); // Resolve with user data
          } else {
            reject(new Error("User data not found")); // Reject if no data found
          }
        } catch (error) {
          reject(error); // Reject if there is an error
        }
      } else {
        reject(new Error("No user is signed in")); // Reject if no user is signed in
      }
      unsubscribe(); // Unsubscribe to avoid memory leaks
    });
  });
});

// Update user data in Firestore
export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (updatedData, { rejectWithValue }) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, updatedData); // Update user document
        const updatedUserDoc = await getDoc(userRef);
        return updatedUserDoc.data(); // Return updated user data
      } catch (error) {
        return rejectWithValue(error.message); // Return error message if update fails
      }
    } else {
      return rejectWithValue("No user is signed in"); // Return error if no user is signed in
    }
  }
);

// Handle pending state
const handlePending = (state) => {
  state.loading = true;
  state.error = null;
};

// Handle fulfilled state
const handleFulfilled = (state, action) => {
  state.userData = action.payload;
  state.loading = false;
};

// Handle rejected state
const handleRejected = (state, action) => {
  state.loading = false;
  state.error = action.error.message;
};

// Create slice
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
