import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getPosts,
  deletePost,
  toggleFeaturedStatus,
} from "../redux/slices/postThunk";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { allUsers } = useSelector((state) => state.user);
  const { posts } = useSelector((state) => state.post);

  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(fetchPosts());
  }, [dispatch]);

  const handleDeleteUser = (id) => {
    dispatch(deleteUser(id));
  };

  const handleDeletePost = (id) => {
    dispatch(deletePost(id));
  };

  const handleToggleFeatured = (id) => {
    dispatch(toggleFeatured(id));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Users Table */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">All Users</h2>
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Role</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allUsers.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="py-2 px-4">{user.name}</td>
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4">{user.role}</td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Posts Table */}
      <div>
        <h2 className="text-xl font-semibold mb-4">All Posts</h2>
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-4">Title</th>
              <th className="py-2 px-4">Author</th>
              <th className="py-2 px-4">Featured</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post._id} className="border-t">
                <td className="py-2 px-4">{post.title}</td>
                <td className="py-2 px-4">{post.author?.name || "Unknown"}</td>
                <td className="py-2 px-4">{post.isFeatured ? "Yes" : "No"}</td>
                <td className="py-2 px-4 space-x-2">
                  <button
                    onClick={() => handleToggleFeatured(post._id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded"
                  >
                    Toggle Featured
                  </button>
                  <button
                    onClick={() => handleDeletePost(post._id)}
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
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
  );
};

export default Dashboard;
