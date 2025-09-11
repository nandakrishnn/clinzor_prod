import { Loader } from 'lucide-react'
import React, { useState } from 'react'

interface SearchBarProps {
    placeHolder: string
    onSearch: (query: string) => void
    isLoading?: boolean
}

const SearchBar: React.FC<SearchBarProps> = ({ placeHolder, onSearch, isLoading = false }) => {
    const [query, setQuery] = useState('')

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSearch(query)
    }

    return (
        <div className="mb-12 max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="relative">
                <input
                    type="text"
                    placeholder={placeHolder}
                    value={query}
                    onChange={handleInputChange}
                    className="w-full px-6 py-3 border border-gray-300 rounded-full focus:outline-none"
                    disabled={isLoading}
                />
                <button 
                    type="submit"
                    disabled={isLoading}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                    {isLoading ? (
                        <Loader size={20} className="animate-spin" />
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    )}
                </button>
            </form>
        </div>
    )
}

export default SearchBar