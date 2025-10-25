"use client";
import React, { useState, useEffect } from 'react';

// Hooks
import { useClinicData } from '@/hooks/useClinicData';
import { useOperatingHours } from '@/hooks/useOperatingHours';

// Services
import { editClinicODetails } from '@/service/clinic/profileService';
import { axiosPrivate } from '@/axios/axios';

// Components
import BannerCarousel from './BannerCarousel';
import HeaderActions from './HeaderActions';
import SidebarInfo from './SidebarInfo';
import ClinicInformation from './ClinicInformation';
import LocationSection from './LocationSection';
import OperatingHours from './OperatingHours';
import AdditionalInformation from './AdditionalInformation';
import SaveStatusToast from './SaveStatusToast';
import EditModeBanner from './EditModeBanner';
import LoadingState from './LoadingState';
import ForgotPasswordModal from '@/components/authentication/ForgotPasswordModal';

// Types
import { ClinicData, SaveStatus } from '@/types/clinic';
import { getPresignedUrls, uploadFileToS3 } from '@/service/uploadService/uploadService';

interface PresignedUrlRequest {
  file_name: string;
  file_type: string;
}

const ClinicSettingsDashboard = () => {
  // State
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [uploadingImages, setUploadingImages] = useState<boolean>(false);
  const [operatingHoursSaveStatus, setOperatingHoursSaveStatus] = useState<SaveStatus>('idle');

  // Hooks
  const {
    clinicData,
    setClinicData,
    isClinicLoading,
    handleInputChange,
    updateLocation,
    resetToBackendData
  } = useClinicData();

  const {
    operatingHours,
    handleHoursChange,
    toggleDayClosed,
    hasOperatingHoursChanged,
    resetOperatingHoursChanges,
    loadOperatingHours,
    saveOperatingHours,
    hasExistingOperatingHours,
    existingTimings
  } = useOperatingHours();

  useEffect(() => {
    if (clinicData.uuid) {
      loadOperatingHours(clinicData.uuid);
    }
  }, [clinicData]);

  // Handle map change
  const handleMapChange = (coords: { lat: number; lng: number }) => {
    if (!isNaN(coords.lat) && !isNaN(coords.lng)) {
      setClinicData(prev => ({
        ...prev,
        location: coords,
        coordinates: `SRID=4326;POINT (${coords.lng} ${coords.lat})` // Keep coordinates in sync
      }));
    }
  };

  // Handle file upload for registration certificate
  const handleFileUpload = async (field: keyof ClinicData, file: File) => {
    try {
      setSaveStatus('saving');

      // Upload file using presigned URL
      const uploadedUrls = await uploadFiles([file]);

      if (uploadedUrls && uploadedUrls.length > 0) {
        const fileUrl = uploadedUrls[0];

        // Update clinic data with the new file URL
        setClinicData(prev => ({
          ...prev,
          [field]: fileUrl
        }));

        console.log('File uploaded successfully. URL:', fileUrl);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      }
    } catch (error) {
      console.error('File upload error:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  // Main function to handle multiple file uploads
  const uploadFiles = async (files: File[]): Promise<string[]> => {
    try {
      // Prepare file requests for presigned URLs
      const fileRequests: PresignedUrlRequest[] = files.map(file => ({
        file_name: file.name,
        file_type: file.type
      }));

      // Get presigned URLs
      const presignedResponse = await getPresignedUrls(fileRequests);

      // Upload each file to S3
      const uploadPromises = files.map((file, index) =>
        uploadFileToS3(presignedResponse.data.uploads[index], file)
      );

      // Wait for all uploads to complete
      const uploadedFileKeys = await Promise.all(uploadPromises);

      // Return full URLs (combine upload_url with file_key)
      const baseUrl = presignedResponse.data.uploads[0]?.upload_url.split('/').slice(0, 3).join('/');
      const fullUrls = uploadedFileKeys.map((key: any) => `${baseUrl}/${key}`);

      return fullUrls;
    } catch (error) {
      console.error("Error in upload process:", error);
      throw error;
    }
  };

  // Handle multiple images upload for clinic images
  const handleImagesUpload = async (files: File[]) => {
    try {
      setUploadingImages(true);
      setSaveStatus('saving');

      // Upload images using presigned URL
      const uploadedUrls = await uploadFiles(files);

      if (uploadedUrls && uploadedUrls.length > 0) {
        // Update clinic data with new image URLs
        setClinicData(prev => ({
          ...prev,
          images: [...(prev.images || []), ...uploadedUrls]
        }));

        console.log('Images uploaded successfully:', uploadedUrls);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      }
    } catch (error) {
      console.error('Images upload error:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setUploadingImages(false);
    }
  };

  // Remove specific image from clinic images
  const removeImage = (imageUrl: string) => {
    setClinicData(prev => ({
      ...prev,
      images: prev.images?.filter((img: any) => img !== imageUrl) || []
    }));
  };

  // Save operating hours separately - FIXED FUNCTION
  const handleSaveOperatingHours = async (): Promise<boolean> => {
    setOperatingHoursSaveStatus('saving');
    try {
      if (!clinicData.uuid) {
        throw new Error('Clinic ID not found');
      }

      const success = await saveOperatingHours(clinicData.uuid);

      if (success) {
        console.log('Operating hours updated successfully');
        setOperatingHoursSaveStatus('saved');
        setTimeout(() => setOperatingHoursSaveStatus('idle'), 2000);
        return true;
      } else {
        throw new Error('Failed to update operating hours - No success status returned');
      }
    } catch (error: any) {
      console.error("Operating hours update error:", error);
      // FIX: Better error message extraction
      const errorMessage = error.response?.data?.message ||
        error.message ||
        error.response?.data?.detail ||
        'Failed to update operating hours';
      setOperatingHoursSaveStatus('error');
      setTimeout(() => setOperatingHoursSaveStatus('idle'), 3000);
      throw new Error(errorMessage);
    }
  };

  // Handle save clinic details (without operating hours)
  const handleSaveClinicDetails = async () => {
    setSaveStatus('saving');
    try {

      console.log( clinicData, "data fromt he form")

      const languagesArray = typeof clinicData.languages === 'string'
        ? (clinicData.languages as string)
          .split(',')
          .map((lang: any) => lang.trim())
          .filter((lang: any) => lang)
        : clinicData.languages || [];

      const requestData = {
        name: clinicData.name,
        email: clinicData.email,
        contact_number: clinicData.contact_number,
        address: clinicData.address,
        city: clinicData.city,
        pincode: clinicData.pincode,
        landmark: clinicData.landmark,
        map_link: clinicData.map_link,
        about_clinic: clinicData.about_clinic,
        gst_no: clinicData.gst_no,
        founded_on: clinicData.founded_on,
        coordinates: `${clinicData.coordinates}`,
        images: clinicData.images,
        registration_certificate: clinicData.registration_certificate,
        languages: languagesArray
      };

      const clinicId = clinicData.uuid || '';
      console.log(requestData)

      await editClinicODetails(clinicId, requestData);

      console.log('Clinic details updated successfully');
      setSaveStatus('saved');
      setIsEditMode(false);
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to update clinic details:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  // Combined save handler
  const handleSave = async () => {
    try {
      // Save clinic details first
      await handleSaveClinicDetails();

      // Only save operating hours if they have changed
      if (hasOperatingHoursChanged && isEditMode) {
        await handleSaveOperatingHours();
      }
    } catch (error) {
      console.error('Failed to save:', error);
      // Error states are handled in individual functions
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditMode(false);
    setSaveStatus('idle');
    setOperatingHoursSaveStatus('idle');
    resetOperatingHoursChanges();
    resetToBackendData();
  };

  // Loading state
  if (isClinicLoading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen">
      {/* Header with Banner Carousel */}
      <BannerCarousel
        images={clinicData.images}
        clinicName={clinicData.name}
        status={clinicData.status}
        isEditMode={isEditMode}
      >
        <HeaderActions
          isEditMode={isEditMode}
          saveStatus={saveStatus}
          onEdit={() => setIsEditMode(true)}
          onSave={handleSave}
          onCancel={handleCancelEdit}
          onForgotPassword={() => setForgotPasswordOpen(true)}
        />

        <SaveStatusToast saveStatus={saveStatus} />
      </BannerCarousel>

      {/* Main Content */}
      <div className="relative max-w-6xl mx-auto pb-20 mt-5">
        <EditModeBanner isEditMode={isEditMode} />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Quick Info */}
          <div className="lg:col-span-1">
            <SidebarInfo
              clinicData={clinicData}
              operatingHours={operatingHours}
            />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            <ClinicInformation
              clinicData={clinicData}
              isEditMode={isEditMode}
              onInputChange={handleInputChange}
            />

            <LocationSection
              clinicData={clinicData}
              isEditMode={isEditMode}
              onInputChange={handleInputChange}
              onLocationChange={handleMapChange}
              onFileUpload={handleFileUpload}
            />

            <AdditionalInformation
              clinicData={clinicData}
              isEditMode={isEditMode}
              onInputChange={handleInputChange}
              onImageUpload={handleImagesUpload}
              onRemoveImage={removeImage}
              uploadingImages={uploadingImages}
            />

            <OperatingHours
              operatingHours={operatingHours}
              isEditMode={isEditMode}
              onHoursChange={handleHoursChange}
              onToggleDayClosed={toggleDayClosed}
              saveStatus={operatingHoursSaveStatus}
              onSaveOperatingHours={handleSaveOperatingHours}
              hasChanges={hasOperatingHoursChanged}
              hasExistingData={hasExistingOperatingHours} // Fixed prop name
            />
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        open={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
        endpoint="user/change-password/"
        login={true}
      />
    </div>
  );
};

export default ClinicSettingsDashboard;