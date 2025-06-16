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
    <div className="flex flex-wrap justify-center items-center gap-3 w-full max-w-2xl">
      <div className="flex items-center border-2 rounded-lg overflow-hidden w-full sm:max-w-md shadow-md pl-2">
        <Search />
        <input
          type="text"
          placeholder="Search blogs..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className="input border-none focus:outline-none w-full"
        />
      </div>

      <div className="btn-group">
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
  );
};

export default SearchBar;
