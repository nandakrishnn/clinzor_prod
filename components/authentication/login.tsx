"use client";
import { JSX, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

export default function AuthenticationGateway() {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  interface User {
    name: string;
    email: string;
    avatar: string;
  }

  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [nameError, setNameError] = useState('');
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setNameError('');
    setFormError('');

    let hasErrors = false;

    if (!email.trim()) {
      setEmailError('Email is required');
      hasErrors = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Invalid email address');
      hasErrors = true;
    }

    if (!password) {
      setPasswordError('Password is required');
      hasErrors = true;
    } else if (password.length < 8) {
      setPasswordError('Minimum 8 characters required');
      hasErrors = true;
    }

    if (authMode === 'register') {
      if (!name.trim()) {
        setNameError('Name is required');
        hasErrors = true;
      }
      if (password !== confirmPassword) {
        setConfirmPasswordError('Passwords do not match');
        hasErrors = true;
      }
    }

    if (hasErrors) return;

    setIsLoading(true);
    setTimeout(() => {
      const newUser = {
        name: authMode === 'login' ? 'Demo User' : name,
        email,
        avatar: '/api/placeholder/100/100',
      };
      setUser(newUser);
      setIsAuthenticated(true);
      setIsLoading(false);
    }, 1500);
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      setUser({
        name: 'Google User',
        email: 'user@gmail.com',
        avatar: '/api/placeholder/100/100',
      });
      setIsAuthenticated(true);
      setIsLoading(false);
    }, 1500);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setNameError('');
    setFormError('');
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
    toggleVisibility = () => {},
  }: {
    id: string;
    label: string;
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    placeholder: string;
    icon?: JSX.Element;
    showToggle?: boolean;
    toggleVisibility?: () => void;
  }) => (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-black mb-1">
        {label}
      </label>
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black">{icon}</div>}
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={isLoading}
          className={`block w-full px-4 py-3 pl-10 rounded-xl border text-black placeholder:text-black ${
            error ? 'border-red-300' : 'border-neutral-300'
          } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200`}
        />
        {showToggle && (
          <button
            type="button"
            onClick={toggleVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black hover:text-neutral-600"
          >
            {type === 'text' ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );

  const AuthContent = () => (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <motion.div
          className="backdrop-blur-xl  rounded-3xl shadow-xl p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-black">
              {authMode === 'login' ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="mt-2 text-black">
              {authMode === 'login' ? 'Sign in to access your account' : 'Fill in your details to get started'}
            </p>
          </motion.div>

          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="flex items-center justify-center w-full py-3 px-4 border border-neutral-300 rounded-xl text-black hover:bg-neutral-100 transition duration-200 mb-6"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78..." />
            </svg>
            {isLoading ? 'Signing in...' : 'Continue with Google'}
          </button>

          {formError && (
            <div className="mb-6 p-3 rounded-lg bg-red-100 text-red-700 text-sm flex items-center">
              <AlertCircle size={16} className="mr-2" />
              {formError}
            </div>
          )}

          <form onSubmit={handleEmailAuth}>
            {authMode === 'register' && (
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
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={passwordError}
              placeholder="Password"
              icon={<Lock size={18} />}
              showToggle
              toggleVisibility={() => setShowPassword(!showPassword)}
            />
            {authMode === 'register' && (
              <Input
                id="confirmPassword"
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={confirmPasswordError}
                placeholder="Confirm password"
                showToggle
                toggleVisibility={() => setShowPassword(!showPassword)}
              />
            )}

            <div className="flex justify-between items-center mb-6">
              {authMode === 'login' && (
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-black text-white rounded-xl hover:bg-neutral-900 transition duration-200"
            >
              {isLoading ? 'Processing...' : authMode === 'login' ? 'Sign In' : 'Create Account'}
            </button>

            <div className="mt-6 text-center text-sm text-black">
              {authMode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button type="button" onClick={toggleAuthMode} className="font-semibold text-blue-600 hover:underline">
                {authMode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );

  const UserDashboard = () => (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <motion.div
        className="backdrop-blur-xl rounded-3xl shadow-xl p-8 max-w-md w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center">
          <img src={user?.avatar} alt={user?.name} className="mx-auto mb-4 rounded-full h-24 w-24 object-cover" />
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

  return <div className="min-h-screen ">{isAuthenticated ? <UserDashboard /> : <AuthContent />}</div>;
}