import React from "react";
import { Search } from "lucide-react";

const SearchBar = ({
  searchTerm,
  onSearch,
  category,
  onCategoryChange,
  categories = [],
}) => {
  return (
    <div className="flex flex-col justify-between items-center gap-4 w-full max-w-5xl sm:flex-row px-4 mb-6">
      <div className="flex items-center gap-2 w-full sm:max-w-md bg-base-100 border border-gray-300 rounded-lg shadow-sm px-3 ">
        <Search className="text-gray-500" />
        <input
          type="text"
          placeholder="Search blogs..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className="input border-none focus:outline-none w-full focus:ring-0 bg-transparent placeholder:text-sm"
        />
      </div>

      <div className="w-full sm:w-auto overflow-x-auto no-scrollbar">
        <div className="flex flex-wrap sm:flex-nowrap gap-2">
          <button
            className={`btn ${
              category === "All" ? "btn-primary" : "btn-outline"
            }`}
            onClick={() => onCategoryChange("All")}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`btn ${
                cat === category ? "btn-primary" : "btn-outline"
              }`}
              onClick={() => onCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
