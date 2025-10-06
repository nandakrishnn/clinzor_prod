import { useState, useRef } from 'react';
import { NominatimResult, NominatimReverseResult } from '@/types/clinic';

export function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

export const useLocationSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<NominatimResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const searchRef = useRef<HTMLInputElement>(null);

  const fetchSearchResults = debounce(async (query: string) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    setSearchError('');
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`
      );
      const data: NominatimResult[] = await res.json();
      setSearchResults(data);
    } catch (err) {
      setSearchError('Failed to fetch suggestions');
    } finally {
      setIsSearching(false);
    }
  }, 400);

  const fetchAddressFromCoords = async (lat: number, lon: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`
      );
      const data: NominatimReverseResult = await res.json();
      return data;
    } catch (err) {
      console.error('Error fetching address:', err);
      return null;
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    fetchSearchResults(e.target.value);
    setDropdownOpen(true);
    setHighlightedIndex(-1);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!dropdownOpen || searchResults.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(idx => Math.min(idx + 1, searchResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(idx => Math.max(idx - 1, 0));
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      return searchResults[highlightedIndex];
    } else if (e.key === 'Escape') {
      setDropdownOpen(false);
    }
    return null;
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setDropdownOpen(false);
    setHighlightedIndex(-1);
    if (searchRef.current) searchRef.current.focus();
  };

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    searchError,
    dropdownOpen,
    setDropdownOpen,
    highlightedIndex,
    searchRef,
    handleSearchChange,
    handleSearchKeyDown,
    handleClearSearch,
    fetchAddressFromCoords
  };
};
