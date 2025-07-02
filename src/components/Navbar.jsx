import React, { useState, useEffect, useRef, useCallback } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, updateUserProfile } from "../redux/slices/authThunks";
import { getPostsByUser } from "../redux/slices/postThunk";
import { CircleUser, LogOut } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    isAuthenticated,
    user,
    loading: authLoading,
  } = useSelector((state) => state.auth);
  const {
    userPosts,
    currentPage,
    totalPages,
    loading: postsLoading,
  } = useSelector((state) => state.posts);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const observer = useRef();

  useEffect(() => {
    if (user) {
      reset({ password: "" });
    }
  }, [user, reset]);

  useEffect(() => {
    if (showProfileModal) {
      dispatch(getPostsByUser({ userId: user.id, page: 1 }));
    }
  }, [dispatch, user?.id, showProfileModal]);

  const lastPostElementRef = useCallback(
    (node) => {
      if (postsLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (
          entries[0].isIntersecting &&
          currentPage < totalPages &&
          !postsLoading
        ) {
          dispatch(
            getPostsByUser({
              userId: user._id,
              page: currentPage + 1,
            })
          );
        }
      });

      if (node) observer.current.observe(node);
    },
    [postsLoading, currentPage, totalPages, user?._id, dispatch]
  );

  const handleLogout = async () => {
    dispatch(logoutUser());
    toast.success("User logged out");
    navigate("/login");
  };

  const handleProfileUpdate = (data) => {
    dispatch(updateUserProfile({ password: data.password }));
    toast.success("Password Updated Successfully");
    setShowProfileModal(false);
    reset({ password: "" });
  };

  const navLinkClasses = ({ isActive }) =>
    isActive ? "btn btn-ghost text-primary font-bold" : "btn btn-ghost";

  return (
    <div className="navbar bg-base-100 shadow-md px-4 lg:px-8 fixed top-0 left-0 w-full z-50">
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          <img src="/fvicon.png" alt="logo" className="w-10 rounded-full" />
          <span className="ml-2 hidden sm:inline">Blog Junction</span>
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
        <div className="navbar-end gap-2 items-center">
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
              <button
                className="btn btn-error btn-md btn-outline"
                onClick={handleLogout}
              >
                <LogOut size={18} />
                <span className="ml-1 hidden sm:inline">Logout</span>
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
        <div className="absolute top-16 left-0 w-full bg-base-100 shadow-md flex flex-col lg:hidden z-50 transition-all duration-300 ease-in-out">
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

      {/* Profile modal */}
      {isAuthenticated && showProfileModal && (
        <div className="fixed inset-0 bg-base-200/95 backdrop-blur-sm   z-50 flex items-center justify-center overflow-y-auto">
          <div className="bg-base-100 p-6 rounded-lg shadow-lg w-full max-w-4xl relative">
            <button
              className="btn btn-sm btn-circle absolute right-2 top-2"
              onClick={() => setShowProfileModal(false)}
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">User Profile</h2>
            <div className="mb-6 grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Username</label>
                <input
                  type="text"
                  className="input  input-bordered w-full"
                  value={user?.username}
                  disabled
                />
              </div>
              <div>
                <label className="label">Email</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={user?.email}
                  disabled
                />
              </div>
            </div>

            <form
              onSubmit={handleSubmit(handleProfileUpdate)}
              className="space-y-4"
            >
              <div>
                <label className="label">New Password</label>
                <input
                  className="input input-bordered w-full"
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                {errors.password && (
                  <p className="text-error text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={authLoading}
              >
                {authLoading ? "Updating..." : "Change Password"}
              </button>
            </form>

            {postsLoading && !userPosts.length > 0 && (
              <p className="text-center py-2">Loading your posts...</p>
            )}

            {/* Posts table by user */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Your Blog Posts</h3>
              {userPosts?.length > 0 ? (
                <div className="overflow-x-auto max-h-64 overflow-y-auto">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Created At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userPosts.map((post, index) => {
                        const isLast = index === userPosts.length - 1;
                        return (
                          <tr
                            key={post._id}
                            ref={isLast ? lastPostElementRef : null}
                          >
                            <td>{index + 1}</td>
                            <td className="text-sm font-medium">
                              {post.title}
                            </td>
                            <td>
                              {new Date(post.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {postsLoading && (
                    <p className="text-center py-2">Loading more...</p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No blog posts yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
