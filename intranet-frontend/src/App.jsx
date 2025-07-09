import BreezyLoader from '@/Components/Utils/BreezyLoader';

// import useAuthAttributes from './context/AuthAttributsContext';
// import Dashboard from './Pages/Dashboard';
import Welcome from '@/Pages/Welcome'
import '@/App.css'

import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';


function App() {
  const [loading, setLoading] = useState(false);
  // const authContext = useAuthAttributes();
  // const user = authContext?.userAttributes;
  // const isAuth = !!user;


  return loading ? ( <BreezyLoader /> ) : (
    <>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={isAuth ? <Dashboard /> : <Welcome />} /> */}
          <Route path="/" element={<Welcome />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
