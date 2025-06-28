import { createSlice } from "@reduxjs/toolkit";
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  toggleLike,
  getMostLikedPosts,
  getFeaturedPosts,
  getPostsByCategory,
  getPostsByUser,
  getSummarizeContent,
  generateContent,
  toggleFeaturedStatus,
} from "./postThunk";

const initialState = {
  posts: [],
  mostLikedPosts: [],
  featuredPosts: [],
  userPosts: [],
  summary: "",
  summaryLoading: false,
  summaryError: null,
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
  generatedContent: "",
  generateLoading: false,
  generateError: null,
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload.post);
        state.loading = false;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getPosts.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.posts = action.payload.posts;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.loading = false;
      })

      .addCase(getPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPostById.fulfilled, (state, action) => {
        const index = state.posts.findIndex(
          (post) => post._id === action.payload.post._id
        );
        if (index !== -1) {
          state.posts[index] = action.payload.post;
        } else {
          state.posts.push(action.payload.post);
        }
        state.loading = false;
      })
      .addCase(getPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(
          (post) => post._id === action.payload._id
        );
        if (index !== -1) {
          state.posts[index] = action.payload.post;
        }
        state.loading = false;
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(
          (post) => post._id !== action.payload.postId
        );
        state.loading = false;
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleLike.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        const updatedPost = action.payload;
        const index = state.posts.findIndex(
          (post) => post._id === updatedPost._id
        );
        if (index !== 1) {
          state.posts[index] = updatedPost;
        } else {
          state.posts.push(updatedPost);
        }
      })
      .addCase(toggleLike.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getMostLikedPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMostLikedPosts.fulfilled, (state, action) => {
        state.mostLikedPosts = action.payload.posts;
        state.loading = false;
      })
      .addCase(getMostLikedPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getFeaturedPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeaturedPosts.fulfilled, (state, action) => {
        state.featuredPosts = action.payload.posts;
        state.loading = false;
      })
      .addCase(getFeaturedPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleFeaturedStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleFeaturedStatus.fulfilled, (state, action) => {
        const updatedPost = action.payload.post;
        const index = state.posts.findIndex(
          (post) => post._id === updatedPost._id
        );
        if (index !== -1) {
          state.posts[index] = updatedPost;
        }
        state.loading = false;
      })
      .addCase(toggleFeaturedStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getPostsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPostsByCategory.fulfilled, (state, action) => {
        state.posts = action.payload.posts;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.loading = false;
      })
      .addCase(getPostsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getPostsByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPostsByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userPosts = action.payload.posts;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(getPostsByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getSummarizeContent.pending, (state) => {
        state.summaryLoading = true;
        state.summaryError = null;
      })
      .addCase(getSummarizeContent.fulfilled, (state, action) => {
        state.summaryLoading = false;
        state.summary = action.payload;
      })
      .addCase(getSummarizeContent.rejected, (state, action) => {
        state.summaryLoading = false;
        state.summaryError = action.payload;
      })
      .addCase(generateContent.pending, (state) => {
        state.generateLoading = true;
        state.generateError = null;
      })
      .addCase(generateContent.fulfilled, (state, action) => {
        state.generateLoading = false;
        state.generatedContent = action.payload;
      })
      .addCase(generateContent.rejected, (state, action) => {
        state.generateLoading = false;
        state.generateError = action.payload;
      });
  },
});
export const { setCurrentPage } = postSlice.actions;

export default postSlice.reducer;
