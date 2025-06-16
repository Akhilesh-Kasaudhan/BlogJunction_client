import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/slices/authSlice";
import postReducer from "../redux/slices/postSlice";
import categoryReducer from "./slices/categorySlice";
import commentReducer from "./slices/commentSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer,
    categories: categoryReducer,
    comments: commentReducer,
  },
});
