import { Doctor, ClinicService } from './doctormanagement.types';

// API endpoints
const API_ENDPOINTS = {
  doctors: '/api/doctors',
  clinicServices: '/api/clinic-services',
};

// API functions
export const fetchDoctors = async (): Promise<Doctor[]> => {
  try {
    // TODO: Replace with actual API call
    // const response = await fetch(API_ENDPOINTS.doctors);
    // return await response.json();
    
    // Temporary mock data
    return [
      {
        uuid: "bf1460af-b799-4022-b1a1-2c13b709413f",
        clinic_service: "a1bc0d8e-544e-4f20-8e2f-dbcfddbabc54",
        created_by: "admin@gmail.com",
        name: "Dr. Sarah Johnson",
        dob: "1985-03-15",
        gender: "FEMALE",
        specializaton: "Nephrologist",
        experience: "8 years",
        phone_number: "1234567890",
        email: "sarah.johnson@clinic.com",
        profile_pic: null,
        status: "APPROVED",
        reason_for_rejection: null
      },
      // ... other mock doctors
    ];
  } catch (error) {
    console.error('Error fetching doctors:', error);
    throw error;
  }
};

export const fetchClinicServices = async (): Promise<ClinicService[]> => {
  try {
    // TODO: Replace with actual API call
    // const response = await fetch(API_ENDPOINTS.clinicServices);
    // return await response.json();
    
    // Temporary mock data
    return [
      {
        id: "a1bc0d8e-544e-4f20-8e2f-dbcfddbabc54",
        name: "General Medicine",
        description: "Primary healthcare services"
      },
      // ... other mock services
    ];
  } catch (error) {
    console.error('Error fetching clinic services:', error);
    throw error;
  }
};

export const createDoctor = async (doctor: Omit<Doctor, 'uuid'>): Promise<Doctor> => {
  try {
    // TODO: Replace with actual API call
    // const response = await fetch(API_ENDPOINTS.doctors, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(doctor),
    // });
    // return await response.json();
    
    // Temporary mock response
    return {
      ...doctor,
      uuid: `doctor-${Date.now()}`,
    } as Doctor;
  } catch (error) {
    console.error('Error creating doctor:', error);
    throw error;
  }
};

export const updateDoctor = async (doctor: Doctor): Promise<Doctor> => {
  try {
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_ENDPOINTS.doctors}/${doctor.uuid}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(doctor),
    // });
    // return await response.json();
    
    // Temporary mock response
    return doctor;
  } catch (error) {
    console.error('Error updating doctor:', error);
    throw error;
  }
};

export const deleteDoctor = async (uuid: string): Promise<void> => {
  try {
    // TODO: Replace with actual API call
    // await fetch(`${API_ENDPOINTS.doctors}/${uuid}`, {
    //   method: 'DELETE',
    // });
    
    // Temporary mock response
    return;
  } catch (error) {
    console.error('Error deleting doctor:', error);
    throw error;
  }
}; 