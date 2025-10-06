import React from 'react';
import { Edit3 } from 'lucide-react';

interface EditModeBannerProps {
  isEditMode: boolean;
}

const EditModeBanner: React.FC<EditModeBannerProps> = ({ isEditMode }) => {
  if (!isEditMode) return null;

  return (
    <div className="mb-8 p-6 bg-yellow-50 border border-yellow-200 rounded-3xl shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-yellow-100 rounded-2xl flex items-center justify-center">
            <Edit3 className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-yellow-800">Edit Mode Active</h3>
            <p className="text-yellow-600 text-sm">
              You are currently editing your clinic profile. Remember to save your changes.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-yellow-600 font-medium">
            All fields are now editable
          </span>
        </div>
      </div>
    </div>
  );
};

export default EditModeBanner;