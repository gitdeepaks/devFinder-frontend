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

  const validateEmail = (e) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!e.trim()) return 'Email is required';
    if (!emailRegex.test(e)) return 'Please enter a valid email';
    return '';
  };

  const validatePassword = (p) => {
    if (!p) return 'Password is required';
    if (p.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  const validateForm = () => {
    const newErrors = {};
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setServerError('');
    if (errors.email) setErrors((prev) => ({ ...prev, email: validateEmail(value) || undefined }));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setServerError('');
    if (errors.password) setErrors((prev) => ({ ...prev, password: validatePassword(value) || undefined }));
  };

  const handleEmailBlur = () => setErrors((prev) => ({ ...prev, email: validateEmail(email) || undefined }));
  const handlePasswordBlur = () =>
    setErrors((prev) => ({ ...prev, password: validatePassword(password) || undefined }));

  const getErrorMessage = (error) => {
    if (!error.response) {
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout'))
        return 'Request timed out. Check your connection.';
      if (error.message === 'Network Error' || error.code === 'ERR_NETWORK')
        return 'Unable to connect. Check your internet.';
      return 'Network error. Try again.';
    }
    const status = error.response.status;
    const data = error.response.data;
    switch (status) {
      case 400:
        if (data.errors?.length) {
          const fieldErrors = {};
          data.errors.forEach((err) => {
            if (err.field) fieldErrors[err.field] = err.message;
          });
          if (Object.keys(fieldErrors).length) setErrors((prev) => ({ ...prev, ...fieldErrors }));
        }
        return data.message || data.error || 'Invalid request. Check your credentials.';
      case 401:
        return data.message || data.error || 'Invalid email or password.';
      case 403:
        return data.message || data.error || 'Access denied.';
      case 404:
        return data.message || data.error || 'Login endpoint not found.';
      case 422:
        if (data.errors) {
          const fieldErrors = {};
          Object.keys(data.errors).forEach((field) => {
            const name = field === 'emailId' ? 'email' : field;
            fieldErrors[name] = Array.isArray(data.errors[field]) ? data.errors[field][0] : data.errors[field];
          });
          if (Object.keys(fieldErrors).length) setErrors((prev) => ({ ...prev, ...fieldErrors }));
        }
        return data.message || data.error || 'Please correct the errors and try again.';
      case 429:
        return data.message || data.error || 'Too many attempts. Wait a moment.';
      case 500:
        return 'Server error. Please try again shortly.';
      case 502:
      case 503:
      case 504:
        return 'Service temporarily unavailable.';
      default:
        return data?.message || data?.error || `Error (${status}). Please try again.`;
    }
  };

  const handleLogin = async () => {
    setServerError('');
    setErrors({});
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/login`,
        { emailId: email, password },
        { withCredentials: true, timeout: 10000 }
      );
      dispatch(addUser(response.data.data));
      navigate('/');
    } catch (error) {
      setServerError(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Gradient mesh background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10" aria-hidden />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/20 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="card bg-base-100/95 backdrop-blur-xl shadow-2xl border border-base-300/50 rounded-3xl overflow-hidden">
          <div className="card-body p-8 sm:p-10">
            <div className="text-center mb-8">
              <h1 className="font-logo text-3xl font-bold text-base-content tracking-tight">Welcome back</h1>
              <p className="mt-2 text-base-content/70">Sign in to DevFinder</p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
              className="space-y-5"
            >
              {serverError && (
                <div className="alert alert-error rounded-2xl shadow-lg">
                  <span>{serverError}</span>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm btn-circle"
                    onClick={() => setServerError('')}
                    aria-label="Dismiss"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden
                    >
                      <title>Dismiss</title>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}

              <div className="form-control">
                <label htmlFor="email" className="label">
                  <span className="label-text font-semibold">Email</span>
                </label>
                <input
                  type="email"
                  id="email"
                  className={`input input-bordered w-full rounded-xl transition-all ${
                    errors.email ? 'input-error' : ''
                  }`}
                  value={email}
                  placeholder="you@example.com"
                  onChange={handleEmailChange}
                  onBlur={handleEmailBlur}
                  required
                />
                {errors.email && <p className="label-text-alt text-error mt-1">{errors.email}</p>}
              </div>

              <div className="form-control">
                <label htmlFor="password" className="label">
                  <span className="label-text font-semibold">Password</span>
                </label>
                <input
                  type="password"
                  id="password"
                  className={`input input-bordered w-full rounded-xl transition-all ${
                    errors.password ? 'input-error' : ''
                  }`}
                  value={password}
                  placeholder="••••••••"
                  onChange={handlePasswordChange}
                  onBlur={handlePasswordBlur}
                  required
                />
                {errors.password && <p className="label-text-alt text-error mt-1">{errors.password}</p>}
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="label cursor-pointer gap-2 py-0">
                  <input type="checkbox" className="checkbox checkbox-sm checkbox-primary rounded" />
                  <span className="label-text">Remember me</span>
                </label>
                <button type="button" className="link link-primary link-hover">
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full rounded-xl h-12 text-base font-semibold shadow-lg shadow-primary/20 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm" />
                    Signing in…
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>

            <p className="text-center text-sm text-base-content/60 mt-6">
              Don’t have an account?{' '}
              <button type="button" className="link link-primary font-semibold" onClick={() => navigate('/signup')}>
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
