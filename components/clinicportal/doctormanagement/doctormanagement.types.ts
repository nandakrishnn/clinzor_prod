export type Doctor = {
  uuid: string;
  clinic_service: string;
  created_by: string;
  name: string;
  dob: string | null;
  gender: "MALE" | "FEMALE" | "OTHER";
  specializaton: string;
  experience: string | null;
  phone_number: string;
  email: string | null;
  profile_pic: string | null;
  status: "APPROVED" | "DRAFT" | "REJECTED";
  reason_for_rejection: string | null;
};

export type ClinicService = {
  id: string;
  name: string;
  description: string;
};

export type Notification = {
  type: 'success' | 'warning' | 'error';
  message: string;
} | null;

export type ModalMode = 'view' | 'edit' | 'add' | 'delete' | null;

export type FormState = Partial<Doctor>;

export type StatusConfig = {
  color: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
  text: string;
}; 