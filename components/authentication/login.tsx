"use client";
import { JSX, useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

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
  toggleVisibility = () => { }
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
        className={`block w-full px-4 py-3 pl-10 rounded-xl border text-black placeholder:text-black ${error ? "border-red-300" : "border-neutral-300"
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
  handleGoogleSignIn: () => void;
  handleEmailAuth: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  formError: string;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  nameError: string;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  emailError: string;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  passwordError: string;
  confirmPassword: string;
  setConfirmPassword: React.Dispatch<React.SetStateAction<string>>;
  confirmPasswordError: string;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
};

function AuthContent({
  authMode,
  toggleAuthMode,
  handleGoogleSignIn,
  handleEmailAuth,
  isLoading,
  formError,
  name,
  setName,
  nameError,
  email,
  setEmail,
  emailError,
  password,
  setPassword,
  passwordError,
  confirmPassword,
  setConfirmPassword,
  confirmPasswordError,
  showPassword,
  setShowPassword
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
              {authMode === "login" ? "Welcome back" : "Create account"}
            </h2>
            <p className="mt-2 text-primaryColor">
              {authMode === "login"
                ? "Sign in to access your account"
                : "Fill in your details to get started"}
            </p>
          </motion.div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="flex items-center justify-center w-full py-3 px-4 border border-neutral-300 rounded-xl text-black hover:bg-neutral-100 transition duration-200 mb-6"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.19-2.25H12v4.26h5.92c-.26 1.38-1.06 2.54-2.26 3.32v2.77h3.64c2.13-1.97 3.36-4.87 3.36-8.1z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.06 0 5.63-1.02 7.51-2.76l-3.64-2.77c-1.01.68-2.29 1.08-3.87 1.08-2.98 0-5.5-2.01-6.4-4.7H2.79v2.85C4.67 20.98 8.07 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 13.85c-.23-.68-.36-1.41-.36-2.15s.13-1.47.36-2.15V6.7H2.79A10.01 10.01 0 002 11.7c0 1.64.39 3.2 1.08 4.6l2.52-2.45z"
              />
              <path
                fill="#EA4335"
                d="M12 4.8c1.67 0 3.16.57 4.34 1.68l3.24-3.24C17.63 1.02 15.06 0 12 0 8.07 0 4.67 2.02 2.79 4.7l2.81 2.85c.9-2.69 3.42-4.7 6.4-4.7z"
              />
            </svg>
            {isLoading ? "Signing in..." : "Continue with Google"}
          </button>

          {formError && (
            <div className="mb-6 p-3 rounded-lg bg-red-100 text-red-700 text-sm flex items-center">
              <AlertCircle size={16} className="mr-2" />
              {formError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleEmailAuth}>
            {authMode === "register" && (
              <Input
                id="name"
                label="Full Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={nameError}
                placeholder="Your name"
              />
            )}
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
              id="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={passwordError}
              placeholder="Password"
              icon={<Lock size={18} />}
              showToggle
              toggleVisibility={() => setShowPassword(!showPassword)}
            />
            {authMode === "register" && (
              <Input
                id="confirmPassword"
                label="Confirm Password"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={confirmPasswordError}
                placeholder="Confirm password"
                showToggle
                toggleVisibility={() => setShowPassword(!showPassword)}
              />
            )}

            {/* Remember me + Forgot password */}
            <div className="flex justify-between items-center mb-6">
              {authMode === "login" && (
                <>
                  <label className="text-sm text-black flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Remember me
                  </label>
                  <a href="#" className="text-sm text-blue-600 hover:underline">
                    Forgot password?
                  </a>
                </>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-primaryColor text-white rounded-xl hover:bg-neutral-900 transition duration-200"
            >
              {isLoading
                ? "Processing..."
                : authMode === "login"
                  ? "Sign In"
                  : "Create Account"}
            </button>

            {/* Toggle mode */}
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
          <img
            src={user?.avatar}
            alt={user?.name}
            className="mx-auto mb-4 rounded-full h-24 w-24 object-cover"
          />
          <h2 className="text-2xl font-bold text-black">{user?.name}</h2>
          <p className="text-black">{user?.email}</p>
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; avatar: string } | null>(null);

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Errors
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [nameError, setNameError] = useState("");
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  // Handle Email/Password Auth
  const handleEmailAuth = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setNameError("");
    setFormError("");

    let hasErrors = false;

    if (!email.trim()) {
      setEmailError("Email is required");
      hasErrors = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Invalid email address");
      hasErrors = true;
    }

    if (!password) {
      setPasswordError("Password is required");
      hasErrors = true;
    } else if (password.length < 8) {
      setPasswordError("Minimum 8 characters required");
      hasErrors = true;
    }

    if (authMode === "register") {
      if (!name.trim()) {
        setNameError("Name is required");
        hasErrors = true;
      }
      if (password !== confirmPassword) {
        setConfirmPasswordError("Passwords do not match");
        hasErrors = true;
      }
    }

    if (hasErrors) return;

    setIsLoading(true);
    setTimeout(() => {
      const newUser = {
        name: authMode === "login" ? "Demo User" : name,
        email,
        avatar: "/api/placeholder/100/100"
      };
      setUser(newUser);
      setIsAuthenticated(true);
      setIsLoading(false);
      router.push("/user");
    }, 1500);
  };

  // Handle Google Sign In
  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      setUser({
        name: "Google User",
        email: "user@gmail.com",
        avatar: "/api/placeholder/100/100"
      });
      setIsAuthenticated(true);
      setIsLoading(false);
    }, 1500);
  };

  // Handle Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const toggleAuthMode = () => {
    setAuthMode(authMode === "login" ? "register" : "login");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setNameError("");
    setFormError("");
  };

  return (
    <div className="min-h-screen">
      <AuthContent
        authMode={authMode}
        toggleAuthMode={toggleAuthMode}
        handleGoogleSignIn={handleGoogleSignIn}
        handleEmailAuth={handleEmailAuth}
        isLoading={isLoading}
        formError={formError}
        name={name}
        setName={setName}
        nameError={nameError}
        email={email}
        setEmail={setEmail}
        emailError={emailError}
        password={password}
        setPassword={setPassword}
        passwordError={passwordError}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        confirmPasswordError={confirmPasswordError}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
      />
    </div>
  );
}
