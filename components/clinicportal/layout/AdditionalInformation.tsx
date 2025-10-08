import React, { useState, useRef } from 'react';
import { Settings, Plus, X, MessageSquare, Image as ImageIcon, Upload, Loader2 } from 'lucide-react';
import { ClinicData } from '@/types/clinic';

interface AdditionalInformationProps {
  clinicData: ClinicData;
  isEditMode: boolean;
  onInputChange: (field: keyof ClinicData, value: string) => void;
  onImageUpload?: (images: File[]) => void;
  onRemoveImage?: (imageUrl: string) => void;
  uploadingImages?: boolean;
}

const AdditionalInformation: React.FC<AdditionalInformationProps> = ({
  clinicData,
  isEditMode,
  onInputChange,
  onImageUpload,
  onRemoveImage,
  uploadingImages = false
}) => {
  const [newSpecialty, setNewSpecialty] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0 && onImageUpload) {
      onImageUpload(files);
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (imageUrl: string) => {
    if (onRemoveImage) {
      onRemoveImage(imageUrl);
    }
  };

  return (
    <section className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-8">
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Additional Information</h2>
            <p className="text-gray-500">Tell us more about your clinic</p>
          </div>
        </div>

        <div className="space-y-8">
          {/* About Clinic */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 ml-1 block flex items-center">
              <MessageSquare className="w-4 h-4 mr-2" />
              About Your Clinic *
            </label>
            <textarea
              value={clinicData.about_clinic}
              onChange={(e) => onInputChange('about_clinic', e.target.value)}
              disabled={!isEditMode}
              rows={6}
              className="w-full px-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 text-gray-900 disabled:bg-gray-100 disabled:text-gray-500 resize-none text-lg"
              placeholder="Describe your clinic, services, expertise, facilities, and what makes you unique. Include your mission, vision, and any special features that set your clinic apart..."
            />
          </div>

          {/* Clinic Images */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 ml-1 block flex items-center">
              <ImageIcon className="w-4 h-4 mr-2" />
              Clinic Images
              {uploadingImages && (
                <Loader2 className="w-4 h-4 ml-2 animate-spin text-blue-500" />
              )}
            </label>
            <div className="space-y-4">
              {/* Display existing images */}
              {clinicData.images && clinicData.images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {clinicData.images.map((image: any, index: any) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Clinic image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-2xl"
                      />
                      {isEditMode && (
                        <button
                          onClick={() => handleRemoveImage(image)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-2xl">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">No images uploaded yet</p>
                  <p className="text-sm text-gray-400">Upload images of your clinic facilities</p>
                </div>
              )}

              {/* Upload new images */}
              {isEditMode && (
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-blue-500 transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="clinic-images"
                    disabled={uploadingImages}
                  />
                  <label
                    htmlFor="clinic-images"
                    className={`cursor-pointer flex flex-col items-center ${uploadingImages ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                  >
                    {uploadingImages ? (
                      <Loader2 className="w-8 h-8 text-blue-500 mb-2 animate-spin" />
                    ) : (
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    )}
                    <span className="text-blue-600 font-medium">
                      {uploadingImages ? 'Uploading Images...' : 'Upload Clinic Images'}
                    </span>
                    <span className="text-sm text-gray-500 mt-1">
                      JPG, PNG, WebP (Max 5MB each)
                    </span>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Reason for Rejection (Read-only) */}
          {clinicData.reason_for_rejection && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-2 flex items-center">
                <X className="w-5 h-5 mr-2" />
                Reason for Rejection
              </h3>
              <p className="text-red-700">{clinicData.reason_for_rejection}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdditionalInformation;