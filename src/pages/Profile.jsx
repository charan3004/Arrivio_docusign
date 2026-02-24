import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { User, Heart, Calendar, CreditCard } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { supabase } from "../supabase/client";
import SignIn from "./auth/SignIn";

// COMPONENTS
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileMenuCard from "../components/profile/ProfileMenuCard";

const Profile = () => {
  const { user, signOut } = useAuth();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (!user) return;
    const fetchHeaderData = async () => {
      const { data } = await supabase
        .from("users")
        .select("phone, username")
        .eq("id", user.id)
        .single();
      if (data) {
        setUsername(data.username);
        setPhone(data.phone);
      }
    };
    fetchHeaderData();
  }, [user]);

  if (!user) return <SignIn />;

  return (
    <div className="min-h-screen bg-[#EAE8E4] font-sans text-[#2C3E30]">
      <Toaster position="top-center" reverseOrder={false} />

      <motion.div
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-6xl mx-auto px-6 pt-28 pb-20 md:px-10"
      >
        <ProfileHeader
          user={user}
          profileData={{ username, phone }}
        />

        {/* 2. NAVIGATION HUB GRID CONTAINER */}
        {/* Changed background to light grey #EAE8E4/30 to contrast with white cards */}
        <div className="bg-[#F5F4F0] rounded-[32px] p-6 md:p-8 max-w-4xl mx-auto border border-[#2C3E30]/5">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <ProfileMenuCard
              icon={User}
              title="Personal Details"
              description="Update your name & details"
              to="/profile/edit"
            />

            <ProfileMenuCard
              icon={Heart}
              title="Shortlist"
              description="View your liked properties"
              to="/wishlist"
              count={wishlist.length}
            />

            <ProfileMenuCard
              icon={Calendar}
              title="My Bookings"
              description="Track your applications"
              to="/profile/bookings"
            />

            <ProfileMenuCard
              icon={CreditCard}
              title="Payment History"
              description="View payment transactions"
              to="/profile/payments"
            />

          </div>

          <div className="mt-8 text-center">
            <button
              onClick={signOut}
              className="text-xs font-bold uppercase tracking-widest text-[#2C3E30]/40 hover:text-red-500 transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
};

export default Profile;


