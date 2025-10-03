import React from 'react';
import { RefreshCw } from 'lucide-react';

interface HeaderProps {
  onRefresh: () => void;
  activeTab: 'overview' | 'bookings' | 'transactions' | 'clinics';
  onTabChange: (tab: 'overview' | 'bookings' | 'transactions' | 'clinics') => void;
}

const Header: React.FC<HeaderProps> = ({ onRefresh, activeTab, onTabChange }) => {
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'bookings', label: 'Bookings' },
    { id: 'transactions', label: 'Transactions' },
    { id: 'clinics', label: 'Clinics' },
  ];

  return (
    <div className="backdrop-blur-xl bg-white/80 z-40">
      <div className="max-w-7xl mx-auto py-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 bg-clip-text text-transparent">
                Dues Management
              </h1>
              <p className="text-sm text-slate-500 mt-1">Track payments and manage clinic dues</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 sm:space-x-4 mt-2 sm:mt-0">
            <button
              onClick={onRefresh}
              className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 border-b border-slate-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as any)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 border border-slate-200 border-b-white relative -mb-px'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Header;