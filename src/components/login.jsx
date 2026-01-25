import axios from 'axios';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/contstants';
import { addUser } from '../utils/user-slice';

const Login = () => {
  const [email, setEmail] = useState('elon@email.com');
  const [password, setPassword] = useState('Elon@1234567');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      return 'Email is required';
    }
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  // Password validation
  const validatePassword = (password) => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    return '';
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors = {};
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle email change with validation
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setServerError('');
    // Clear error when user starts typing
    if (errors.email) {
      const emailError = validateEmail(value);
      setErrors((prev) => ({
        ...prev,
        email: emailError || undefined,
      }));
    }
  };

  // Handle password change with validation
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setServerError('');
    // Clear error when user starts typing
    if (errors.password) {
      const passwordError = validatePassword(value);
      setErrors((prev) => ({
        ...prev,
        password: passwordError || undefined,
      }));
    }
  };

  // Handle blur events for validation
  const handleEmailBlur = () => {
    const emailError = validateEmail(email);
    setErrors((prev) => ({
      ...prev,
      email: emailError || undefined,
    }));
  };

  const handlePasswordBlur = () => {
    const passwordError = validatePassword(password);
    setErrors((prev) => ({
      ...prev,
      password: passwordError || undefined,
    }));
  };

  // Helper function to get user-friendly error messages
  const getErrorMessage = (error) => {
    // Network errors (no response from server)
    if (!error.response) {
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        return 'Request timed out. Please check your internet connection and try again.';
      }
      if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
        return 'Unable to connect to the server. Please check your internet connection and try again.';
      }
      return 'Network error. Please check your connection and try again.';
    }

    const status = error.response.status;
    const data = error.response.data;

    // Handle different HTTP status codes
    switch (status) {
      case 400:
        // Bad Request - validation errors
        if (data.errors && Array.isArray(data.errors)) {
          // Handle field-specific validation errors
          const fieldErrors = {};
          data.errors.forEach((err) => {
            if (err.field) {
              fieldErrors[err.field] = err.message;
            }
          });
          if (Object.keys(fieldErrors).length > 0) {
            setErrors((prev) => ({ ...prev, ...fieldErrors }));
          }
          return data.message || 'Please check your input and try again.';
        }
        return data.message || data.error || 'Invalid request. Please check your credentials and try again.';

      case 401:
        // Unauthorized - invalid credentials
        return data.message || data.error || 'Invalid email or password. Please check your credentials and try again.';

      case 403:
        // Forbidden
        return data.message || data.error || 'Access denied. Your account may be restricted.';

      case 404:
        // Not Found
        return data.message || data.error || 'Login endpoint not found. Please contact support.';

      case 422:
        // Unprocessable Entity - validation errors
        if (data.errors) {
          const fieldErrors = {};
          Object.keys(data.errors).forEach((field) => {
            const fieldName = field === 'emailId' ? 'email' : field;
            fieldErrors[fieldName] = Array.isArray(data.errors[field])
              ? data.errors[field][0]
              : data.errors[field];
          });
          if (Object.keys(fieldErrors).length > 0) {
            setErrors((prev) => ({ ...prev, ...fieldErrors }));
          }
        }
        return data.message || data.error || 'Please correct the errors and try again.';

      case 429:
        // Too Many Requests
        return data.message || data.error || 'Too many login attempts. Please wait a few minutes and try again.';

      case 500:
        // Internal Server Error
        return 'Server error. Our team has been notified. Please try again in a few moments.';

      case 502:
      case 503:
      case 504:
        // Bad Gateway, Service Unavailable, Gateway Timeout
        return 'Service temporarily unavailable. Please try again in a few moments.';

      default:
        // Other errors
        if (data.message) {
          return data.message;
        }
        if (data.error) {
          return data.error;
        }
        return `An unexpected error occurred (${status}). Please try again or contact support if the problem persists.`;
    }
  };

  const hanldeLogin = async () => {
    // Clear previous server errors and field errors
    setServerError('');
    setErrors({});
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/login`,
        { emailId: email, password: password },
        {
          withCredentials: true,
          timeout: 10000, // 10 second timeout
        }
      );
      console.log('Login successful:', response.data);
      // The response structure is {message: '...', data: {...}}
      // We need to dispatch the nested data object which contains the user info
      dispatch(addUser(response.data.data));
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = getErrorMessage(error);
      setServerError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200 p-4">
      <div className="card bg-base-100 w-full max-w-md shadow-2xl border border-base-300">
        <div className="card-body p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Welcome Back</h1>
            <p className="text-base-content/70">Sign in to your account to continue</p>
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              hanldeLogin();
            }}
            className="space-y-6"
          >
            {/* Server Error Message */}
            {serverError && (
              <div className="alert alert-error shadow-lg animate-fade-in">
                <div className="flex-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-current shrink-0 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-label="Error icon"
                  >
                    <title>Error</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div className="flex-1">
                    <h3 className="font-semibold">Login Failed</h3>
                    <div className="text-sm">{serverError}</div>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-ghost"
                  onClick={() => setServerError('')}
                  aria-label="Dismiss error"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <title>Close</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}

            {/* Email Field */}
            <div className="form-control">
              <label htmlFor="email" className="label">
                <span className="label-text font-semibold">Email Address</span>
              </label>
              <input
                type="email"
                id="email"
                className={`input input-bordered w-full focus:outline-none transition-all ${
                  errors.email
                    ? 'input-error border-error'
                    : 'input-primary focus:input-primary'
                }`}
                value={email}
                placeholder="Enter your email"
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                required
              />
              {errors.email && (
                <div className="label">
                  <span className="label-text-alt text-error">{errors.email}</span>
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className="form-control">
              <label htmlFor="password" className="label">
                <span className="label-text font-semibold">Password</span>
              </label>
              <input
                type="password"
                id="password"
                value={password}
                className={`input input-bordered w-full focus:outline-none transition-all ${
                  errors.password
                    ? 'input-error border-error'
                    : 'input-primary focus:input-primary'
                }`}
                placeholder="Enter your password"
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
                required
              />
              {errors.password && (
                <div className="label">
                  <span className="label-text-alt text-error">{errors.password}</span>
                </div>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="label cursor-pointer gap-2">
                <input type="checkbox" className="checkbox checkbox-sm checkbox-primary" />
                <span className="label-text">Remember me</span>
              </label>
              <button type="button" className="link link-primary link-hover">
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <div className="form-control mt-8">
              <button
                type="submit"
                className="btn btn-primary w-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="divider my-6">OR</div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm text-base-content/70">
              Don't have an account?{' '}
              <button type="button" className="link link-primary font-semibold">
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
