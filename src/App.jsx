import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// --- COMPONENTS ---
import Navbar from './components/layout/Navbar';        
import AppNavbar from './components/layout/AppNavbar';  
import SimpleNavbar from './components/layout/SimpleNavbar'; 
import Footer from './components/layout/Footer';
import ScrollToTop from './components/common/ScrollToTop';

// --- PAGES ---
import CityGridPage from './components/search/CityGridPage';
import Landing from './pages/Landing';
import Business from './pages/Business';


const Layout = () => {
  const location = useLocation();
  const path = location.pathname;


  let CurrentNavbar;
  const isBusinessRoute = path.startsWith('/business');

  if (path === '/') {
    CurrentNavbar = Navbar;
  } else if (path.startsWith('/cities')) {
    CurrentNavbar = AppNavbar;
  } else {
    CurrentNavbar = SimpleNavbar;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#EAE8E4]">
      <CurrentNavbar />
      
      <main className="flex-grow">
        <Routes>
          {/* MAIN PAGES */}
          <Route path="/" element={<Landing />} />
          <Route path="/cities" element={<CityGridPage />} />
          <Route path="/business" element={<Business />} />
        </Routes>
      </main>
      
      {!isBusinessRoute && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Layout />
    </Router>
  );
}

export default App;