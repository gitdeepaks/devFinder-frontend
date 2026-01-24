import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/contstants';
import { addUser } from '../utils/user-slice';
import Footer from './footer';
import Navbar from './navbar';

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user);

  const fetchUser = async () => {
    if (userData) return;
    try {
      const user = await axios.get(`${BASE_URL}/profile/view`, { withCredentials: true });
      dispatch(addUser(user.data));
    } catch (error) {
      error.response.status === 401 ? navigate('/login') : console.log(error);
    }
  };
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    fetchUser();
  }, [userData]);

  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Body;
