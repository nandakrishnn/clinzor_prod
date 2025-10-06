import React from 'react';
import { MapPin, Search as SearchIcon, X } from 'lucide-react';
import { ClinicData, NominatimResult } from '@/types/clinic';
import MapPicker from './MapPicker';

interface LocationSectionProps {
  clinicData: ClinicData;
  isEditMode: boolean;
  onInputChange: (field: keyof ClinicData, value: string) => void;
  searchQuery: string;
  searchResults: NominatimResult[];
  isSearching: boolean;
  dropdownOpen: boolean;
  highlightedIndex: number;
  searchRef: React.RefObject<HTMLInputElement>;
  mapZoom: number;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSearchSelect: (result: NominatimResult) => void;
  onClearSearch: () => void;
  onMapChange: (coords: { lat: number; lng: number }) => void;
  onFetchAddress: (lat: number, lng: number) => void;
}

const LocationSection: React.FC<LocationSectionProps> = ({
  clinicData,
  isEditMode,
  onInputChange,
  searchQuery,
  searchResults,
  isSearching,
  dropdownOpen,
  highlightedIndex,
  searchRef,
  mapZoom,
  onSearchChange,
  onSearchKeyDown,
  onSearchSelect,
  onClearSearch,
  onMapChange,
  onFetchAddress
}) => {
  return (
    <section className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-8">
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Location</h2>
            <p className="text-gray-500">Set your clinic's address and location</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Street Address</label>
            <input
              type="text"
              value={clinicData.address}
              onChange={(e) => onInputChange('address', e.target.value)}
              disabled={!isEditMode}
              className="w-full px-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 text-gray-900 disabled:bg-gray-100 disabled:text-gray-500 text-lg"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">City</label>
              <input
                type="text"
                value={clinicData.city}
                onChange={(e) => onInputChange('city', e.target.value)}
                disabled={!isEditMode}
                className="w-full px-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 text-gray-900 disabled:bg-gray-100 disabled:text-gray-500 text-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">State</label>
              <input
                type="text"
                value={clinicData.state}
                onChange={(e) => onInputChange('state', e.target.value)}
                disabled={!isEditMode}
                className="w-full px-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 text-gray-900 disabled:bg-gray-100 disabled:text-gray-500 text-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Postal Code</label>
              <input
                type="text"
                value={clinicData.postalCode}
                onChange={(e) => onInputChange('postalCode', e.target.value)}
                disabled={!isEditMode}
                className="w-full px-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 text-gray-900 disabled:bg-gray-100 disabled:text-gray-500 text-lg"
              />
            </div>
          </div>

          {isEditMode && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 text-blue-600 mr-2" />
                Pick Location on Map
              </h3>
              <div className="mb-4">
                <div className="relative">
                  <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={onSearchChange}
                    onKeyDown={onSearchKeyDown}
                    placeholder="Search for address, city, or place..."
                    className="w-full pl-12 pr-12 py-4 bg-white border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 shadow-sm text-lg"
                    autoComplete="off"
                  />
                  {searchQuery && (
                    <button
                      onClick={onClearSearch}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-600 transition-colors p-2"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                  {isSearching && (
                    <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                      <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  {dropdownOpen && searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                      {searchResults.map((result, idx) => (
                        <button
                          key={result.place_id}
                          onClick={() => onSearchSelect(result)}
                          className={`w-full px-6 py-4 text-left hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-b-0 ${
                            idx === highlightedIndex ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0" />
                            <span className="text-gray-900 truncate">{result.display_name}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <MapPicker
                value={{
                  lat: isNaN(clinicData.location.lat) ? 8.5241 : clinicData.location.lat,
                  lng: isNaN(clinicData.location.lng) ? 76.9366 : clinicData.location.lng
                }}
                onChange={async (coords) => {
                  if (!isNaN(coords.lat) && !isNaN(coords.lng)) {
                    onMapChange(coords);
                    onFetchAddress(coords.lat, coords.lng);
                  }
                }}
                disabled={!isEditMode}
                zoom={mapZoom}
              />
              <div className="mt-4 p-4 bg-white rounded-xl border border-blue-100">
                <div className="text-sm text-blue-700">
                  <span className="font-semibold">Coordinates:</span>{' '}
                  {isNaN(clinicData.location.lat) ? '0.00000' : clinicData.location.lat.toFixed(5)}
                  , {isNaN(clinicData.location.lng) ? '0.00000' : clinicData.location.lng.toFixed(5)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LocationSection;