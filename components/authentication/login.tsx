"use client";
import { JSX, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, AlertCircle, Phone, User, MapPin, Key } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { axiosPrivate } from "@/axios/axios";
import { sendOTP } from "@/service/user/userAuthService/userAuthService";

// =======================
// Reusable Input Component
// =======================
type InputProps = {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  icon?: JSX.Element;
  showToggle?: boolean;
  toggleVisibility?: () => void;
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
  toggleVisibility = () => {}
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
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`block w-full px-4 py-3 ${icon ? 'pl-10' : 'pl-4'} rounded-xl border text-black placeholder:text-black ${
          error ? "border-red-300" : "border-neutral-300"
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
  handlePhoneAuth: (e: React.FormEvent<HTMLFormElement>) => void;
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
  otp: string;
  setOtp: React.Dispatch<React.SetStateAction<string>>;
  otpError: string;
  showOtpField: boolean;
  referenceId: string;
};

function AuthContent({
  authMode,
  toggleAuthMode,
  handlePhoneAuth,
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
  otp,
  setOtp,
  otpError,
  showOtpField,
  referenceId
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
          <form onSubmit={handlePhoneAuth}>
            {!showOtpField ? (
              <>
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
              </>
            ) : (
              // OTP Verification Form
              <>
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
                  Didn't receive the code?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      // Resend OTP logic would go here
                      handlePhoneAuth({ preventDefault: () => {} } as React.FormEvent<HTMLFormElement>);
                    }}
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    Resend OTP
                  </button>
                </div>
              </>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
}

// =======================
// User Dashboard Component
// =======================
function UserDashboard({ user, handleLogout }: { user: any; handleLogout: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <motion.div
        className="backdrop-blur-xl rounded-3xl border border-neutral-300 p-8 max-w-md w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center">
          <div className="mx-auto mb-4 rounded-full h-24 w-24 bg-gray-200 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-600">
              {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-black">{user?.name || "User"}</h2>
          <p className="text-black">{user?.email}</p>
          <p className="text-black">{user?.phone_number}</p>
          <p className="text-black mt-2">Role: {user?.role || "User"}</p>
          <button
            onClick={handleLogout}
            className="mt-6 px-6 py-3 bg-black text-white rounded-full hover:bg-neutral-900 transition"
          >
            Sign out
          </button>
        </div>
      </motion.div>
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
  const [otp, setOtp] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [referenceId, setReferenceId] = useState("");

  // Errors
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handle Phone/OTP Auth
  const handlePhoneAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailError("");
    setNameError("");
    setPhoneError("");
    setAddressError("");
    setOtpError("");
    setFormError("");

    let hasErrors = false;

    if (!showOtpField) {
      // Phone validation
      if (!phone_number.trim()) {
        setPhoneError("Phone number is required");
        hasErrors = true;
      }

      if (authMode === "register") {
        // Registration validation
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
        
        if (!address.trim()) {
          setAddressError("Address is required");
          hasErrors = true;
        }
      }
    } else {
      // OTP validation
      if (!otp.trim()) {
        setOtpError("OTP is required");
        hasErrors = true;
      }
    }

    if (hasErrors) return;

    setIsLoading(true);

    try {
      if (!showOtpField) {
        // Send OTP
        const response = await sendOTP({ phone_number });
        setReferenceId(response.refrence_id);
        setShowOtpField(true);
      } else {
        // Verify OTP and sign in
        const otpData = {
          otp,
          refrence_id: referenceId,
          ...(authMode === "register" && {
            full_name: name,
            email,
            address
          })
        };

        // This will trigger the NextAuth authorize function
        const result = await signIn("credentials", {
          redirect: false,
          ...otpData,
          phone_number,
          authMode
        });

        if (result?.error) {
          setFormError(result.error);
        } else {
          router.push("/");
        }
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      setFormError(error.response?.data?.message || "An error occurred during authentication");
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
    setOtpError("");
    setFormError("");
  };
useEffect(() => {
  if (status === "authenticated") {
    // Check if user has EXPERT role
    if (session?.user?.role === "CUSTOMER") {
      router.replace("/");
    }
   
  }
}, [status, router, session?.user?.role]);
  // // If already authenticated, show dashboard
  // if (status === "authenticated") {
  //   return <UserDashboard user={session.user} handleLogout={handleLogout} />;
  // }

  return (
    <div className="min-h-screen">
      <AuthContent
        authMode={authMode}
        toggleAuthMode={toggleAuthMode}
        handlePhoneAuth={handlePhoneAuth}
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
        otp={otp}
        setOtp={setOtp}
        otpError={otpError}
        showOtpField={showOtpField}
        referenceId={referenceId}
      />
    </div>
  );
}