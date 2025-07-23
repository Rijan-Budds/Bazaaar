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
    <div className="relative w-[70%] h-[60px] bg-[#f3f4f7] px-5 py-2 ml-4 border border-gray-200 rounded-lg">
      <input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        className="bg-transparent outline-none text-sm text-gray-800 w-full h-[40px] border-none px-5"
      />
      <button
        onClick={handleSearch}
        className="absolute top-3.5 right-4 text-black text-lg flex items-center justify-center"
      >
        <FaSearch />
      </button>
    </div>
  );
};

export default SearchBox;
