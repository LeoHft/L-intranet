import BreezyLoader from '@/Components/Utils/BreezyLoader';

import { useAuthAttributes } from '@/context/AuthAttributsContext';
import '@/App.css';
import Welcome from '@/Pages/Welcome';
import Login from '@/Pages/Auth/Login';
import Dashboard from '@/Pages/Dashboard';
import AdminDashboard from '@/Pages/AdminDashboard';
import Edit from '@/Pages/Profile/Edit';

import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';


function App() {
  const [loading, setLoading] = useState(false);
  const authContext = useAuthAttributes();
  const user = authContext?.userAttributes;
  const isAuth = !!user.connected;
  const isAdmin = !!user.is_admin;

  return loading ? ( <BreezyLoader /> ) : (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={isAuth ? <Welcome /> : <Login />} />
          <Route path="/login" element={isAuth ? <Dashboard /> : <Login />} />
          <Route path="/dashboard" element={isAuth ? <Dashboard /> : <Login /> } />
          <Route path="/adminDashboard" element={isAdmin && isAuth ? <AdminDashboard /> : isAuth ? <Dashboard /> : <Login /> } />
          <Route path="/profile/edit" element={isAuth ? <Edit /> : <Login />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
