import React from "react";
import { Link } from "react-router-dom";
import { Rocket } from "lucide-react";
import { motion } from "framer-motion";

const HomeHero = () => {
  return (
    <motion.section
      className="w-full bg-base-200 py-10 rounded-xl shadow-sm text-center "
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="badge badge-info badge-outline mb-6 px-4 py-2 text-sm">
          <span className="font-semibold">🚀 New: AI feature integrated</span>
        </div>
        <motion.h1
          className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Share your thoughts, build your voice <br />
          on <span className="text-primary">Blog Junction</span>
        </motion.h1>
        <motion.p
          className="text-gray-500 text-lg max-w-xl mx-auto mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Publish stories that matter. Whether it's insights, ideas, or your
          daily experiences — this platform is yours to write without limits.
        </motion.p>

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <Link to="/create" className="btn btn-primary btn-wide">
            <Rocket size={18} className="mr-2" /> Start Writing
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HomeHero;
