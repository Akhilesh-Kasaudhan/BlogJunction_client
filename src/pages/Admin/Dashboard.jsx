import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, deleteUserProfile } from "../../redux/slices/authThunks";
import { toast } from "react-toastify";
import {
  getPosts,
  deletePost,
  toggleFeaturedStatus,
  getFeaturedPosts,
} from "../../redux/slices/postThunk";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { allUsers, user: currentUser } = useSelector((state) => state.auth);
  const [localUsers, setLocalUsers] = useState([]);
  const { posts } = useSelector((state) => state.posts);
  const [togglingPostId, setTogglingPostId] = useState(null);

  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(getPosts(1));
  }, [dispatch]);

  useEffect(() => {
    setLocalUsers(allUsers);
  }, [allUsers]);

  const handleDeleteUser = async (id) => {
    const res = await dispatch(deleteUserProfile(id));
    if (res.meta.requestStatus === "fulfilled") {
      setLocalUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success("User deleted successfully");
    } else {
      toast.error(res.payload?.message || "Deletion failed");
    }
  };

  const handleDeletePost = (id) => {
    dispatch(deletePost(id));
    toast.success("Post deleted successfully");
  };

  const handleToggleFeatured = async (id) => {
    setTogglingPostId(id);
    const res = await dispatch(toggleFeaturedStatus(id));
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Featured status toggled");
      await dispatch(getPosts(1));
      await dispatch(getFeaturedPosts());
    } else {
      toast.error("Toggle failed");
    }
    setTogglingPostId(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Users Table */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">All Users</h2>
        <div className="overflow-x-auto border rounded-md">
          <div className="h-96 overflow-y-auto">
            <table className="w-full table">
              <thead className="bg-base-200 sticky top-0 z-10">
                <tr className="bg-gray-100 text-left">
                  <th className="py-2 px-4">Name</th>
                  <th className="py-2 px-4">Email</th>
                  <th className="py-2 px-4">Role</th>
                  <th className="py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {localUsers.map((user) => (
                  <tr key={user._id} className="border-t hover:bg-base-300">
                    <td className="py-2 px-4">{user.username}</td>
                    <td className="py-2 px-4">{user.email}</td>
                    <td className="py-2 px-4">{user.role}</td>
                    <td className="py-2 px-4">
                      {user._id !== currentUser?._id && (
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="btn btn-sm btn-error text-white"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Posts Table */}
      <div>
        <h2 className="text-xl font-semibold mb-4">All Posts</h2>
        <div className="overflow-x-auto border rounded-md">
          <div className="h-96 overflow-y-auto">
            <table className="w-full table">
              <thead className="bg-base-200 sticky top-0 z-10">
                <tr className="bg-gray-100 text-left">
                  <th className="py-2 px-4">Title</th>
                  <th className="py-2 px-4">Author</th>
                  <th className="py-2 px-4">Featured</th>
                  <th className="py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post._id} className="border-t hover:bg-base-300">
                    <td className="py-2 px-4" title={post.title}>
                      {" "}
                      {post.title.split(" ").slice(0, 5).join(" ")}
                      {post.title.split(" ").length > 5 ? "..." : ""}
                    </td>
                    <td className="py-2 px-4">
                      {post.author?.username || "Unknown"}
                    </td>
                    <td className="py-2 px-4">
                      {post.isFeatured ? "Yes" : "No"}
                    </td>
                    <td className="py-2 px-4 space-x-2 flex items-center justify-center gap-4">
                      <button
                        onClick={() => handleToggleFeatured(post._id)}
                        className="btn btn-sm btn-info text-white flex items-center gap-2"
                        disabled={togglingPostId === post._id}
                      >
                        {togglingPostId === post._id ? (
                          <span className="loading loading-spinner loading-sm"></span>
                        ) : (
                          "Toggle Featured"
                        )}
                      </button>
                      <button
                        onClick={() => handleDeletePost(post._id)}
                        className="btn btn-sm btn-error text-white"
                      >
                        Delete Post
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
