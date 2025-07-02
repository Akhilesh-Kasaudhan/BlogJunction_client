import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const BlogCard = ({ blog }) => {
  const { _id, title, desc, image, category } = blog;
  const postId = _id;

  return (
    <motion.div
      whileHover={{ sacle: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Link
        to={`/blog/${postId}`}
        className="no-underline text-base-content"
        aria-label={`Read more about ${title}`}
      >
        <div className="card bg-base-100 max-w-80 shadow-sm hover:shadow-lg shadow-gray-500 border border-base-200 transition duration-300 h-96">
          <figure className="relative h-48 overflow-hidden">
            <img
              src={
                image?.secure_url ||
                "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
              }
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </figure>
          <div className="card-body p-4 space-y-2">
            <h2 className="card-title line-clamp-2 text-base sm:text-lg font-semibold">
              {title}
            </h2>
            <p className="text-sm text-gray-600 line-clamp-3">{desc}</p>
            <div className="card-actions justify-between items-center mt-2">
              {category && (
                <div className="badge badge-outline badge-sm text-xs">
                  {category}
                </div>
              )}
              <span className="text-primary text-sm font-medium">
                Read more →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default BlogCard;
