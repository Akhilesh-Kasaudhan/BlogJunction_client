import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import CreateBlog from "./pages/CreateBlog";
import Navbar from "./components/Navbar";
import Login from "./components/login";
import SingleBlog from "./components/SingleBlog";
import Footer from "./components/Footer";
import { useDispatch } from "react-redux";
import "./index.css";
import { fetchUserProfile } from "./redux/slices/authThunks";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  return (
    <div className=" bg-base-200 h-full">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        pauseOnHover
        theme="colored"
      />
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/blog/:postId" element={<SingleBlog />} />
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateBlog />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={<div className="text-center mt-20">Page Not Found</div>}
        />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
