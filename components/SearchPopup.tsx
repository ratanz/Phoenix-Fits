// components/SearchPopup.tsx
import React, { useState } from 'react';

interface SearchPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
}

const SearchPopup: React.FC<SearchPopupProps> = ({ isOpen, onClose, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    await onSearch(searchQuery);
    setIsSearching(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-transparent backdrop-blur-md shadow-xl p-4 sm:p-6 md:p-10 rounded-lg w-[80vw] md:w-[60vw] lg:w-[40vw] xl:w-[30vw] border border-zinc-100/20 font-glorich">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full p-2 mb-4 bg-transparent border border-white/50 text-white rounded text-xs sm:text-base"
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-transparent border border-white/50 text-white rounded hover:bg-white/10 text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-zinc-500/20 text-white rounded hover:bg-zinc-400/20 text-xs sm:text-base"
              disabled={isSearching}
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchPopup;