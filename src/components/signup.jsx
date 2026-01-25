import { toast } from '@pheralb/toast';
import axios from 'axios';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/contstants';
import { addUser } from '../utils/user-slice';

export const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    emailId: '',
    password: '',
    gender: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateFirstName = (v) => {
    if (!v.trim()) return 'First name is required';
    if (v.trim().length < 2) return 'At least 2 characters';
    return '';
  };
  const validateLastName = (v) => (!v.trim() ? 'Last name is required' : '');
  const validateEmail = (v) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!v.trim()) return 'Email is required';
    if (!re.test(v)) return 'Valid email required';
    return '';
  };
  const validatePassword = (v) => {
    if (!v) return 'Password is required';
    if (v.length < 6) return 'At least 6 characters';
    return '';
  };
  const validateGender = (v) => {
    if (!v) return 'Gender is required';
    if (!['male', 'female', 'other'].includes(v.toLowerCase())) return 'Select male, female, or other';
    return '';
  };

  const validateForm = () => {
    const e = {};
    const fn = validateFirstName(formData.firstName);
    const ln = validateLastName(formData.lastName);
    const em = validateEmail(formData.emailId);
    const pw = validatePassword(formData.password);
    const g = validateGender(formData.gender);
    if (fn) e.firstName = fn;
    if (ln) e.lastName = ln;
    if (em) e.emailId = em;
    if (pw) e.password = pw;
    if (g) e.gender = g;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleInputChange = (ev) => {
    const { name, value } = ev.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      let err = '';
      switch (name) {
        case 'firstName':
          err = validateFirstName(value);
          break;
        case 'lastName':
          err = validateLastName(value);
          break;
        case 'emailId':
          err = validateEmail(value);
          break;
        case 'password':
          err = validatePassword(value);
          break;
        case 'gender':
          err = validateGender(value);
          break;
        default:
          break;
      }
      setErrors((prev) => ({ ...prev, [name]: err || undefined }));
    }
  };

  const handleBlur = (ev) => {
    const { name, value } = ev.target;
    let err = '';
    switch (name) {
      case 'firstName':
        err = validateFirstName(value);
        break;
      case 'lastName':
        err = validateLastName(value);
        break;
      case 'emailId':
        err = validateEmail(value);
        break;
      case 'password':
        err = validatePassword(value);
        break;
      case 'gender':
        err = validateGender(value);
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: err || undefined }));
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setErrors({});
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        emailId: formData.emailId.trim(),
        password: formData.password,
        gender: formData.gender.toLowerCase(),
      };
      const res = await axios.post(`${BASE_URL}/singup`, payload, { withCredentials: true });
      dispatch(addUser(res.data.data));
      toast.success({
        text: 'Account created',
        description: res.data?.message || 'Welcome to DevFinder!',
      });
      navigate('/');
    } catch (error) {
      if (error.response?.status === 400 || error.response?.status === 422) {
        const d = error.response.data;
        if (d.errors) {
          const fieldErrors = {};
          Object.keys(d.errors).forEach((f) => {
            fieldErrors[f] = Array.isArray(d.errors[f]) ? d.errors[f][0] : d.errors[f];
          });
          setErrors(fieldErrors);
        }
      }
      const msg =
        error.response?.data?.message || error.response?.data?.error || error.message || 'Signup failed. Try again.';
      toast.error({ text: 'Signup failed', description: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-base-100 to-primary/10" aria-hidden />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="card bg-base-100/95 backdrop-blur-xl shadow-2xl border border-base-300/50 rounded-3xl overflow-hidden">
          <div className="card-body p-8 sm:p-10">
            <div className="text-center mb-6">
              <h1 className="font-logo text-3xl font-bold text-base-content tracking-tight">Create account</h1>
              <p className="mt-2 text-base-content/70">Join DevFinder and connect with developers</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label htmlFor="firstName" className="label py-0">
                    <span className="label-text font-semibold">First name</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className={`input input-bordered w-full rounded-xl ${errors.firstName ? 'input-error' : ''}`}
                    value={formData.firstName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Jane"
                    required
                  />
                  {errors.firstName && <p className="label-text-alt text-error">{errors.firstName}</p>}
                </div>
                <div className="form-control">
                  <label htmlFor="lastName" className="label py-0">
                    <span className="label-text font-semibold">Last name</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className={`input input-bordered w-full rounded-xl ${errors.lastName ? 'input-error' : ''}`}
                    value={formData.lastName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Doe"
                    required
                  />
                  {errors.lastName && <p className="label-text-alt text-error">{errors.lastName}</p>}
                </div>
              </div>

              <div className="form-control">
                <label htmlFor="emailId" className="label py-0">
                  <span className="label-text font-semibold">Email</span>
                </label>
                <input
                  type="email"
                  id="emailId"
                  name="emailId"
                  className={`input input-bordered w-full rounded-xl ${errors.emailId ? 'input-error' : ''}`}
                  value={formData.emailId}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="you@example.com"
                  required
                />
                {errors.emailId && <p className="label-text-alt text-error">{errors.emailId}</p>}
              </div>

              <div className="form-control">
                <label htmlFor="password" className="label py-0">
                  <span className="label-text font-semibold">Password</span>
                  <span className="label-text-alt">min 6 characters</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className={`input input-bordered w-full rounded-xl ${errors.password ? 'input-error' : ''}`}
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="••••••••"
                  required
                />
                {errors.password && <p className="label-text-alt text-error">{errors.password}</p>}
              </div>

              <div className="form-control">
                <label htmlFor="gender" className="label py-0">
                  <span className="label-text font-semibold">Gender</span>
                </label>
                <select
                  id="gender"
                  name="gender"
                  className={`select select-bordered w-full rounded-xl ${errors.gender ? 'select-error' : ''}`}
                  value={formData.gender}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  required
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && <p className="label-text-alt text-error">{errors.gender}</p>}
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full rounded-xl h-12 text-base font-semibold shadow-lg shadow-primary/20 mt-4 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm" />
                    Creating…
                  </>
                ) : (
                  'Sign up'
                )}
              </button>
            </form>

            <p className="text-center text-sm text-base-content/60 mt-6">
              Already have an account?{' '}
              <button type="button" className="link link-primary font-semibold" onClick={() => navigate('/login')}>
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
