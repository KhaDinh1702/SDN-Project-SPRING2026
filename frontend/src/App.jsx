import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import HomePage from "./pages/User/HomePage/HomePage";
import ProductDetail from "./pages/User/ProductDetail/ProductDetail";
import Login from "./pages/User/Auth/Login";
import Register from "./pages/User/Register/Register";

// Admin imports


import AdminLayout from "./pages/Admin/AdminLayout/AdminLayout";
import Dashboard from "./pages/Admin/Dashboard/Dashboard";
import Products from "./pages/Admin/Products/Products";
import Orders from "./pages/Admin/Orders/Orders";
import Users from "./pages/Admin/Users/Users";

import Ingredients from "./pages/User/Ingrediant/Ingredients";
import Category from "./pages/User/Category/Category";
import AdminCategory from "./pages/Admin/AdminCategory/AdminCategory";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* User Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/category" element={<Category />} />
<Route path="/category/:id" element={<Category />} />
        <Route path="/ingredients" element={<Ingredients />} />


        {/* Admin Routes with Layout */}
        <Route path="/admin" element={<AdminLayout/>}>

          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<Users />} />
           <Route path="categoryadmin" element={<AdminCategory />} />
        

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;