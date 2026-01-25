import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/contstants';
import { removeUser } from '../utils/user-slice';

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const [imageError, setImageError] = useState(false);

  // Handle nested data structure if needed
  const userData = user?.data || user;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/logout`, {}, { withCredentials: true });
      dispatch(removeUser());
      navigate('/login');
    } catch (error) {
      error.response.status === 401 ? navigate('/login') : console.log(error);
    }
  };

  // Reset image error when user changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setImageError(false);
  }, [user]);

  return (
    <div className="navbar bg-base-300 shadow-sm">
      <div className="flex-1">
        <Link to="/">
          <button type="button" className="btn btn-ghost text-xl">
            🔎 DevFinder🔎
          </button>
        </Link>
      </div>
      <div className="flex gap-2 items-center">
        {userData ? (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost flex items-center gap-3 px-3 py-2 hover:bg-base-200 transition-colors"
            >
              {/* User Name */}
              <div className="flex flex-col items-end">
                <span className="text-sm font-semibold leading-tight text-base-content">{userData.firstName}</span>
              </div>

              {/* User Avatar */}
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary bg-base-300 flex items-center justify-center relative shadow-md">
                {userData.photoUrl && !imageError ? (
                  <img
                    alt={`${userData.firstName || ''} ${userData.lastName || ''}`}
                    src={userData.photoUrl}
                    className="w-full h-full object-cover"
                    onError={() => {
                      setImageError(true);
                    }}
                    onLoad={() => {
                      setImageError(false);
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary text-primary-content font-bold text-base">
                    {userData.firstName?.[0]?.toUpperCase() || 'U'}
                    {userData.lastName?.[0]?.toUpperCase() || ''}
                  </div>
                )}
              </div>
            </div>

            {/* Dropdown Menu */}
            <ul className="menu menu-sm dropdown-content bg-base-200 rounded-box z-1 mt-3 w-52 p-2 shadow-lg">
              <li>
                <Link to="/profile">
                  <button type="button" className="justify-between w-full text-left">
                    Profile
                    <span className="badge">New</span>
                  </button>
                </Link>
              </li>
              <li>
                <Link to="/connections">
                  <button type="button" className="w-full text-left">
                    Connections
                  </button>
                </Link>
              </li>

              <li>
                <button type="button" className="w-full text-left" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="text-sm text-base-content/70">Not logged in</div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
