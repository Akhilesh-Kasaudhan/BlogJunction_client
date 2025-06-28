import React from "react";
import { Link } from "react-router-dom"; // If using routing

const BlogCard = ({ blog }) => {
  const { _id, title, desc, image, category } = blog;
  const postId = _id;

  return (
    <Link to={`/blog/${postId}`} className="no-underline">
      <div className="card bg-base-100 max-w-80 shadow-sm hover:shadow-lg shadow-gray-500 transition-shadow duration-300 hover:cursor-pointer line-clamp-1 h-96">
        <figure>
          <img
            src={
              image?.secure_url ||
              "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
            }
            alt={title}
            className="w-full h-48 object-cover"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title line-clamp-2">{title}</h2>
          <p className="text-sm text-gray-600 line-clamp-3">{desc}</p>
          <div className="card-actions justify-end">
            {category && <div className="badge badge-outline">{category}</div>}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
