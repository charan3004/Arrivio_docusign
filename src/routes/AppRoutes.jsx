import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import AdminProtectedRoute from "../pages/admin/AdminProtectedRoute"; // Correct path for AdminProtectedRoute

// =========================
// PAGES (LAZY LOADED)
// =========================
import Landing from "../pages/Landing"; // Keep Landing eager for LCP

// Auth
const SignIn = React.lazy(() => import("../pages/auth/SignIn"));
const AuthCallback = React.lazy(() => import("../pages/auth/AuthCallback")); // Renamed & Moved

// Business
const Business = React.lazy(() => import("../pages/business/Business"));
const Employers = React.lazy(() => import("../pages/business/Employers"));
const Careers = React.lazy(() => import("../pages/business/Careers"));
const Contact = React.lazy(() => import("../pages/business/Contact"));

// Legal
const Privacy = React.lazy(() => import("../pages/legal/Privacy"));
const Terms = React.lazy(() => import("../pages/legal/Terms"));
const Imprint = React.lazy(() => import("../pages/legal/Imprint"));

// Booking
const BookingReview = React.lazy(() => import("../pages/booking/BookingReview"));
const BookingSuccess = React.lazy(() => import("../pages/booking/BookingSuccess"));
const PaymentPage = React.lazy(() => import("../pages/booking/PaymentPage"));
const Paid = React.lazy(() => import("../pages/booking/Paid"));

// Main App
const CityGridPage = React.lazy(() => import("../pages/CityGridPage"));
const Search = React.lazy(() => import("../pages/Search"));
const PropertyDetails = React.lazy(() => import("../pages/PropertyDetails"));
const Profile = React.lazy(() => import("../pages/Profile"));
const ProfileSidebarLayout = React.lazy(() => import("../components/profile/ProfileSidebarLayout"));
const EditProfile = React.lazy(() => import("../pages/profile/EditProfile"));
const MyBookings = React.lazy(() => import("../pages/profile/MyBookings"));
const MyPayments = React.lazy(() => import("../pages/profile/MyPayments"));
const UserDetails = React.lazy(() => import("../pages/UserDetails"));
const Wishlist = React.lazy(() => import("../pages/Wishlist"));
const NotFound = React.lazy(() => import("../pages/NotFound"));

// Admin
const AdminLogin = React.lazy(() => import("../pages/admin/AdminLogin"));
const AdminDashboard = React.lazy(() => import("../pages/admin/AdminDashboard"));
const AdminProperties = React.lazy(() => import("../pages/admin/AdminProperties"));
const AddProperty = React.lazy(() => import("../pages/admin/AddProperty"));
const Users = React.lazy(() => import("../pages/admin/Users"));
const Analytics = React.lazy(() => import("../pages/admin/Analytics"));
const Payments = React.lazy(() => import("../pages/admin/Payments"));
const Tenants = React.lazy(() => import("../pages/admin/Tenants"));
const Verifications = React.lazy(() => import("../pages/admin/Verifications"));
const Settings = React.lazy(() => import("../pages/admin/Settings"));

import PageLoader from "../components/common/PageLoader";

const AppRoutes = () => {
    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                {/* ================= PUBLIC ROUTES ================= */}
                <Route path="/" element={<Landing />} />
                <Route path="/search" element={<Search />} />
                <Route path="/property/:id" element={<PropertyDetails />} />
                <Route path="/cities" element={<CityGridPage />} />

                {/* AUTH */}
                {/* AUTH */}
                <Route path="/login" element={<SignIn />} />
                <Route path="/signup" element={<SignIn />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/auth/callback" element={<AuthCallback />} />

                {/* BUSINESS */}
                <Route path="/business" element={<Business />} />
                <Route path="/employers" element={<Employers />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/contact" element={<Contact />} />

                {/* LEGAL */}
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/imprint" element={<Imprint />} />

                {/* PROTECTED USER ROUTES */}
                <Route path="/profile" element={<ProtectedRoute><ProfileSidebarLayout /></ProtectedRoute>}>
                    <Route index element={<Navigate to="edit" replace />} />
                    <Route path="edit" element={<EditProfile />} />
                    <Route path="wishlist" element={<Wishlist />} />
                    <Route path="bookings" element={<MyBookings />} />
                    <Route path="payments" element={<MyPayments />} />
                </Route>

                {/* Redirect legacy wishlist route to new structure if accessed directly, 
                    or keep it if we want it accessible outside profile too. 
                    User requested sidebar layout, so let's redirect for consistency. */}
                <Route path="/wishlist" element={<Navigate to="/profile/wishlist" replace />} />

                <Route path="/application/details" element={<ProtectedRoute><UserDetails /></ProtectedRoute>} />

                {/* BOOKING PROCESS */}
                <Route path="/booking/review" element={<ProtectedRoute><BookingReview /></ProtectedRoute>} />
                <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
                <Route path="/booking-success" element={<ProtectedRoute><BookingSuccess /></ProtectedRoute>} />
                <Route path="/paid" element={<ProtectedRoute><Paid /></ProtectedRoute>} />

                {/* ================= ADMIN ROUTES ================= */}
                <Route path="/admin/login" element={<AdminLogin />} />

                <Route
                    path="/admin/dashboard"
                    element={
                        <AdminProtectedRoute>
                            <AdminDashboard />
                        </AdminProtectedRoute>
                    }
                />

                <Route
                    path="/admin/properties"
                    element={
                        <AdminProtectedRoute>
                            <AdminProperties />
                        </AdminProtectedRoute>
                    }
                />

                <Route
                    path="/admin/properties/new"
                    element={
                        <AdminProtectedRoute>
                            <AddProperty />
                        </AdminProtectedRoute>
                    }
                />

                <Route
                    path="/admin/tenants"
                    element={
                        <AdminProtectedRoute>
                            <Tenants />
                        </AdminProtectedRoute>
                    }
                />

                <Route
                    path="/admin/verifications"
                    element={
                        <AdminProtectedRoute>
                            <Verifications />
                        </AdminProtectedRoute>
                    }
                />

                <Route
                    path="/admin/users"
                    element={
                        <AdminProtectedRoute>
                            <Users />
                        </AdminProtectedRoute>
                    }
                />

                <Route
                    path="/admin/payments"
                    element={
                        <AdminProtectedRoute>
                            <Payments />
                        </AdminProtectedRoute>
                    }
                />

                <Route
                    path="/admin/analytics"
                    element={
                        <AdminProtectedRoute>
                            <Analytics />
                        </AdminProtectedRoute>
                    }
                />

                <Route
                    path="/admin/settings"
                    element={
                        <AdminProtectedRoute>
                            <Settings />
                        </AdminProtectedRoute>
                    }
                />

                {/* ================= 404 CATCH-ALL ================= */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;
