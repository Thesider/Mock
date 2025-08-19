import React, { useState, useEffect } from "react";
import searchStyles from "./SearchDoctor.module.css";

// Custom debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

interface SearchDoctorProps {
  onSearch: (query: string, field: string) => void;
  onClear: () => void;
  isSearching: boolean;
  disabled?: boolean;
}

const SearchDoctor: React.FC<SearchDoctorProps> = ({
  onSearch,
  onClear,
  isSearching,
  disabled = false,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState<
    "all" | "name" | "specialty" | "department" | "status"
  >("all");

  // Debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Effect for debounced search
  useEffect(() => {
    onSearch(debouncedSearchQuery, searchField);
  }, [debouncedSearchQuery, searchField, onSearch]);

  const handleClear = () => {
    setSearchQuery("");
    setSearchField("all");
    onClear();
  };

  const getPlaceholder = () => {
    switch (searchField) {
      case "all":
        return "Search doctors...";
      case "name":
        return "Search by name...";
      case "specialty":
        return "Search by specialty...";
      case "department":
        return "Search by department...";
      case "status":
        return "Search by status...";
      default:
        return "Search doctors...";
    }
  };

  return (
    <div className={searchStyles.searchCard}>
      <div className={searchStyles.searchContainer}>
        <div className={searchStyles.searchInputGroup}>
          {/* Select Field */}
          <select
            value={searchField}
            onChange={(e) =>
              setSearchField(
                e.target.value as
                  | "all"
                  | "name"
                  | "specialty"
                  | "department"
                  | "status"
              )
            }
            className={searchStyles.searchFieldSelect}
            aria-label="Search field"
            disabled={disabled}
          >
            <option value="all">All Fields</option>
            <option value="name">Name</option>
            <option value="specialty">Specialty</option>
            <option value="department">Department</option>
            <option value="status">Status</option>
          </select>

          {/* Input + Clear button */}
          <div className={searchStyles.searchInputWrapper}>
            <input
              type="text"
              placeholder={getPlaceholder()}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={searchStyles.searchInput}
              aria-label="Search doctors"
              disabled={disabled}
            />
            {(searchQuery || isSearching) && (
              <button
                type="button"
                onClick={handleClear}
                className={searchStyles.clearSearchButton}
                title="Clear search"
                disabled={disabled}
              >
                {isSearching ? "○" : "×"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchDoctor;
