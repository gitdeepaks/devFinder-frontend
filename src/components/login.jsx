import axios from 'axios';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/contstants';
import { addUser } from '../utils/user-slice';

const Login = () => {
  const [email, setEmail] = useState('elon@email.com');
  const [password, setPassword] = useState('Elon@1234567');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const hanldeLogin = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/login`,
        { emailId: email, password: password },
        {
          withCredentials: true,
        }
      );
      console.log('Login successful:', response.data);
      // The response structure is {message: '...', data: {...}}
      // We need to dispatch the nested data object which contains the user info
      dispatch(addUser(response.data.data));
      navigate('/');
    } catch (error) {
      console.log(error);
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
            {/* Email Field */}
            <div className="form-control">
              <label htmlFor="email" className="label">
                <span className="label-text font-semibold">Email Address</span>
              </label>
              <input
                type="email"
                id="email"
                className="input input-bordered input-primary w-full focus:input-primary focus:outline-none transition-all"
                value={email}
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
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
                className="input input-bordered input-primary w-full focus:input-primary focus:outline-none transition-all"
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
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
                onClick={hanldeLogin}
              >
                Sign In
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
