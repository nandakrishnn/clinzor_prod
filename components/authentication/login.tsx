"use client";
import { JSX, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, AlertCircle, Phone, User, MapPin, Key, Calendar, VenetianMask, Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { findUsers, sendOTP, verifyOTP } from "@/service/user/userAuthService/userAuthService";

// =======================
// Reusable Input Component
// =======================
type InputProps = {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  error?: string;
  placeholder?: string;
  icon?: JSX.Element;
  showToggle?: boolean;
  toggleVisibility?: () => void;
  options?: { value: string; label: string }[];
};

const Input = ({
  id,
  label,
  type,
  value,
  onChange,
  error,
  placeholder,
  icon,
  showToggle = false,
  toggleVisibility = () => { },
  options
}: InputProps) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-black mb-1">
      {label}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black">
          {icon}
        </div>
      )}
      {type === "select" ? (
        <select
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          className={`block w-full px-4 py-3 ${icon ? 'pl-10' : 'pl-4'} rounded-xl border text-black ${error ? "border-red-300" : "border-neutral-300"
            } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200`}
        >
          <option value="">Select {label}</option>
          {options?.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <>
          <input
            id={id}
            name={id}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`block w-full px-4 py-3 ${icon ? 'pl-10' : 'pl-4'} rounded-xl border text-black placeholder:text-black ${error ? "border-red-300" : "border-neutral-300"
              } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200`}
          />
          {showToggle && (
            <button
              type="button"
              onClick={toggleVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black hover:text-neutral-600"
            >
              {type === "text" ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </>
      )}
    </div>
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

// =======================
// Auth Form Component
// =======================
type AuthContentProps = {
  authMode: string;
  toggleAuthMode: () => void;
  handleLogin: (e: React.FormEvent<HTMLFormElement>) => void;
  handleRegister: (e: React.FormEvent<HTMLFormElement>) => void;
  handleOtpVerification: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  formError: string;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  nameError: string;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  emailError: string;
  phone_number: string;
  setPhoneNumber: React.Dispatch<React.SetStateAction<string>>;
  phoneError: string;
  address: string;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  addressError: string;
  dob: string;
  setDob: React.Dispatch<React.SetStateAction<string>>;
  dobError: string;
  gender: string;
  setGender: React.Dispatch<React.SetStateAction<string>>;
  genderError: string;
  otp: string;
  setOtp: React.Dispatch<React.SetStateAction<string>>;
  otpError: string;
  setShowOtpField: any;
  showOtpField: boolean;
  referenceId: string;
  resendTimer: number;
  handleResendOtp: () => void;
  isResending: boolean;
};

function AuthContent({
  authMode,
  toggleAuthMode,
  handleLogin,
  handleRegister,
  handleOtpVerification,
  isLoading,
  formError,
  name,
  setName,
  nameError,
  email,
  setEmail,
  emailError,
  phone_number,
  setPhoneNumber,
  phoneError,
  address,
  setAddress,
  addressError,
  dob,
  setDob,
  dobError,
  gender,
  setGender,
  genderError,
  otp,
  setOtp,
  otpError,
  setShowOtpField,
  showOtpField,
  referenceId,
  resendTimer,
  handleResendOtp,
  isResending
}: AuthContentProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <motion.div
          className="backdrop-blur-xl rounded-3xl border border-neutral-300 p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-primaryColor">
              {showOtpField
                ? "Verify OTP"
                : authMode === "login"
                  ? "Welcome back"
                  : "Create account"}
            </h2>
            <p className="mt-2 text-primaryColor">
              {showOtpField
                ? "Enter the OTP sent to your phone"
                : authMode === "login"
                  ? "Sign in to access your account"
                  : "Fill in your details to get started"}
            </p>
          </motion.div>

          {formError && (
            <div className="mb-6 p-3 rounded-lg bg-red-100 text-red-700 text-sm flex items-center">
              <AlertCircle size={16} className="mr-2" />
              {formError}
            </div>
          )}

          {/* Form */}
          {!showOtpField ? (
            <form onSubmit={authMode === "login" ? handleLogin : handleRegister}>
              {authMode === "register" && (
                <>
                  <Input
                    id="name"
                    label="Full Name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={nameError}
                    placeholder="Your full name"
                    icon={<User size={18} />}
                  />
                  <Input
                    id="email"
                    label="Email address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={emailError}
                    placeholder="your.email@example.com"
                    icon={<Mail size={18} />}
                  />
                  <Input
                    id="dob"
                    label="Date of Birth"
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    error={dobError}
                    placeholder="Your date of birth"
                    icon={<Calendar size={18} />}
                  />
                  <Input
                    id="gender"
                    label="Gender"
                    type="select"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    error={genderError}
                    icon={<VenetianMask size={18} />}
                    options={[
                      { value: "MALE", label: "Male" },
                      { value: "FEMALE", label: "Female" },
                      { value: "OTHER", label: "Other" }
                    ]}
                  />
                  <Input
                    id="address"
                    label="Address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    error={addressError}
                    placeholder="Your address"
                    icon={<MapPin size={18} />}
                  />
                </>
              )}

              <Input
                id="phone"
                label="Phone Number"
                type="tel"
                value={phone_number}
                onChange={(e) => setPhoneNumber(e.target.value)}
                error={phoneError}
                placeholder="Your phone number"
                icon={<Phone size={18} />}
              />

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-primaryColor text-white rounded-xl hover:bg-neutral-900 transition duration-200 disabled:opacity-50"
              >
                {isLoading
                  ? "Sending OTP..."
                  : authMode === "login"
                    ? "Send OTP"
                    : "Register & Send OTP"}
              </button>

              {/* Toggle mode */}
              {!showOtpField && (
                <div className="mt-6 text-center text-sm text-black">
                  {authMode === "login"
                    ? "Don't have an account?"
                    : "Already have an account?"}{" "}
                  <button
                    type="button"
                    onClick={toggleAuthMode}
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    {authMode === "login" ? "Sign up" : "Sign in"}
                  </button>
                </div>
              )}
            </form>
          ) : (
            // OTP Verification Form
            <form onSubmit={handleOtpVerification}>
              <Input
                id="otp"
                label="OTP Code"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                error={otpError}
                placeholder="Enter the OTP sent to your phone"
                icon={<Key size={18} />}
              />

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-primaryColor text-white rounded-xl hover:bg-neutral-900 transition duration-200 disabled:opacity-50 mt-4"
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </button>

              <div className="mt-4 text-center text-sm text-black">
                <p className="text-xs py-1.5 flex text-center items-center justify-center gap-1">
                  OTP send to
                  <span className="text-primaryColor">{" "} {phone_number}</span>
                  <Edit size={14} className="cursor-pointer" onClick={() => setShowOtpField(false)}  />
                </p>
                {resendTimer > 0 ? (
                  <>
                    <p>Resend OTP in {resendTimer} seconds</p>
                  </>
                ) : (
                  <>
                    Didn't receive the code?{" "}
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isResending}
                      className="font-semibold text-blue-600 hover:underline disabled:opacity-50"
                    >
                      {isResending ? "Resending..." : "Resend OTP"}
                    </button>
                  </>
                )}
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}

// =======================
// Main Component
// =======================
export default function AuthenticationGateway() {
  const [authMode, setAuthMode] = useState("login");
  const { data: session, status } = useSession();
  const router = useRouter();

  // Form state
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [referenceId, setReferenceId] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [isResending, setIsResending] = useState(false);

  // Errors
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [dobError, setDobError] = useState("");
  const [genderError, setGenderError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [resendTimer]);

  // Start timer when OTP field is shown
  useEffect(() => {
    if (showOtpField) {
      setResendTimer(30);
    }
  }, [showOtpField]);

  // Validation functions
  const validateLoginForm = () => {
    setPhoneError("");
    setFormError("");

    let hasErrors = false;

    if (!phone_number.trim()) {
      setPhoneError("Phone number is required");
      hasErrors = true;
    }

    return !hasErrors;
  };

  const validateRegisterForm = () => {
    setEmailError("");
    setNameError("");
    setPhoneError("");
    setAddressError("");
    setDobError("");
    setGenderError("");
    setFormError("");

    let hasErrors = false;

    if (!phone_number.trim()) {
      setPhoneError("Phone number is required");
      hasErrors = true;
    }

    if (!name.trim()) {
      setNameError("Name is required");
      hasErrors = true;
    }

    if (!email.trim()) {
      setEmailError("Email is required");
      hasErrors = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Invalid email address");
      hasErrors = true;
    }

    if (!dob.trim()) {
      setDobError("Date of birth is required");
      hasErrors = true;
    }

    if (!gender.trim()) {
      setGenderError("Gender is required");
      hasErrors = true;
    }

    if (!address.trim()) {
      setAddressError("Address is required");
      hasErrors = true;
    }

    return !hasErrors;
  };

  const validateOtpForm = () => {
    setOtpError("");
    setFormError("");

    if (!otp.trim()) {
      setOtpError("OTP is required");
      return false;
    }

    return true;
  };

  // Handle Resend OTP
  const handleResendOtp = async () => {
    setIsResending(true);
    setFormError("");

    try {
      if (authMode === "login") {
        // For login, check if user exists first
        const isUserExist = await findUsers({ phone_number });

        if (!isUserExist?.data?.user_in_db) {
          setFormError("User not found. Please register first.");
          setIsResending(false);
          return;
        }
      }

      const response = await sendOTP({ phone_number });

      if (response?.status === 200) {
        setReferenceId(response?.data?.refrence_id);
        setResendTimer(30); // Reset the timer
        setFormError(""); // Clear any previous errors
      } else {
        setFormError("Failed to resend OTP. Please try again.");
      }
    } catch (error: any) {
      setFormError(error.response?.data?.message || "An error occurred while resending OTP");
    } finally {
      setIsResending(false);
    }
  };

  // Handle Login
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateLoginForm()) return;

    setIsLoading(true);

    try {
      // Checking if the user exists
      const isUserExist = await findUsers({ phone_number });
      console.log(isUserExist)

      if (isUserExist?.data?.user_in_db) {
        const response = await sendOTP({ phone_number });

        if (response?.status === 200 && response?.message === "OTP sent") {
          setReferenceId(response?.data?.refrence_id);
          setShowOtpField(true);
        } else {
          setFormError("Failed to send OTP. Please try again.");
        }
      } else {
        setFormError("User not found. Please register first.");
      }
    } catch (error: any) {
      setFormError(error.response?.data?.message || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Registration
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateRegisterForm()) return;

    setIsLoading(true);

    try {
      const response = await sendOTP({ phone_number });

      if (response?.status === 200) {
        setReferenceId(response?.data?.refrence_id);
        setShowOtpField(true);
      } else {
        setFormError("Failed to send OTP. Please try again.");
      }
    } catch (error: any) {
      setFormError(error.response?.data?.message || "An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP Verification
  const handleOtpVerification = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateOtpForm()) return;

    setIsLoading(true);

    try {
      let result
      if (authMode === "register") {
        // For registration, verify OTP with all user details
        result = await signIn("otp", {
          otp,
          refrence_id: referenceId,
          full_name: name,
          email,
          address,
          dob,
          gender,
          authMode,
          redirect: false,
        });
      } else {
        result = await signIn("otp", {
          otp,
          refrence_id: referenceId,
          authMode,
          redirect: false,
        });
      }

      if (result?.error) {
        setFormError(result.error);
      } else if (result?.ok) {
        router.push("/");
      } else {
        setFormError("Authentication failed");
      }
    } catch (error: any) {
      console.error("OTP verification error ui:", error);
      setFormError(error.response?.data?.message || "An error occurred during OTP verification");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    signOut({ callbackUrl: "/auth" });
  };

  const toggleAuthMode = () => {
    setAuthMode(authMode === "login" ? "register" : "login");
    setShowOtpField(false);
    setEmailError("");
    setNameError("");
    setPhoneError("");
    setAddressError("");
    setDobError("");
    setGenderError("");
    setOtpError("");
    setFormError("");
    setResendTimer(0);
  };

  useEffect(() => {
    if (status === "authenticated") {
      // Check if user has CUSTOMER role
      if (session?.user?.role === "CUSTOMER") {
        router.replace("/");
      }
    }
  }, [status, router, session?.user?.role]);

  return (
    <div className="min-h-screen">
      <AuthContent
        authMode={authMode}
        toggleAuthMode={toggleAuthMode}
        handleLogin={handleLogin}
        handleRegister={handleRegister}
        handleOtpVerification={handleOtpVerification}
        isLoading={isLoading}
        formError={formError}
        name={name}
        setName={setName}
        nameError={nameError}
        email={email}
        setEmail={setEmail}
        emailError={emailError}
        phone_number={phone_number}
        setPhoneNumber={setPhoneNumber}
        phoneError={phoneError}
        address={address}
        setAddress={setAddress}
        addressError={addressError}
        dob={dob}
        setDob={setDob}
        dobError={dobError}
        gender={gender}
        setGender={setGender}
        genderError={genderError}
        otp={otp}
        setOtp={setOtp}
        otpError={otpError}
        setShowOtpField={setShowOtpField}
        showOtpField={showOtpField}
        referenceId={referenceId}
        resendTimer={resendTimer}
        handleResendOtp={handleResendOtp}
        isResending={isResending}
      />
    </div>
  );
}