// src/App.jsx
import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";

// Layouts
import AuthLayout from "./layouts/AuthLayout";
import UserLayout from "./layouts/UserLayout";
import StartupLayout from "./layouts/StartupLayout";
import AdminLayout from "./layouts/AdminLayout";
import ChatLayout from "./layouts/ChatLayout";   // ✅ FIXED: correct path

// Auth Pages
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import VerifyOtp from "./pages/auth/VerifyOtp";

// User Pages (Green)
import UserHome from "./pages/user/UserHome";
import UserProfile from "./pages/user/UserProfile";
import UserOrders from "./pages/user/UserOrders";
import Products from "./pages/user/Products";
import ProductDetails from "./pages/user/ProductDetails";
import Cart from "./pages/user/Cart";
import Checkout from "./pages/user/Checkout";

// Startup Pages (Blue)
import StartupDashboard from "./pages/startup/StartupDashboard";
import StartupProducts from "./pages/startup/StartupProducts";
import StartupAddProduct from "./pages/startup/StartupAddProduct";
import StartupInventory from "./pages/startup/StartupInventory";
import StartupOrders from "./pages/startup/StartupOrders";

// Admin Pages (Pink)
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminInventory from "./pages/admin/AdminInventory";

// Chat Pages
import ChatList from "./pages/chat/ChatList";
import ChatRoom from "./pages/chat/ChatRoom";


// ============================================================
// PROTECTED ROUTE COMPONENT
// ============================================================
function RequireAuth({ children, roles }) {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-gray-300">
        Loading…
      </div>
    );
  }

  if (!user) return <Navigate to="/auth/login" replace />;

  if (roles && !roles.includes(user.role))
    return <div className="p-6 text-sm">Access Denied.</div>;

  return children;
}


// ============================================================
// HOME REDIRECT BY ROLE
// ============================================================
function RoleAwareHome() {
  const { user } = useAuthStore();

  if (!user) return <Navigate to="/auth/login" replace />;

  if (user.role === "admin") return <Navigate to="/admin" replace />;
  if (user.role === "startup") return <Navigate to="/startup" replace />;

  return <Navigate to="/user" replace />;
}


// ============================================================
// MAIN APP ROUTES
// ============================================================
export default function App() {
  const initAuth = useAuthStore((s) => s.initAuth);
  const userRole = useAuthStore((s) => s.user?.role);   // ✅ FIX: avoids undefined

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <Routes>
      {/* ROOT REDIRECT */}
      <Route path="/" element={<RoleAwareHome />} />

      {/* AUTH */}
      <Route element={<AuthLayout />}>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/auth/verify-otp" element={<VerifyOtp />} />
      </Route>

      {/* USER */}
      <Route
        element={
          <RequireAuth roles={["user", "startup", "admin"]}>
            <UserLayout />
          </RequireAuth>
        }
      >
        <Route path="/user" element={<UserHome />} />
        <Route path="/user/profile" element={<UserProfile />} />
        <Route path="/user/products" element={<Products />} />
        <Route path="/user/product/:id" element={<ProductDetails />} />
        <Route path="/user/cart" element={<Cart />} />
        <Route path="/user/checkout" element={<Checkout />} />
        <Route path="/user/orders" element={<UserOrders />} />
      </Route>

      {/* STARTUP */}
      <Route
        element={
          <RequireAuth roles={["startup", "admin"]}>
            <StartupLayout />
          </RequireAuth>
        }
      >
        <Route path="/startup" element={<StartupDashboard />} />
        <Route path="/startup/products" element={<StartupProducts />} />
        <Route path="/startup/products/add" element={<StartupAddProduct />} />
        <Route path="/startup/inventory" element={<StartupInventory />} />
        <Route path="/startup/orders" element={<StartupOrders />} />
      </Route>

      {/* ADMIN */}
      <Route
        element={
          <RequireAuth roles={["admin"]}>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/inventory" element={<AdminInventory />} />
      </Route>

      {/* UNIVERSAL CHAT */}
      <Route
        element={
          <RequireAuth roles={["user", "startup", "admin"]}>
            <ChatLayout theme={userRole} />
          </RequireAuth>
        }
      >
        <Route path="/chat" element={<ChatList theme={userRole} />} />
        <Route path="/chat/:chatId" element={<ChatRoom theme={userRole} />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<div className="p-6 text-sm">404 – Page does not exist.</div>} />
    </Routes>
  );
}
