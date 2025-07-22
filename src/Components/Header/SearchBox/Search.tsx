import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { FaSearch } from 'react-icons/fa';

const SearchBox: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const navigate = useNavigate();

  const handleSearch = (): void => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="headerSearch ml-3">
      <input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="form-control"
      />
      <Button onClick={handleSearch}>
        <FaSearch />
      </Button>
    </div>
  );
};

export default SearchBox;
