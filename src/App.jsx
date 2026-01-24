import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Body from './components/body';
import { Feed } from './components/feed';
import Login from './components/login';
import Profile from './components/profile';

function App() {
  return (
    <>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Body />}>
            <Route path="/" element={<Feed />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
      {/* <Navbar /> */}
    </>
  );
}

export default App;
