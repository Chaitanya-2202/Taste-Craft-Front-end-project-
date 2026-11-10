import React from "react";
import { useAuth } from "./context/AuthContext.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

export default function App() {
  const { user } = useAuth();
  const [showAdmin, setShowAdmin] = React.useState(false);
  if (!user) return <AuthPage />;
  if (user.role === "admin" && showAdmin) return <AdminDashboard onBack={() => setShowAdmin(false)} />;
  return <HomePage onAdmin={() => setShowAdmin(true)} />;
}