import React, { useState, useEffect } from "react";
import BlogCard from "./BlogCard";
import SearchBar from "./SearchBar";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getPosts,
  getMostLikedPosts,
  getFeaturedPosts,
} from "../redux/slices/postThunk";
import { motion } from "framer-motion";

const sectionVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
    },
  }),
};

const FeaturedBlogs = () => {
  const dispatch = useDispatch();
  const { posts, mostLikedPosts, featuredPosts, loading } = useSelector(
    (state) => state.posts
  );

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(getPosts());
    dispatch(getMostLikedPosts());
    dispatch(getFeaturedPosts());
  }, [dispatch]);

  const filterBlogs = (blogs) =>
    blogs
      ?.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 6);

  const filteredLatest = filterBlogs(posts);
  const filteredMostLiked = filterBlogs(mostLikedPosts);
  const filteredFeatured = filterBlogs(featuredPosts);

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="loading loading-bars loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <motion.div
      className="w-full max-w-7xl flex flex-col mx-auto space-y-12"
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center justify-center">
        <SearchBar
          searchTerm={searchTerm}
          onSearch={setSearchTerm}
          categories={[]} // Safe fallback
          onCategoryChange={() => {}} // No-op
        />
      </div>

      {/* Latest Blogs */}
      <motion.section variants={sectionVariant} custom={1}>
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 px-4">
          🆕 Latest Blogs
        </h2>
        {filteredLatest.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
            {filteredLatest.map((blog, index) => (
              <motion.div
                key={blog._id}
                variants={sectionVariant}
                custom={(index + 1) * 0.1}
              >
                <BlogCard blog={blog} />
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 italic px-4">
            No latest blogs found.
          </p>
        )}
      </motion.section>

      {/* Popular Blogs */}
      <motion.section variants={sectionVariant} custom={2}>
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 px-4">
          🔥 Popular Blogs
        </h2>
        {filteredMostLiked.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
            {filteredMostLiked.map((blog, index) => (
              <motion.div
                key={blog._id}
                variants={sectionVariant}
                custom={(index + 1) * 0.1}
              >
                <BlogCard blog={blog} />
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 italic px-4">
            No popular blogs found.
          </p>
        )}
      </motion.section>

      {/* Featured Blogs */}
      <motion.section variants={sectionVariant} custom={3}>
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 px-4">
          🌟 Featured Blogs
        </h2>
        {filteredFeatured.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
            {filteredFeatured.map((blog, index) => (
              <motion.div
                key={blog._id}
                variants={sectionVariant}
                custom={(index + 1) * 0.1}
              >
                <BlogCard blog={blog} />
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 italic px-4">
            No featured blogs found.
          </p>
        )}
      </motion.section>

      {/* Read More Button */}
      <div className="flex justify-center">
        <Link to="/blog">
          <button className="btn btn-primary">Read More</button>
        </Link>
      </div>
    </motion.div>
  );
};

export default FeaturedBlogs;
