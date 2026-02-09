import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/contstants';
import { removeUser } from '../utils/user-slice';
import ThemeToggle from './theme-toggle';

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const [imageError, setImageError] = useState(false);
  const userData = user?.data || user;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/logout`, {}, { withCredentials: true });
      dispatch(removeUser());
      navigate('/login');
    } catch (error) {
      error.response?.status === 401 ? navigate('/login') : console.log(error);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset when user changes
  useEffect(() => {
    setImageError(false);
  }, [user]);

  return (
    <header className="sticky top-0 z-50 border-b border-base-300/50 bg-base-100/80 backdrop-blur-xl">
      <div className="navbar max-w-7xl mx-auto px-4 sm:px-6">
        <div className="navbar-start">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-logo text-xl sm:text-2xl font-bold tracking-tight">
              <span className="text-primary">Dev</span>
              <span className="text-base-content">Finder</span>
            </span>
          </Link>
        </div>
        <div className="navbar-end flex items-center gap-2">
          <ThemeToggle />
          {userData ? (
            <div className="dropdown dropdown-end">
              <button
                type="button"
                tabIndex={0}
                className="btn btn-ghost gap-2 rounded-full pl-2 pr-3 py-2 hover:bg-base-200/80 transition-all"
              >
                <span className="hidden sm:inline text-sm font-medium text-base-content">{userData.firstName}</span>
                <div className="avatar placeholder">
                  <div className="w-10 h-10 rounded-full bg-primary/20 ring-2 ring-primary/30 flex items-center justify-center overflow-hidden">
                    {userData.photoUrl && !imageError ? (
                      <img
                        src={userData.photoUrl}
                        alt={`${userData.firstName || ''} ${userData.lastName || ''}`}
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                        onLoad={() => setImageError(false)}
                      />
                    ) : (
                      <span className="text-primary font-bold">
                        {userData.firstName?.[0]?.toUpperCase() || 'U'}
                        {userData.lastName?.[0]?.toUpperCase() || ''}
                      </span>
                    )}
                  </div>
                </div>
              </button>
              <ul className="menu dropdown-content bg-base-200/95 backdrop-blur-xl rounded-2xl shadow-xl border border-base-300/50 mt-3 w-52 p-2 z-50">
                <li>
                  <Link to="/profile" className="rounded-xl">
                    Profile
                  </Link>
                </li>
                <li>
                  <Link to="/connections" className="rounded-xl">
                    Connections
                  </Link>
                </li>
                <li>
                  <Link to="/requests" className="rounded-xl">
                    Requests
                  </Link>
                </li>
                <li>
                  <Link to="/premium" className="rounded-xl">
                    Premium
                  </Link>
                </li>
                <li>
                  <button type="button" className="rounded-xl text-error hover:bg-error/10" onClick={handleLogout}>
                    Log out
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="btn btn-ghost btn-sm rounded-xl">
                Log in
              </Link>
              <Link to="/signup" className="btn btn-primary btn-sm rounded-xl">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
