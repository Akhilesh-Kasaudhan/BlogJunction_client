import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../../api/axios";

export const createPost = createAsyncThunk(
  "posts/createPost",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/posts/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getPosts = createAsyncThunk(
  "posts/getPosts",
  async (page = 1, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/posts?page=${page}`);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getPostById = createAsyncThunk(
  "posts/getPostById",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/posts/${postId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch post"
      );
    }
  }
);

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ postId, formData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/posts/${postId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/posts/${postId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const toggleLike = createAsyncThunk(
  "posts/toggleLike",
  async (postId, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(`/posts/like/${postId}`, {});
      console.log(data);
      return data.post;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getMostLikedPosts = createAsyncThunk(
  "posts/getMostLikedPosts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/posts/most-liked`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const toggleFeaturedStatus = createAsyncThunk(
  "posys/toggleFeaturedStatus",
  async (postId, { rejectedWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/posts/${postId}/toggle-featured`,
        {}
      );
      return response.data;
    } catch (error) {
      return rejectedWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getFeaturedPosts = createAsyncThunk(
  "posts/getFeaturedPosts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/posts/featured`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getPostsByCategory = createAsyncThunk(
  "posts/getPostsByCategory",
  async ({ category, page = 1 }, { rejectWithValue }) => {
    try {
      const endpoint =
        category === "All"
          ? `${API_URL}/posts?page=${page}`
          : `${API_URL}/category/${category}?page=${page}`;
      const response = await axios.get(endpoint);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getPostsByUser = createAsyncThunk(
  "posts/getPostsByUser",
  async ({ userId, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/posts/user/${userId}?page=${page}&limit=${limit}`
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch user posts" }
      );
    }
  }
);

export const getSummarizeContent = createAsyncThunk(
  "posts/getSummarizeContent",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/posts/summarize/${postId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const generateContent = createAsyncThunk(
  "posts/generateContent",
  async ({ title, desc }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/posts/generate-content`, {
        title,
        desc,
      });

      return response.data.content;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to generate content"
      );
    }
  }
);
