import React, { useEffect, useState } from "react";
import BlogCard from "../components/BlogCard";
import SearchBar from "../components/SearchBar";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../redux/slices/postThunk";
import { getCategories } from "../redux/slices/categorySlice";

const Blog = () => {
  const dispatch = useDispatch();
  const { posts, loading, error, currentPage, totalPages } = useSelector(
    (state) => state.posts
  );
  const { categories } = useSelector((state) => state.categories);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getPosts(currentPage));
  }, [dispatch, currentPage]);

  const filteredBlogs = posts.filter((post) => {
    const matchCategory = category === "All" || post.category === category;
    const matchSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      dispatch(getPosts(page));
    }
  };

  return (
    <div className="max-w-full px-4 sm:px-8 bg-base-300 shadow-md min-h-screen mt-16 pb-2">
      <div className="flex flex-col items-center justify-center text-center py-6 gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold">Blogs</h1>
        <p className="text-gray-400 max-w-xl mb-4">
          Explore a variety of blogs on different topics. Whether you're looking
          for inspiration, information, or just a good read, you'll find it
          here.
        </p>
        <SearchBar
          searchTerm={searchTerm}
          onSearch={setSearchTerm}
          category={category}
          onCategoryChange={setCategory}
          categories={categories}
        />
      </div>

      <div className="flex justify-center w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4 max-w-7xl w-full">
          {loading ? (
            <div className="col-span-full flex justify-center items-center h-96">
              <span className="loading loading-bars loading-lg text-primary"></span>
            </div>
          ) : error ? (
            <p className="text-error col-span-full text-center">{error}</p>
          ) : filteredBlogs.length > 0 ? (
            filteredBlogs.map((post) => <BlogCard key={post._id} blog={post} />)
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No blogs found.
            </p>
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 my-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="btn btn-sm btn-outline"
          >
            Previous
          </button>
          <span className="text-sm font-semibold">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="btn btn-sm btn-outline"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Blog;
