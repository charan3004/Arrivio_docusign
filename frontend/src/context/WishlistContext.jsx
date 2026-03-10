import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabase/client";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";
import { normalizeProperty } from "../supabase/services/properties.service";

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
    const { user, openAuthModal } = useAuth();
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    // ========================
    // FETCH WISHLIST
    // ========================
    useEffect(() => {
        let mounted = true;

        const fetchWishlist = async () => {
            if (!user) {
                setWishlist([]);
                setLoading(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from("wishlist")
                    .select("*, property:properties(*)")
                    .eq("user_id", user.id);

                if (error) throw error;

                if (mounted) {
                    // Extract properties from the joined query
                    const properties = data.map(item => item.property).filter(Boolean);
                    const normalized = properties.map(p => normalizeProperty(p));
                    setWishlist(normalized);
                }
            } catch (error) {
                console.error("Error fetching wishlist:", error);
                // toast.error("Failed to load wishlist");
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchWishlist();

        return () => {
            mounted = false;
        };
    }, [user]);

    // ========================
    // HELPERS
    // ========================
    const isInWishlist = (propertyId) => {
        return wishlist.some(item => item.id === propertyId);
    };

    // ========================
    // ACTIONS
    // ========================
    const navigate = useNavigate();
    const location = useLocation();

    // ========================
    // ACTIONS
    // ========================
    const addToWishlist = async (property) => {
        if (!user) {
            openAuthModal();
            return;
        }

        // Optimistic Update
        const previousWishlist = [...wishlist];
        setWishlist(prev => [...prev, property]);

        try {
            const { error } = await supabase
                .from("wishlist")
                .insert({ user_id: user.id, property_id: property.id });

            if (error) throw error;
            toast.success("Added to wishlist");
        } catch (error) {
            console.error("Error adding to wishlist:", error);
            toast.error("Failed to add to wishlist");
            setWishlist(previousWishlist); // Revert
        }
    };

    const removeFromWishlist = async (propertyId) => {
        if (!user) return;

        // Optimistic Update
        const previousWishlist = [...wishlist];
        setWishlist(prev => prev.filter(item => item.id !== propertyId));

        try {
            const { error } = await supabase
                .from("wishlist")
                .delete()
                .eq("user_id", user.id)
                .eq("property_id", propertyId);

            if (error) throw error;
            toast.success("Removed from wishlist");
        } catch (error) {
            console.error("Error removing from wishlist:", error);
            toast.error("Failed to remove from wishlist");
            setWishlist(previousWishlist); // Revert
        }
    };

    const toggleWishlist = (property) => {
        // Redirect if not logged in
        if (!user) {
            openAuthModal();
            return;
        }

        // Handle both property object and property ID
        const propertyId = property.id || property;

        if (isInWishlist(propertyId)) {
            removeFromWishlist(propertyId);
        } else {
            // Need full property object for optimistic add
            if (typeof property === 'string') {
                console.warn("toggleWishlist called with ID only. Optimistic add might display incomplete data.");
            }
            addToWishlist(property);
        }
    };

    const value = {
        wishlist,
        loading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
    };

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
};

