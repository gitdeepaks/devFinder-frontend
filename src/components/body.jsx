import axios from 'axios';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BASE_URL, SITE_URL } from '../utils/contstants';
import { DEFAULT_META, ROUTE_META } from '../utils/route-meta';
import { addUser } from '../utils/user-slice';
import BottomNav from './bottom-nav';
import Navbar from './navbar';

const AUTH_ROUTES = ['/login', '/signup'];

const getBaseUrl = () => (typeof window !== 'undefined' && !SITE_URL ? window.location.origin : SITE_URL || '');

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userData = useSelector((store) => store.user);

  const isAuthPage = AUTH_ROUTES.some((r) => location.pathname === r);
  const showAppShell = !isAuthPage;
  const showBottomNav = showAppShell && userData;

  const pathname = location.pathname;
  const meta = ROUTE_META[pathname] || DEFAULT_META;
  const canonicalUrl = getBaseUrl() ? `${getBaseUrl().replace(/\/$/, '')}${pathname === '/' ? '' : pathname}` : null;

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
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
        {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
      </Helmet>
      <a
        href="#main-content"
        className="absolute left-[-9999px] w-px h-px overflow-hidden focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:w-auto focus:h-auto focus:overflow-visible focus:rounded focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-content focus:outline-none focus:ring-2"
      >
        Skip to main content
      </a>
      {showAppShell && <Navbar />}
      <main id="main-content" className={`flex-1 ${showBottomNav ? 'pb-20' : ''}`}>
        <Outlet />
      </main>
      {showBottomNav && <BottomNav />}
    </div>
  );
};

export default Body;
