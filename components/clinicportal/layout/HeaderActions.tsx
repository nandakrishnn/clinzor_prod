import React from 'react';
import { X, Save, Edit3, CheckCircle2, AlertCircle } from 'lucide-react';
import { SaveStatus } from '@/types/clinic';

interface HeaderActionsProps {
  isEditMode: boolean;
  saveStatus: SaveStatus;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onForgotPassword: () => void;
}

const HeaderActions: React.FC<HeaderActionsProps> = ({
  isEditMode,
  saveStatus,
  onEdit,
  onSave,
  onCancel,
  onForgotPassword
}) => {
  if (isEditMode) {
    return (
      <div className="absolute top-6 right-6 z-20 space-y-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={onCancel}
            className="flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-200 border border-white/30"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={saveStatus === 'saving'}
            className={`flex items-center px-6 py-2 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${
              saveStatus === 'saving'
                ? 'bg-blue-400 text-white'
                : saveStatus === 'saved'
                ? 'bg-green-500 text-white'
                : saveStatus === 'error'
                ? 'bg-red-500 text-white'
                : 'bg-white text-blue-600 hover:bg-blue-50'
            }`}
          >
            {saveStatus === 'saving' ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Saving...
              </>
            ) : saveStatus === 'saved' ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Saved
              </>
            ) : saveStatus === 'error' ? (
              <>
                <AlertCircle className="w-4 h-4 mr-2" />
                Error
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save
              </>
            )}
          </button>
        </div>
        
        <button 
          onClick={onForgotPassword}
          className="flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-200 border border-white/30 w-full justify-center"
        >
          Change Password
        </button>
      </div>
    );
  }

  return (
    <div className="absolute top-6 right-6 z-20 space-y-4">
      <button
        onClick={onEdit}
        className="flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-200 border border-white/30 group"
      >
        <Edit3 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
        Edit Profile
      </button>
      
      <button 
        onClick={onForgotPassword}
        className="flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-200 border border-white/30 w-full justify-center"
      >
        Change Password
      </button>
    </div>
  );
};

export default HeaderActions;