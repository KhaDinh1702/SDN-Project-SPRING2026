import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import HomePage from "./pages/User/Homepage/Homepage";
import ProductDetail from "./pages/User/ProductDetail/ProductDetail";
import Login from "./pages/User/Auth/Login";
import Register from "./pages/User/Register/Register";
// import ForgotPassword from "./pages/User/Auth/ForgotPassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<HomePage />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}

      </Routes>
    </BrowserRouter>
  );
}

export default App;