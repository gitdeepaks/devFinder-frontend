import { toast } from '@pheralb/toast';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BASE_URL } from '../utils/contstants';
import { addUser } from '../utils/user-slice';
import { ProfileCard } from './profile-card';

export const EditProfile = () => {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    emailId: '',
    photoUrl: '',
    gender: '',
    age: '',
    about: '',
    skills: [],
  });

  const [skillInput, setSkillInput] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load user data into form
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        emailId: user.emailId || '',
        photoUrl: user.photoUrl || '',
        gender: user.gender || '',
        age: user.age || '',
        about: user.about || '',
        skills: user.skills || [],
      });
    }
  }, [user]);

  // Validation functions
  const validateFirstName = (value) => {
    if (!value.trim()) return '';
    if (value.trim().length < 3) {
      return 'First name must be at least 3 characters';
    }
    return '';
  };

  const validateEmail = (value) => {
    if (!value.trim()) return '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validateUrl = (value) => {
    if (!value.trim()) return '';
    try {
      new URL(value);
      return '';
    } catch {
      return 'Please enter a valid URL';
    }
  };

  const validateAge = (value) => {
    if (!value) return '';
    const age = parseInt(value, 10);
    if (Number.isNaN(age) || age < 18) {
      return 'Age must be at least 18';
    }
    return '';
  };

  const validateGender = (value) => {
    if (!value) return '';
    const validGenders = ['male', 'female', 'other'];
    if (!validGenders.includes(value.toLowerCase())) {
      return 'Gender must be male, female, or other';
    }
    return '';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Real-time validation
    if (errors[name]) {
      let error = '';
      switch (name) {
        case 'firstName':
          error = validateFirstName(value);
          break;
        case 'emailId':
          error = validateEmail(value);
          break;
        case 'photoUrl':
          error = validateUrl(value);
          break;
        case 'age':
          error = validateAge(value);
          break;
        case 'gender':
          error = validateGender(value);
          break;
        default:
          break;
      }
      setErrors((prev) => ({ ...prev, [name]: error || undefined }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let error = '';

    switch (name) {
      case 'firstName':
        error = validateFirstName(value);
        break;
      case 'emailId':
        error = validateEmail(value);
        break;
      case 'photoUrl':
        error = validateUrl(value);
        break;
      case 'age':
        error = validateAge(value);
        break;
      case 'gender':
        error = validateGender(value);
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error || undefined }));
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.firstName) {
      const error = validateFirstName(formData.firstName);
      if (error) newErrors.firstName = error;
    }

    if (formData.emailId) {
      const error = validateEmail(formData.emailId);
      if (error) newErrors.emailId = error;
    }

    if (formData.photoUrl) {
      const error = validateUrl(formData.photoUrl);
      if (error) newErrors.photoUrl = error;
    }

    if (formData.age) {
      const error = validateAge(formData.age);
      if (error) newErrors.age = error;
    }

    if (formData.gender) {
      const error = validateGender(formData.gender);
      if (error) newErrors.gender = error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare payload - only include fields that have values
      const payload = {};
      if (formData.firstName) payload.firstName = formData.firstName.trim();
      if (formData.lastName) payload.lastName = formData.lastName.trim();
      if (formData.emailId) payload.emailId = formData.emailId.trim();
      if (formData.photoUrl) payload.photoUrl = formData.photoUrl.trim();
      if (formData.gender) payload.gender = formData.gender.toLowerCase();
      if (formData.age) payload.age = parseInt(formData.age, 10);
      if (formData.about) payload.about = formData.about.trim();
      if (formData.skills.length > 0) payload.skills = formData.skills;

      const response = await axios.patch(`${BASE_URL}/profile/edit`, payload, {
        withCredentials: true,
        timeout: 10000,
      });

      console.log('Profile updated:', response.data);

      // Update user in Redux store
      if (response.data.data) {
        dispatch(addUser(response.data.data));
      }

      toast.success({
        text: 'Profile Updated',
        description: response.data.message || 'Profile updated successfully!',
      });
    } catch (error) {
      console.error('Profile update error:', error);

      let errorMessage = 'An error occurred while updating your profile. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error({
        text: 'Update Failed',
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-lg text-base-content/70">Please log in to edit your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pb-24 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <ProfileCard user={user} />
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="card bg-base-100 shadow-xl rounded-3xl border border-base-300/50 overflow-hidden">
            <div className="card-body p-6 sm:p-8">
              <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* First Name */}
                <div className="form-control">
                  <label htmlFor="firstName" className="label py-0">
                    <span className="label-text font-semibold">First Name</span>
                    <span className="label-text-alt text-error">* Min 3 chars</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className={`input input-bordered w-full rounded-xl ${errors.firstName ? 'input-error' : ''}`}
                    value={formData.firstName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && (
                    <div className="label">
                      <span className="label-text-alt text-error">{errors.firstName}</span>
                    </div>
                  )}
                </div>

                {/* Last Name */}
                <div className="form-control">
                  <label htmlFor="lastName" className="label py-0">
                    <span className="label-text font-semibold">Last Name</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="input input-bordered w-full rounded-xl"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter your last name"
                  />
                </div>

                {/* Email */}
                <div className="form-control">
                  <label htmlFor="emailId" className="label py-0">
                    <span className="label-text font-semibold">Email</span>
                    <span className="label-text-alt text-error">* Unique</span>
                  </label>
                  <input
                    type="email"
                    id="emailId"
                    name="emailId"
                    className={`input input-bordered w-full rounded-xl ${errors.emailId ? 'input-error' : ''}`}
                    value={formData.emailId}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Enter your email"
                  />
                  {errors.emailId && (
                    <div className="label">
                      <span className="label-text-alt text-error">{errors.emailId}</span>
                    </div>
                  )}
                </div>

                {/* Photo URL */}
                <div className="form-control">
                  <label htmlFor="photoUrl" className="label py-0">
                    <span className="label-text font-semibold">Profile Photo URL</span>
                  </label>
                  <input
                    type="url"
                    id="photoUrl"
                    name="photoUrl"
                    className={`input input-bordered w-full rounded-xl ${errors.photoUrl ? 'input-error' : ''}`}
                    value={formData.photoUrl}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="https://example.com/photo.jpg"
                  />
                  {errors.photoUrl && (
                    <div className="label">
                      <span className="label-text-alt text-error">{errors.photoUrl}</span>
                    </div>
                  )}
                  {formData.photoUrl && !errors.photoUrl && (
                    <div className="mt-2">
                      <img
                        src={formData.photoUrl}
                        alt="Profile preview"
                        className="w-24 h-24 object-cover rounded-xl border border-base-300"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Gender and Age Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Gender */}
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
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.gender && (
                      <div className="label">
                        <span className="label-text-alt text-error">{errors.gender}</span>
                      </div>
                    )}
                  </div>

                  {/* Age */}
                  <div className="form-control">
                    <label htmlFor="age" className="label py-0">
                      <span className="label-text font-semibold">Age</span>
                      <span className="label-text-alt text-error">* Min 18</span>
                    </label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      className={`input input-bordered w-full rounded-xl ${errors.age ? 'input-error' : ''}`}
                      value={formData.age}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="Enter your age"
                      min="18"
                    />
                    {errors.age && (
                      <div className="label">
                        <span className="label-text-alt text-error">{errors.age}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* About */}
                <div className="form-control">
                  <label htmlFor="about" className="label py-0">
                    <span className="label-text font-semibold">About</span>
                  </label>
                  <textarea
                    id="about"
                    name="about"
                    className="textarea textarea-bordered h-32 rounded-xl"
                    value={formData.about}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself..."
                  />
                </div>

                {/* Skills */}
                <div className="form-control">
                  <label htmlFor="skills" className="label py-0">
                    <span className="label-text font-semibold">Skills</span>
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      id="skills"
                      className="input input-bordered flex-1 rounded-xl"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSkill();
                        }
                      }}
                      placeholder="Add skill, press Enter"
                    />
                    <button type="button" className="btn btn-primary rounded-xl" onClick={handleAddSkill}>
                      Add
                    </button>
                  </div>
                  {formData.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.skills.map((skill) => (
                        <span key={skill} className="badge badge-primary badge-lg gap-2">
                          {skill}
                          <button
                            type="button"
                            className="btn btn-ghost btn-xs btn-circle"
                            onClick={() => handleRemoveSkill(skill)}
                            aria-label={`Remove ${skill}`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <title>Remove</title>
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="form-control mt-8">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-full rounded-xl shadow-lg shadow-primary/20 disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="loading loading-spinner loading-sm" />
                        Updating…
                      </>
                    ) : (
                      'Update Profile'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
