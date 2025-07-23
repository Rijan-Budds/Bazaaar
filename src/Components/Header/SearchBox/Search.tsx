import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

const SearchBox = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="relative w-[70%] h-[60px] bg-[#f3f4f7] px-4 py-2 ml-4 border border-gray-200 rounded-lg">
      <input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        className="bg-transparent outline-none text-sm text-gray-800 w-full h-full pr-10"
      />
      <button
        onClick={handleSearch}
        className="absolute top-1/2 -translate-y-1/2 right-3 text-black text-lg hover:text-gray-600 transition-colors"
      >
        <FaSearch className="w-4 h-4" />
      </button>
    </div>
  );
};

export default SearchBox;
