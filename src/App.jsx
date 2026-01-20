import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/common/ScrollToTop';
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

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <Navbar />
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
    </Router>
  );
}

export default App;
