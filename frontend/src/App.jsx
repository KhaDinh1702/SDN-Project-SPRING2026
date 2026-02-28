import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css';

// User pages (lazy loaded)
const HomePage = lazy(() => import('./pages/User/HomePage/HomePage'));
const ProductDetail = lazy(
  () => import('./pages/User/ProductDetail/ProductDetail'),
);
const Login = lazy(() => import('./pages/User/Auth/Login'));
const Register = lazy(() => import('./pages/User/Register/Register'));
const Category = lazy(() => import('./pages/User/Category/Category'));
const Ingredients = lazy(() => import('./pages/User/Ingrediant/Ingredients'));
const Profile = lazy(() => import('./pages/User/Profile/Profile'));
const Cart = lazy(() => import('./pages/User/Cart/Cart'));
const ForgotPassword = lazy(() => import('./components/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/User/Auth/ResetPassword'));

// Admin pages (lazy loaded)
const AdminLayout = lazy(() => import('./pages/Admin/AdminLayout/AdminLayout'));
const Dashboard = lazy(() => import('./pages/Admin/Dashboard/Dashboard'));
const Products = lazy(() => import('./pages/Admin/Products/Products'));
const Orders = lazy(() => import('./pages/Admin/Orders/Orders'));
const Users = lazy(() => import('./pages/Admin/Users/Users'));
const AdminCategory = lazy(
  () => import('./pages/Admin/AdminCategory/AdminCategory'),
);

function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
            }}
          >
            Loading...
          </div>
        }
      >
        <Routes>
          {/* User Routes */}
          <Route
            path='/'
            element={<HomePage />}
          />
          <Route
            path='/products/:id'
            element={<ProductDetail />}
          />
          <Route
            path='/login'
            element={<Login />}
          />
          <Route
            path='/forgot-password'
            element={<ForgotPassword />}
          />
          <Route
            path='/reset-password'
            element={<ResetPassword />}
          />
          <Route
            path='/register'
            element={<Register />}
          />
          <Route
            path='/category'
            element={<Category />}
          />
          <Route
            path='/category/:id'
            element={<Category />}
          />
          <Route
            path='/ingredients'
            element={<Ingredients />}
          />
          <Route
            path='/profile'
            element={<Profile />}
          />
          <Route
            path='/cart'
            element={<Cart />}
          />

          {/* Admin Routes with Layout */}
          <Route
            path='/admin'
            element={<AdminLayout />}
          >
            <Route
              index
              element={<Dashboard />}
            />
            <Route
              path='dashboard'
              element={<Dashboard />}
            />
            <Route
              path='products'
              element={<Products />}
            />
            <Route
              path='orders'
              element={<Orders />}
            />
            <Route
              path='users'
              element={<Users />}
            />
            <Route
              path='categoryadmin'
              element={<AdminCategory />}
            />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
