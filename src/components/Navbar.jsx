import React, { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  logoutUser,
  fetchUserProfile,
  updateUserProfile,
} from "../redux/slices/authThunks";
import { CircleUser } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  console.log("isAuthenticated:", isAuthenticated, user);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (user) {
      reset(user);
    }
  }, [user, reset]);

  const handleLogout = async () => {
    dispatch(logoutUser());
    toast.success("User logged out");
    navigate("/login");
  };

  const handleProfileUpdate = (data) => {
    dispatch(updateUserProfile(data));

    setShowProfileModal(false);
    toast.success("Profile Updated Successfully");
  };

  const navLinkClasses = ({ isActive }) =>
    isActive ? "btn btn-ghost text-primary font-bold" : "btn btn-ghost";

  return (
    <div className="navbar bg-base-100 shadow-md px-4 lg:px-8 fixed top-0 left-0 w-full z-50">
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          <img src="/fvicon.png" alt="logo" className="w-10 rounded-full" />
          <span className="ml-2 hidden sm:inline">BlogJunction</span>
        </Link>
      </div>

      <div className="navbar-center lg:hidden">
        <button
          className="btn btn-ghost"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      <div className="navbar-center hidden lg:flex gap-4">
        <NavLink to="/blog" className={navLinkClasses}>
          Blogs
        </NavLink>
        <NavLink to="/create" className={navLinkClasses}>
          Create Blog
        </NavLink>
        {isAuthenticated && user?.role == "admin" && (
          <NavLink to="/dashboard" className={navLinkClasses}>
            Dashboard
          </NavLink>
        )}
      </div>

      {!menuOpen && (
        <div className="navbar-end gap-2">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              {isAuthenticated && (
                <button
                  className="btn btn-circle"
                  onClick={() => setShowProfileModal(true)}
                >
                  <CircleUser size={20} />
                </button>
              )}
              <button className="btn btn-error btn-md" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-end">
              Login
            </Link>
          )}
        </div>
      )}

      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-base-100 shadow-md flex flex-col lg:hidden z-50">
          <NavLink
            to="/blog"
            className="btn btn-ghost w-full"
            onClick={() => setMenuOpen(false)}
          >
            Blogs
          </NavLink>
          <NavLink
            to="/create"
            className="btn btn-ghost w-full"
            onClick={() => setMenuOpen(false)}
          >
            Create Blog
          </NavLink>
          {isAuthenticated && user?.role == "admin" && (
            <NavLink
              to="/dashboard"
              className="btn btn-ghost w-full"
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </NavLink>
          )}
          {isAuthenticated ? (
            <>
              <button
                className="btn btn-ghost w-full"
                onClick={() => {
                  setShowProfileModal(true);
                  setMenuOpen(false);
                }}
              >
                Profile
              </button>
              <button
                className="btn btn-error m-2"
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="btn btn-primary m-2 "
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      )}
      {isAuthenticated && showProfileModal && (
        <div className="fixed inset-0 bg-base-200/95  bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-base-100 p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              className="btn btn-sm btn-circle absolute right-2 top-2"
              onClick={() => setShowProfileModal(false)}
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">User Profile</h2>
            <form
              onSubmit={handleSubmit(handleProfileUpdate)}
              className="space-y-4"
            >
              <div>
                <label className="label">Username</label>
                <input
                  className="input input-bordered w-full"
                  {...register("username", {
                    required: "Username is required",
                  })}
                />
                {errors.username && (
                  <p className="text-error text-sm">
                    {errors.username.message}
                  </p>
                )}
              </div>
              <div>
                <label className="label">Email</label>
                <input
                  className="input input-bordered w-full"
                  type="email"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <p className="text-error text-sm">{errors.email.message}</p>
                )}
              </div>
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
