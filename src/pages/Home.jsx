import React from "react";
import HomeHero from "../components/HomeHero";

import Blog from "./Blog";
import Newsletter from "../components/Newsletter";
import FeaturedBlogs from "../components/FeaturedBlogs";

const Home = () => {
  return (
    <div className="mt-24 flex flex-col items-center justify-between gap-6 px-4 sm:px-8 bg-base-200 mb-6 invisible-scroll py-4">
      <HomeHero />
      <FeaturedBlogs />
      <Newsletter />
    </div>
  );
};

export default Home;
