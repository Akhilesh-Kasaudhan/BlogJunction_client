import React from "react";
import HomeHero from "../components/HomeHero";
import Newsletter from "../components/Newsletter";
import FeaturedBlogs from "../components/FeaturedBlogs";

const Home = () => {
  return (
    <div className="mt-24 flex flex-col items-center gap-10 px-4 sm:px-8 bg-base-200 py-8">
      <HomeHero />
      <FeaturedBlogs />
      <Newsletter />
    </div>
  );
};

export default Home;
