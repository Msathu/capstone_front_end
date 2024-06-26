import React from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import './styles/main.css';
import NavBar from './components/NavBar'; 
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/Dashboard";
import Home from "./pages/Home";
import PrivateRoute from './utils/PrivateRoute';
import { isAuthenticated } from './services/Auth';

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Main/>
      </BrowserRouter>
    </div>
  );
}

function Main() {
  const location = useLocation();
  const showNavbar = !['/dashboard'].includes(location.pathname);

  return (
    <>
      {showNavbar && <NavBar />}
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
          </Route>
      </Routes>
    </>
  );
}


export default App;
