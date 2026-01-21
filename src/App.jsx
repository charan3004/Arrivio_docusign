import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// --- COMPONENTS ---
import Navbar from './components/layout/Navbar';        // The Landing Page Navbar
import AppNavbar from './components/layout/AppNavbar';  // The New Utility Navbar
import Footer from './components/layout/Footer';
import ScrollToTop from './components/common/ScrollToTop';

// --- PAGES ---
import CityGridPage from './components/search/CityGridPage';
import Landing from './pages/Landing';
import Search from './pages/Search';
import PropertyDetails from './pages/PropertyDetails';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Employers from './pages/Employers';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Imprint from './pages/Imprint';
import Contact from './pages/Contact';
import Careers from './pages/Careers';

// --- INTERNAL COMPONENT TO HANDLE LAYOUT LOGIC ---
const Layout = () => {
  const location = useLocation();
  
  // Logic: Is this the landing page?
  const isLandingPage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col">
      {/* CONDITIONAL NAVBAR */}
      {isLandingPage ? <Navbar /> : <AppNavbar />}
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/search" element={<Search />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/business" element={<Employers />} />
          <Route path="/employers" element={<Employers />} />
          <Route path="/cities" element={<CityGridPage />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/imprint" element={<Imprint />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/careers" element={<Careers />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      {/* We moved the logic inside Layout so useLocation works */}
      <Layout />
    </Router>
  );
}

export default App;