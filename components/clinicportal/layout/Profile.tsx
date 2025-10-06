"use client";
import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Edit3 } from 'lucide-react';

// Hooks
import { useClinicData } from '@/hooks/useClinicData';
import { useOperatingHours } from '@/hooks/useOperatingHours';
import { useLocationSearch } from '@/hooks/useLocationSearch';

// Services
import { editClinicODetails } from '@/service/clinic/profileService';
import { axiosPrivate } from '@/axios/axios';
import { transformOperatingHoursToAPI } from '@/utils/clinicUtils';

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
import { SaveStatus, BackendClinic, NominatimResult } from '@/types/clinic';

const ClinicSettingsDashboard = () => {
  // State
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [mapZoom, setMapZoom] = useState(13);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  // Hooks
  const {
    clinicData,
    setClinicData,
    isClinicLoading,
    clinicError,
    handleInputChange,
    addInsurance,
    removeInsurance,
    addSpecialty,
    removeSpecialty
  } = useClinicData();

  const {
    operatingHours,
    handleHoursChange,
    toggleDayClosed
  } = useOperatingHours();

  const {
    searchQuery,
    searchResults,
    isSearching,
    dropdownOpen,
    highlightedIndex,
    searchRef,
    handleSearchChange,
    handleSearchKeyDown,
    handleClearSearch,
    fetchAddressFromCoords
  } = useLocationSearch();

  // Save operating hours function
  const saveOperatingHours = async (clinicId: string) => {
    try {
      const timingList = transformOperatingHoursToAPI(operatingHours);
      const body = {
        clinic: clinicId,
        timing_list: timingList
      };

      const response = await axiosPrivate.post('/clinic/clinic-timing-create/', body);
      return response.data;
    } catch (error) {
      console.error("Operating hours update error:", error);
      throw error;
    }
  };

  // Handle save
  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      const requestData = {
        name: clinicData.name,
        email: clinicData.email,
        contact_number: clinicData.phone,
        address: clinicData.address,
        city: clinicData.city,
        pincode: clinicData.postalCode,
        about_clinic: clinicData.about,
        coordinates: `SRID=4326;POINT (${clinicData.location.lng} ${clinicData.location.lat})`
      };

      const clinicId = clinicData.uuid || '';

      await editClinicODetails(clinicId, requestData);
      await saveOperatingHours(clinicId);

      console.log('Clinic details and operating hours updated successfully');
      setSaveStatus('saved');
      setIsEditMode(false);
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to update clinic details:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditMode(false);
    setSaveStatus('idle');
    // Reset form data by reloading from hook
    window.location.reload(); // Simple reset by reloading
  };

  // Handle search select
  const handleSearchSelect = (result: NominatimResult) => {
    setClinicData(prev => ({
      ...prev,
      location: {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
      },
      address: result.display_name || prev.address,
      city: result.address?.city || result.address?.town || result.address?.village || prev.city,
      state: result.address?.state || prev.state,
      postalCode: result.address?.postcode || prev.postalCode,
    }));
    handleClearSearch();
    setMapZoom(16);
  };

  // Handle map change
  const handleMapChange = (coords: { lat: number; lng: number }) => {
    if (!isNaN(coords.lat) && !isNaN(coords.lng)) {
      setClinicData(prev => ({ ...prev, location: coords }));
    }
  };

  // Handle fetch address from coordinates
  const handleFetchAddress = async (lat: number, lng: number) => {
    const data = await fetchAddressFromCoords(lat, lng);
    if (data && data.address) {
      setClinicData(prev => ({
        ...prev,
        address: data.display_name || prev.address,
        city: data.address?.city || data.address?.town || data.address?.village || prev.city,
        state: data.address?.state || prev.state,
        postalCode: data.address?.postcode || prev.postalCode,
      }));
    }
    setMapZoom(13);
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
              searchQuery={searchQuery}
              searchResults={searchResults}
              isSearching={isSearching}
              dropdownOpen={dropdownOpen}
              highlightedIndex={highlightedIndex}
              searchRef={searchRef}
              mapZoom={mapZoom}
              onSearchChange={handleSearchChange}
              onSearchKeyDown={handleSearchKeyDown}
              onSearchSelect={handleSearchSelect}
              onClearSearch={handleClearSearch}
              onMapChange={handleMapChange}
              onFetchAddress={handleFetchAddress}
            />

            <OperatingHours
              operatingHours={operatingHours}
              isEditMode={isEditMode}
              onHoursChange={handleHoursChange}
              onToggleDayClosed={toggleDayClosed}
            />

            <AdditionalInformation
              clinicData={clinicData}
              isEditMode={isEditMode}
              onInputChange={handleInputChange}
              onAddInsurance={addInsurance}
              onRemoveInsurance={removeInsurance}
              onAddSpecialty={addSpecialty}
              onRemoveSpecialty={removeSpecialty}
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