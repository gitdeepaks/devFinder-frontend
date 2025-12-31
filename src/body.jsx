import { Outlet } from 'react-router-dom';
import Footer from './footer';
import Navbar from './navbar';

const Body = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Body;
