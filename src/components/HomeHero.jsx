import React from "react";
import BlogCard from "./BlogCard";

const HomeHero = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center px-8  bg-base-200">
      <div className="badge badge-info badge-outline mb-4 px-4 py-2 text-sm">
        <span className="font-semibold">New: AI feature integrated</span>
        <span className="ml-2 text-xs">⭐</span>
      </div>

      <h1 className="text-4xl sm:text-5xl font-bold leading-snug mb-4">
        Your own <span className="text-primary">blogging</span> <br />
        platform.
      </h1>

      <p className="text-gray-400 max-w-xl mb-8">
        This is your space to think out loud, to share what matters, and to
        write without filters. Whether it's one word or a thousand, your story
        starts right here.
      </p>
      {/* latest blogs */}
    </div>
  );
};

export default HomeHero;
