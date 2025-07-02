import React, { useEffect, lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./index.css";

import Home from "./pages/Home";
import Blog from "./pages/Blog";
import Navbar from "./components/Navbar";
import Login from "./components/login";
import SingleBlog from "./components/SingleBlog";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import { fetchUserProfile } from "./redux/slices/authThunks";

const CreateBlog = lazy(() => import("./pages/CreateBlog"));
const Dashboard = lazy(() => import("./pages/Admin/Dashboard"));

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
};

const App = () => {
  const dispatch = useDispatch();
  const { hasFetchedProfile } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!hasFetchedProfile) {
      dispatch(fetchUserProfile());
    }
  }, [hasFetchedProfile, dispatch]);

  return (
    <div className=" bg-base-200 h-full ">
      <ScrollToTop />
      <Navbar />
      <Suspense fallback={<div className="text-center mt-20">Loading...</div>}>
        <div className="max-w-full bg-base-300 shadow-md min-h-screen mt-16 pb-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:postId" element={<SingleBlog />} />
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <CreateBlog />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute role="admin">
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Suspense>
      <Footer />
    </div>
  );
};

export default App;
