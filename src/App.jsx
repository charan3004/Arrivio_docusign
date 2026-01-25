import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// --- COMPONENTS ---
import Navbar from './components/layout/Navbar';        
import AppNavbar from './components/layout/AppNavbar';  
import SimpleNavbar from './components/layout/SimpleNavbar'; 
import PropertyNavbar from './components/layout/PropertyNavbar'; 
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
import BookingSuccess from './pages/BookingSuccess';
import ApplicationWizard from './pages/ApplicationWizard';
import SignIn from './pages/SignIn';
import PaymentPage from './pages/PaymentPage'; 

const Layout = () => {
  const location = useLocation();
  const path = location.pathname;

  // 1. IDENTIFY THE TUNNEL (No distractions)
  const isProcessPage = ['/signin', '/apply', '/payment'].includes(path);
  
  // 2. IDENTIFY THE SUCCESS PAGE (Needs a way home)
  const isSuccessPage = path === '/booking-success';

  let CurrentNavbar;

  if (isSuccessPage) {
    // SHOW Logo Navbar only on Success Page
    CurrentNavbar = SimpleNavbar;
  } else if (isProcessPage) {
    // NO Navbar for the active steps (SignIn, Apply, Payment)
    CurrentNavbar = () => null; 
  } else if (path === '/') {
    CurrentNavbar = Navbar;
  } else if (path.startsWith('/property')) {
    CurrentNavbar = PropertyNavbar;
  } else if (path.startsWith('/cities') || path.startsWith('/search')) {
    CurrentNavbar = AppNavbar;
  } else {
    CurrentNavbar = SimpleNavbar;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#EAE8E4]">
      <CurrentNavbar />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/search" element={<Search />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/cities" element={<CityGridPage />} />
          
          <Route path="/signin" element={<SignIn />} />
          <Route path="/apply" element={<ApplicationWizard />} />
          <Route path="/payment" element={<PaymentPage />} /> 
          <Route path="/booking-success" element={<BookingSuccess />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/business" element={<Employers />} />
          <Route path="/employers" element={<Employers />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/imprint" element={<Imprint />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/careers" element={<Careers />} />
        </Routes>
      </main>
      
      {/* Hide Footer on all process/success pages */}
      {!isProcessPage && !isSuccessPage && <Footer />}
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