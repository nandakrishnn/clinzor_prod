import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { Mail, Lock, Stethoscope, Shield, ArrowRight, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';

interface FormState {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface ValidationState {
  email: boolean | null;
  password: boolean | null;
}

const ExpertAuthentication: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [formState, setFormState] = useState<FormState>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [validationState, setValidationState] = useState<ValidationState>({
    email: null,
    password: null,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Real-time validation
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setValidationState(prev => ({
        ...prev,
        email: value ? emailRegex.test(value) : null,
      }));
    }
    
    if (name === 'password') {
      setValidationState(prev => ({
        ...prev,
        password: value ? value.length >= 8 : null,
      }));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      alert(JSON.stringify(formState, null, 2));
      setIsLoading(false);
    }, 1500);
  };

  const ExpertBadge = () => (
    <div className="relative">
      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-white/30 rounded-2xl"></div>
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-2xl"></div>
        <Stethoscope className="w-8 h-8 text-white relative z-10" />
        <Shield className="w-4 h-4 text-blue-200 absolute top-1 right-1 z-10" />
      </div>
      <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
        <CheckCircle className="w-4 h-4 text-white" />
      </div>
    </div>
  );

  const FloatingElements = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/5 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-600/5 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-400/5 rounded-full blur-xl animate-pulse delay-500"></div>
    </div>
  );

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white flex">
      {/* Left Panel - Expert Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <div className="relative z-10 p-12 flex flex-col justify-center text-white">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <ExpertBadge />
              <div>
                <h2 className="text-3xl font-bold">Expert Portal</h2>
                <p className="text-blue-200 text-lg">Clinzor Healthcare</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold mb-3">Advanced Clinical Management</h3>
              <p className="text-blue-100 leading-relaxed">
                Access comprehensive patient data, advanced analytics, and specialized tools designed for healthcare experts.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold mb-3">Secure & Compliant</h3>
              <p className="text-blue-100 leading-relaxed">
                HIPAA-compliant platform with enterprise-grade security for sensitive medical information.
              </p>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-blue-200 text-sm">
              Trusted by healthcare professionals worldwide
            </p>
          </div>
        </div>
        
        <FloatingElements />
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden mb-8 text-center">
            <ExpertBadge />
            <h1 className="text-2xl font-bold text-gray-900 mt-4">Expert Portal</h1>
            <p className="text-gray-600">Clinzor Healthcare</p>
          </div>

          {/* Welcome Section */}
          <div className="text-center lg:text-left mb-8">
            <h1 className="hidden lg:block text-3xl font-bold text-gray-900 mb-2">
              Welcome Back, Expert
            </h1>
            <p className="text-gray-600 text-lg">
              Sign in to access your clinical workspace
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className={`h-5 w-5 transition-colors ${
                    focusedField === 'email' ? 'text-blue-500' : 'text-gray-400'
                  }`} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formState.email}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField('')}
                  className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl transition-all duration-200 focus:outline-none ${
                    focusedField === 'email'
                      ? 'border-blue-500 shadow-lg shadow-blue-500/20'
                      : validationState.email === true
                      ? 'border-green-500'
                      : validationState.email === false
                      ? 'border-red-500'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  placeholder="expert@clinzor.com"
                />
                {validationState.email !== null && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    {validationState.email ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-500 text-sm font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5 transition-colors ${
                    focusedField === 'password' ? 'text-blue-500' : 'text-gray-400'
                  }`} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formState.password}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField('')}
                  className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl transition-all duration-200 focus:outline-none ${
                    focusedField === 'password'
                      ? 'border-blue-500 shadow-lg shadow-blue-500/20'
                      : validationState.password === true
                      ? 'border-green-500'
                      : validationState.password === false
                      ? 'border-red-500'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  placeholder="••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formState.rememberMe}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
                />
                <span className="ml-2 text-sm text-gray-600">Remember this device</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                <>
                  Sign in to Expert Portal
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Help Section */}
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Need Expert Access?</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Contact your system administrator for expert portal credentials.
                </p>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
                  Contact Support →
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Clinzor Healthcare. All rights reserved.</p>
            <div className="flex justify-center gap-4 mt-2">
              <button className="hover:text-blue-600 transition-colors">Privacy Policy</button>
              <button className="hover:text-blue-600 transition-colors">Terms of Service</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertAuthentication;