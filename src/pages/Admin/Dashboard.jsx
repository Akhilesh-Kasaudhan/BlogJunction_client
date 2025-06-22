import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, deleteUserProfile } from "../../redux/slices/authThunks";

import {
  getPosts,
  deletePost,
  toggleFeaturedStatus,
} from "../../redux/slices/postThunk";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { allUsers } = useSelector((state) => state.auth);
  const { posts } = useSelector((state) => state.posts);

  useEffect(() => {
    console.log("dashboard mounted:::::from dashboard");
    dispatch(getAllUsers());
    dispatch(getPosts(1));
  }, [dispatch]);

  const handleDeleteUser = (id) => {
    dispatch(deleteUserProfile(id));
  };

  const handleDeletePost = (id) => {
    dispatch(deletePost(id));
  };

  const handleToggleFeatured = (id) => {
    dispatch(toggleFeaturedStatus(id));
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
                {allUsers.map((user) => (
                  <tr key={user._id} className="border-t hover:bg-base-300">
                    <td className="py-2 px-4">{user.username}</td>
                    <td className="py-2 px-4">{user.email}</td>
                    <td className="py-2 px-4">{user.role}</td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="btn btn-sm btn-error text-white"
                      >
                        Delete
                      </button>
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
                    <td className="py-2 px-4">{post.title}</td>
                    <td className="py-2 px-4">
                      {post.author?.name || "Unknown"}
                    </td>
                    <td className="py-2 px-4">
                      {post.isFeatured ? "Yes" : "No"}
                    </td>
                    <td className="py-2 px-4 space-x-2">
                      <button
                        onClick={() => handleToggleFeatured(post._id)}
                        className="btn btn-sm btn-info text-white"
                      >
                        Toggle Featured
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
