import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  // ❌ Not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  // ❌ Not admin
  if (user.role !== "admin") {
    return <Navigate to="/" />;
  }

  // ✅ Allowed
  return children;
}