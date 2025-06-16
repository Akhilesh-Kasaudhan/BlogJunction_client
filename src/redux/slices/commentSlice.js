import {
  createSlice,
  createAsyncThunk,
  isRejectedWithValue,
} from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const writeComments = createAsyncThunk(
  "comments/writeComment",
  async ({ content, id }, { rejectedWithValue }) => {
    try {
      const res = await axios.post(
        `${API_URL}/comments/`,
        { content, postId: id },
        { withCredentials: true }
      );
      return res.data.comment;
    } catch (error) {
      return rejectedWithValue(error.respons.data.message);
    }
  }
);

export const getCommentsForPost = createAsyncThunk(
  "comments/getCommentsForPost",
  async (postId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/comments/${postId}`, {
        withCredentials: true,
      });

      return res.data.comments; // Correct array
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async (commentId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/comments/${commentId}`, {
        withCredentials: true,
      });
      return commentId;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

const commentSlice = createSlice({
  name: "comments",
  initialState: {
    comments: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCommentsForPost.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCommentsForPost.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(getCommentsForPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(writeComments.fulfilled, (state, action) => {
        state.comments.unshift(action.payload);
      })
      .addCase(writeComments.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter((c) => c._id !== action.payload);
      });
  },
});

export default commentSlice.reducer;
