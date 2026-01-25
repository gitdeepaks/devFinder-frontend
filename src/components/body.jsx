import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/contstants';
import { addUser } from '../utils/user-slice';
import BottomNav from './bottom-nav';
import Navbar from './navbar';

const AUTH_ROUTES = ['/login', '/signup'];

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userData = useSelector((store) => store.user);

  const isAuthPage = AUTH_ROUTES.some((r) => location.pathname === r);
  const showAppShell = !isAuthPage;
  const showBottomNav = showAppShell && userData;

  const fetchUser = async () => {
    if (userData) return;
    try {
      const user = await axios.get(`${BASE_URL}/profile/view`, { withCredentials: true });
      dispatch(addUser(user.data));
    } catch (error) {
      error.response?.status === 401 ? navigate('/login') : console.log(error);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: fetch on mount
  useEffect(() => {
    fetchUser();
  }, [userData]);

  return (
    <div className="min-h-screen flex flex-col">
      {showAppShell && <Navbar />}
      <main className={`flex-1 ${showBottomNav ? 'pb-20' : ''}`}>
        <Outlet />
      </main>
      {showBottomNav && <BottomNav />}
    </div>
  );
};

export default Body;
