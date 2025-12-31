import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './navbar';

function App() {
  return (
    <>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<div>Base Page</div>} />
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/test" element={<div>Test Page</div>} />
        </Routes>
      </BrowserRouter>
      {/* <Navbar /> */}
    </>
  );
}

export default App;
