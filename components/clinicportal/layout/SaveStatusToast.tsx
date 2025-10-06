import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { SaveStatus } from '@/types/clinic';

interface SaveStatusToastProps {
  saveStatus: SaveStatus;
}

const SaveStatusToast: React.FC<SaveStatusToastProps> = ({ saveStatus }) => {
  if (saveStatus === 'saved') {
    return (
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center px-6 py-3 bg-green-500 text-white rounded-xl shadow-lg animate-bounce">
          <CheckCircle2 className="w-5 h-5 mr-2" />
          <span className="font-medium">Changes saved successfully!</span>
        </div>
      </div>
    );
  }

  if (saveStatus === 'error') {
    return (
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center px-6 py-3 bg-red-500 text-white rounded-xl shadow-lg animate-bounce">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span className="font-medium">Failed to save changes</span>
        </div>
      </div>
    );
  }

  return null;
};

export default SaveStatusToast;