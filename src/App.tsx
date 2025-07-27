import React from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Head from "./Components/Header/Head";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register"

const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const noHeaderRoutes = ["/login", "/register", "/profile"];

  const showHeader = !noHeaderRoutes.includes(location.pathname);

  return (
    <>
      {showHeader && <Head />}
      {children}
    </>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <LayoutWrapper>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* 
          <Route path="/profile" element={<Profile />} />
          <Route path="/register" element={<Register />} /> 
          */}
        </Routes>
      </LayoutWrapper>
    </BrowserRouter>
  );
};

export default App;
