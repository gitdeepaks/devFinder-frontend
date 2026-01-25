import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Body from './components/body';
import Connections from './components/connections';
import { Feed } from './components/feed';
import Login from './components/login';
import Profile from './components/profile';
import { Requests } from './components/requests';
import { Signup } from './components/signup';

function App() {
  return (
    <>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Body />}>
            <Route path="/" element={<Feed />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/connections" element={<Connections />} />
            <Route path="/requests" element={<Requests />} />
          </Route>
        </Routes>
      </BrowserRouter>
      {/* <Navbar /> */}
    </>
  );
}

export default App;
