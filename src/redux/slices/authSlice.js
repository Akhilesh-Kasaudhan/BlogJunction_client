
import { createSlice } from "@reduxjs/toolkit";

import {
  registerUser,
  loginUser,
  logoutUser,
  fetchUserProfile,
  updateUserProfile,
  deleteUserProfile,
  getAllUsers,
} from "./authThunks";

const initialState = {
  user: null,
  token: null,
  allUsers: [],
  isAuthenticated: false,
  hasFetchedProfile: false,
  loading: false,
  error: null,
};

const clearAuthState = (state) => {
  state.user = null;
  state.token = null;
  state.isAuthenticated = false;
  state.loading = false;
  state.error = null;
  state.hasFetchedProfile = true;
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    logout: (state) => {
      clearAuthState(state);
     
    },

    clearAuthError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
     .addCase(loginUser.fulfilled, (state, action) => {
  state.user = action.payload.user;
  state.token = action.payload.token;
  state.isAuthenticated = !!action.payload.user;
  state.loading = false;
  state.hasFetchedProfile = true;
  state.error = null;
})
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload || "Login failed";
      })

      // FETCH PROFILE
      .addCase(fetchUserProfile.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        const user = action.payload?.user;

        state.user = user || null;
        state.isAuthenticated = !!user;
        state.hasFetchedProfile = true;
        state.loading = false;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        clearAuthState(state);
        state.hasFetchedProfile = true;
        state.error = action.payload || "Not authenticated";
      })

      // LOGOUT
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        clearAuthState(state);
      })
      .addCase(logoutUser.rejected, (state) => {
        // Clear local authentication even if the server
        // logout request fails.
        clearAuthState(state);
        state.hasFetchedProfile = true;
      })

      // UPDATE PROFILE
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = {
          ...state.user,
          ...action.payload.user,
        };
        state.loading = false;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE USER
      .addCase(deleteUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserProfile.fulfilled, (state, action) => {
        const deletedUserId = action.payload.deletedUserId;

        state.allUsers = state.allUsers.filter(
          (user) => user._id !== deletedUserId
        );

        state.loading = false;
      })
      .addCase(deleteUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET ALL USERS
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.allUsers = action.payload.users || [];
        state.loading = false;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;

export default authSlice.reducer;
