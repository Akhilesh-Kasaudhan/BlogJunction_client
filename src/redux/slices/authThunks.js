import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../../api/axios";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/$/, "");

const getErrorMessage = (error) => {
  return (
    error.response?.data?.message ||
    error.response?.data ||
    error.message ||
    "Something went wrong"
  );
};

// REGISTER
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `${API_URL}/auth/register`,
        formData,
        { withCredentials: true }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// LOGIN

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/auth/login",
        formData
      );

      const { token } = response.data;

      if (!token) {
        return rejectWithValue("Login response did not contain a token");
      }

      localStorage.setItem("token", token);

      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);


// LOGOUT
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/logout");
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    } finally {
      localStorage.removeItem("token");
    }
  }
);

// FETCH LOGGED-IN USER
export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await  axiosInstance.get(
        `${API_URL}/auth/profile`,
        { withCredentials: true }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// UPDATE PROFILE
export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/auth/profile`,
        formData,
        { withCredentials: true }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// DELETE PROFILE
export const deleteUserProfile = createAsyncThunk(
  "auth/deleteUserProfile",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `${API_URL}/auth/profile/${id}`,
        { withCredentials: true }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// GET ALL USERS
export const getAllUsers = createAsyncThunk(
  "auth/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `${API_URL}/auth/`,
        { withCredentials: true }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);