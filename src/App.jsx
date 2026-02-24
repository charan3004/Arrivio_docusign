import React from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";

import Navbar from "./components/layout/Navbar";
import AppNavbar from "./components/layout/AppNavbar";
import SimpleNavbar from "./components/layout/SimpleNavbar";
import Footer from "./components/layout/Footer";
import MobileNavbar from "./components/layout/MobileNavbar";
import ScrollToTop from "./components/common/ScrollToTop";

import AppRoutes from "./routes/AppRoutes";
import useSession from "./supabase/hooks/useSession";
import AuthModal from "./components/auth/AuthModal";

// =========================
// LAYOUT
// =========================
const Layout = () => {
  const location = useLocation();
  const path = location.pathname;

  const isProcessPage = [
    "/signin",
    "/application/details",
    "/apply",
    "/payment",
    "/demo-contract",
    "/booking/review",
    "/paid"
  ].includes(path);

  const isSuccessPage = path === "/booking-success";
  const isAdminRoute = path.startsWith("/admin");

  let CurrentNavbar;

  if (isAdminRoute) {
    CurrentNavbar = () => null;
  } else if (path.startsWith("/profile")) {
    CurrentNavbar = AppNavbar;
  } else if (isSuccessPage) {
    CurrentNavbar = SimpleNavbar;
  } else if (isProcessPage) {
    CurrentNavbar = () => null;
  } else if (path === "/") {
    CurrentNavbar = Navbar;
  } else if (path.startsWith("/property")) {
    CurrentNavbar = AppNavbar;
  } else if (path.startsWith("/cities") || path.startsWith("/search") || path.startsWith("/wishlist")) {
    CurrentNavbar = AppNavbar;
  } else {
    CurrentNavbar = SimpleNavbar;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#EAE8E4]">
      <CurrentNavbar property={path.startsWith("/property") ? { id: path.split("/").pop() } : null} />

      <main className="flex-grow">
        <AppRoutes />
      </main>

      {!isProcessPage && !isSuccessPage && !isAdminRoute && <Footer />}
      {!isProcessPage && !isSuccessPage && !isAdminRoute && <MobileNavbar />}
    </div>
  );
};

// =========================
// APP ROOT
// =========================
function App() {
  useSession();
  return (
    <AuthProvider>
      <Router>
        <WishlistProvider>
          <AuthModal />
          <ScrollToTop />
          <Layout />
        </WishlistProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;

