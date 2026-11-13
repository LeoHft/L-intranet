import { useAuthAttributes } from "@/context/AuthAttributsContext";
import "@/App.css";
import Welcome from "@/Pages/Welcome";
import Login from "@/Pages/Auth/Login";
import Dashboard from "@/Pages/Dashboard";

import { lazy, Suspense } from "react";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import useMediaQuery, { DESKTOP_QUERY } from "@/hooks/useMediaQuery";

// Pages moins fréquentes, chargées à la demande : l'administration embarque notamment les graphiques.
const AdminDashboard = lazy(() => import("@/Pages/AdminDashboard"));
const Edit = lazy(() => import("@/Pages/Profile/Edit"));
const FirstLogin = lazy(() => import("@/Pages/Auth/FirstLogin"));
const ForgotPassword = lazy(() => import("@/Pages/Auth/ForgotPassword"));

function AppRoutes() {
  const { userAttributes: user } = useAuthAttributes();
  const isAuth = !!user.connected;

  // Le serveur refuse toute autre action tant que le mot de passe provisoire n'est pas changé.
  if (isAuth && user.must_change_password) {
    return (
      <Suspense fallback={null}>
        <FirstLogin />
      </Suspense>
    );
  }

  const authenticated = (page) => (isAuth ? page : <Login />);

  return (
    <Suspense fallback={null}>
    <Routes>
      <Route path="/" element={authenticated(<Welcome />)} />
      <Route path="/login" element={isAuth ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/dashboard" element={authenticated(<Dashboard />)} />
      <Route
        path="/adminDashboard"
        element={authenticated(user.is_admin ? <AdminDashboard /> : <Navigate to="/dashboard" replace />)}
      />
      <Route path="/profile/edit" element={authenticated(<Edit />)} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </Suspense>
  );
}

export default function App() {
  // Sur mobile, en haut, les notifications masqueraient le bouton du menu.
  const isDesktop = useMediaQuery(DESKTOP_QUERY);

  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster position={isDesktop ? "top-center" : "bottom-center"} />
    </BrowserRouter>
  );
}
