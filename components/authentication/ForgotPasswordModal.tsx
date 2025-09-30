// components/ForgotPasswordModal.tsx
import { useState } from 'react';
import {
  Modal,
  ModalClose,
  ModalDialog,
  Typography,
  FormControl,
  FormLabel,
  Input,
  Button,
  Stack,
  FormHelperText,
} from '@mui/joy';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { toast } from 'sonner';
import { baseUrl } from '@/utils/Endpoint';

interface ForgotPasswordModalProps {
  open: boolean;
  onClose: () => void;
  endpoint?: string; // API endpoint for password change
}

interface PasswordErrors {
  minLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

export default function ForgotPasswordModal({ 
  open, 
  onClose, 
  endpoint = 'user/change-password/' 
}: ForgotPasswordModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [formData, setFormData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [passwordErrors, setPasswordErrors] = useState<PasswordErrors>({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  // Password validation function
  const validatePassword = (password: string): PasswordErrors => {
    return {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };
  };

  const handlePasswordChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'new_password') {
      setPasswordErrors(validatePassword(value));
    }
  };

  const isPasswordValid = (): boolean => {
    return Object.values(passwordErrors).every(error => error === true);
  };

  const isFormValid = (): boolean => {
    return (
      formData.old_password.trim() !== '' &&
      formData.new_password.trim() !== '' &&
      formData.confirm_password.trim() !== '' &&
      formData.new_password === formData.confirm_password &&
      isPasswordValid()
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      toast.error('Please fix all validation errors before submitting.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          old_password: formData.old_password,
          new_password: formData.new_password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.detail || 'Password updated successfully!');
        onClose();
        setFormData({ old_password: '', new_password: '', confirm_password: '' });
        setPasswordErrors({
          minLength: false,
          hasUpperCase: false,
          hasLowerCase: false,
          hasNumber: false,
          hasSpecialChar: false,
        });
      } else {
        toast.error(data.detail || 'Failed to update password. Please try again.');
      }
    } catch (error) {
      console.error('Password change error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
    <Typography
      level="body-xs"
      sx={{ color: met ? 'success.500' : 'neutral.500' }}
    >
      {met ? '✓' : '○'} {text}
    </Typography>
  );

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog
        sx={{
          maxWidth: 500,
          width: '100%',
          borderRadius: 'md',
          p: 3,
        }}
      >
        <ModalClose />
        
        <Typography level="h4" component="h2" mb={2}>
          Change Password
        </Typography>

        <Typography level="body-sm" color="neutral" mb={3}>
          Please enter your current password and a new strong password.
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* Old Password */}
            <FormControl required>
              <FormLabel>Current Password</FormLabel>
              <div className="relative">
                <Input
                  type={showOldPassword ? "text" : "password"}
                  value={formData.old_password}
                  onChange={(e) => handlePasswordChange('old_password', e.target.value)}
                  placeholder="Enter your current password"
                />
                <div className="absolute right-2 top-2">
                  {showOldPassword ? (
                    <EyeIcon 
                      onClick={() => setShowOldPassword(false)} 
                      size={18} 
                      className="cursor-pointer" 
                    />
                  ) : (
                    <EyeOffIcon 
                      onClick={() => setShowOldPassword(true)} 
                      size={18} 
                      className="cursor-pointer" 
                    />
                  )}
                </div>
              </div>
            </FormControl>

            {/* New Password */}
            <FormControl required>
              <FormLabel>New Password</FormLabel>
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  value={formData.new_password}
                  onChange={(e) => handlePasswordChange('new_password', e.target.value)}
                  placeholder="Enter new password"
                  color={formData.new_password ? (isPasswordValid() ? 'success' : 'danger') : 'neutral'}
                />
                <div className="absolute right-2 top-2">
                  {showNewPassword ? (
                    <EyeIcon 
                      onClick={() => setShowNewPassword(false)} 
                      size={18} 
                      className="cursor-pointer" 
                    />
                  ) : (
                    <EyeOffIcon 
                      onClick={() => setShowNewPassword(true)} 
                      size={18} 
                      className="cursor-pointer" 
                    />
                  )}
                </div>
              </div>
              
              {/* Password Requirements */}
              {formData.new_password && (
                <Stack spacing={0.5} mt={1}>
                  <Typography level="body-xs" fontWeight="bold">
                    Password must contain:
                  </Typography>
                  <PasswordRequirement 
                    met={passwordErrors.minLength} 
                    text="At least 8 characters" 
                  />
                  <PasswordRequirement 
                    met={passwordErrors.hasUpperCase} 
                    text="One uppercase letter (A-Z)" 
                  />
                  <PasswordRequirement 
                    met={passwordErrors.hasLowerCase} 
                    text="One lowercase letter (a-z)" 
                  />
                  <PasswordRequirement 
                    met={passwordErrors.hasNumber} 
                    text="One number (0-9)" 
                  />
                  <PasswordRequirement 
                    met={passwordErrors.hasSpecialChar} 
                    text="One special character (!@#$% etc.)" 
                  />
                </Stack>
              )}
            </FormControl>

            {/* Confirm Password */}
            <FormControl 
              required 
              color={
                formData.confirm_password ? 
                  (formData.new_password === formData.confirm_password ? 'success' : 'danger') 
                  : 'neutral'
              }
            >
              <FormLabel>Confirm New Password</FormLabel>
              <Input
                type="password"
                value={formData.confirm_password}
                onChange={(e) => handlePasswordChange('confirm_password', e.target.value)}
                placeholder="Confirm your new password"
              />
              {formData.confirm_password && formData.new_password !== formData.confirm_password && (
                <FormHelperText sx={{ color: 'danger.500' }}>
                  Passwords do not match
                </FormHelperText>
              )}
            </FormControl>

            {/* Submit Button */}
            <Button
              type="submit"
              loading={isLoading}
              disabled={!isFormValid() || isLoading}
              sx={{ mt: 2 }}
            >
              {isLoading ? 'Updating Password...' : 'Update Password'}
            </Button>
          </Stack>
        </form>
      </ModalDialog>
    </Modal>
  );
}