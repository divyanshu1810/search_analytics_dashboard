import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import "./SearchFilter.css";

export const SearchFilter: React.FC<{
  value: string;
  onChange: (value: string) => void;
  debounceMs?: number;
}> = ({ value, onChange, debounceMs = 300 }) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localValue, onChange, value, debounceMs]);

  return (
    <div className="search-filter-container">
      <Search className="search-icon" />
      <input
        type="text"
        placeholder="Filter queries..."
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        className="search-input"
      />
    </div>
  );
};