import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore.js";

export default function RoleRoute({ children, role }) {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to="/" replace />;
  return children;
}
