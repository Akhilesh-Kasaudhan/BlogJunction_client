import React, { useState, useEffect } from "react";
import BlogCard from "./BlogCard";
import SearchBar from "./SearchBar";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getPosts, getMostLikedPosts } from "../redux/slices/postThunk";
import { getCategories } from "../redux/slices/categorySlice";
const FeaturedBlogs = ({ blogs }) => {
  const dispatch = useDispatch();
  const { posts } = useSelector((state) => state.posts);

  const { mostLikedPosts } = useSelector((state) => state.posts);

  const { categories } = useSelector((state) => state.categories);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  useEffect(() => {
    dispatch(getCategories());
    dispatch(getPosts());
    dispatch(getMostLikedPosts());
  }, [dispatch]);

  const filterBlogs = (blogs) =>
    blogs
      ?.filter((post) => {
        const matchCategory = category === "All" || post.category === category;
        const matchSearch =
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.content.toLowerCase().includes(searchTerm.toLowerCase());
        return matchCategory && matchSearch;
      })
      .slice(0, 5);

  const filteredLatest = filterBlogs(posts);
  const filteredMostLiked = filterBlogs(mostLikedPosts);

  return (
    <div className="w-full max-w-7xl flex flex-col mx-auto ">
      <div className="flex items-center justify-center ">
        <SearchBar
          searchTerm={searchTerm}
          onSearch={setSearchTerm}
          category={category}
          onCategoryChange={setCategory}
        />
      </div>
      <h2 className="text-2xl font-bold mb-4">Latest Blogs</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {filteredLatest.map((blog) => (
          <BlogCard key={blog._id || blog.id} blog={blog} />
        ))}
      </div>

      <div className="my-10 border-t border-gray-300" />

      <h2 className="text-2xl font-bold mt-10 mb-4">Popular Blogs</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {filteredMostLiked.map((blog) => (
          <BlogCard key={blog._id || blog.id} blog={blog} />
        ))}
      </div>
      <Link to="/blog" className="flex items-center justify-center gap-2 mt-4">
        {" "}
        <button className="btn btn-primary ">Read More</button>
      </Link>
    </div>
  );
};

export default FeaturedBlogs;
