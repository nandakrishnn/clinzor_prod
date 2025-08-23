// types.ts

export interface ClinicService {
    // Add real fields as per your use-case
    id: string;
    name: string;
}

export interface BulkCreationModalProps {
    showBulkForm: boolean;
    setShowBulkForm: (show: boolean) => void;
    currentPage: number;
    fetchSlots: (page?: number) => void;
    clinicServices: ClinicService[];
}

export interface TimeSlot {
    start_time: string;
    end_time: string;
    max_bookings: number;
    female_doctors: number;
    is_video_call: boolean;
    is_physical_visit: boolean;
}

export interface DaySlots {
    date: string;
    dayName: string;
    slots: TimeSlot[];
}

export interface TimePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    slot: TimeSlot;
    dayName: string;
    date: string;
}
