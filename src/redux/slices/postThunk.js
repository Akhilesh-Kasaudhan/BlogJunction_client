import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/posts";

export const createPost = createAsyncThunk(
  "posts/createPost",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
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
      const response = await axios.get(`${API_URL}?page=${page}`);
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
      const response = await axios.get(`${API_URL}/${postId}`);
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
      const response = await axios.put(`${API_URL}/${postId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
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
      const response = await axios.delete(`${API_URL}/${postId}`, {
        withCredentials: true,
      });
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
      const { data } = await axios.put(
        `${API_URL}/like/${postId}`,
        {},
        {
          withCredentials: true,
        }
      );
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
      const response = await axios.get(`${API_URL}/most-liked`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getFeaturedPosts = createAsyncThunk(
  "posts/getFeaturedPosts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/featured`);
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
          ? `${API_URL}?page=${page}`
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
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/user/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getSummarizeContent = createAsyncThunk(
  "posts/getSummarizeContent",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/summarize/${postId}`, {
        withCredentials: true,
      });
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
      const response = await axios.post(
        `${API_URL}/generate-content`,
        {
          title,
          desc,
        },
        { withCredentials: true }
      );

      return response.data.content;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to generate content"
      );
    }
  }
);
