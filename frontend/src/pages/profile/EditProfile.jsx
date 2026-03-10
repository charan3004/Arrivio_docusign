import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabase/client';
import PersonalDetails from '../../components/profile/PersonalDetails';
import { toast } from 'react-hot-toast';

const EditProfile = () => {
    const { user } = useAuth();

    // State
    const [phone, setPhone] = useState("");
    const [username, setUsername] = useState("");
    const [initialUsername, setInitialUsername] = useState("");
    const [countryCode, setCountryCode] = useState("+91");
    const [saving, setSaving] = useState(false);
    const [usernameError, setUsernameError] = useState("");

    // Fetch Data
    const fetchUserData = useCallback(async () => {
        if (!user) return;
        const { data, error } = await supabase
            .from("users")
            .select("phone, username")
            .eq("id", user.id)
            .single();

        if (data?.username) {
            setUsername(data.username);
            setInitialUsername(data.username);
        }
        if (data?.phone) {
            const knownCodes = ["+91", "+1", "+44", "+61", "+971", "+65"];
            const code = knownCodes.find((c) => data.phone.startsWith(c));
            if (code) {
                setCountryCode(code);
                setPhone(data.phone.slice(code.length));
            } else {
                setPhone(data.phone);
            }
        }
    }, [user]);

    useEffect(() => { fetchUserData(); }, [fetchUserData]);

    // REALTIME USERNAME CHECK
    useEffect(() => {
        const checkUsername = async () => {
            if (!username || username.length < 3) {
                setUsernameError("");
                return;
            }
            if (username === initialUsername) {
                setUsernameError("");
                return;
            }

            // 1. Check current USERS table
            const { data: existingUser } = await supabase
                .from("users")
                .select("id")
                .eq("username", username)
                .neq("id", user.id) // Exclude current user
                .maybeSingle();

            if (existingUser) {
                setUsernameError("Username taken 😔");
                return;
            }

            // 2. Check HISTORY table (14-day retention)
            const { data: historyRecord } = await supabase
                .from("username_history")
                .select("user_id, created_at")
                .eq("username", username)
                .maybeSingle();

            if (historyRecord) {
                if (historyRecord.user_id === user.id) {
                    setUsernameError(""); // Logic: I own it
                    return;
                }
                const reservedAt = new Date(historyRecord.created_at);
                const now = new Date();
                const diffDays = (now - reservedAt) / (1000 * 60 * 60 * 24);
                if (diffDays < 14) {
                    setUsernameError("Reserved (recent change) 🔒");
                    return;
                }
            }
            setUsernameError("");
        };

        const timer = setTimeout(() => checkUsername(), 500);
        return () => clearTimeout(timer);
    }, [username, user, initialUsername]);

    const handleSave = async () => {
        if (!user) return;
        if (usernameError) {
            toast.error("Please fix errors before saving");
            return;
        }

        // Rate Limit Check
        if (username !== initialUsername) {
            const fourteenDaysAgo = new Date();
            fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

            const { count, error } = await supabase
                .from("username_history")
                .select("*", { count: "exact", head: true })
                .eq("user_id", user.id)
                .gte("created_at", fourteenDaysAgo.toISOString());

            if (!error && count >= 2) {
                toast.error("Limit reached: Max 2 changes in 14 days");
                return;
            }
        }

        setSaving(true);
        const fullPhone = `${countryCode}${phone}`;
        const { error } = await supabase.from("users").upsert({
            id: user.id, email: user.email, phone: fullPhone, username: username
        });

        setSaving(false);

        if (error) {
            if (error.code === '23505') {
                toast.error("Username taken 😔");
                setUsernameError("Username taken");
            } else {
                console.error("Profile Update Error:", error);
                toast.error(error.message || "Failed to update profile");
            }
        } else {
            toast.success("Profile updated! ✨");
            await fetchUserData();
        }
    };

    if (!user) return null;

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-serif text-[#2C3E30] mb-8">Personal Details</h2>

            <PersonalDetails
                name={user.user_metadata?.full_name}
                email={user.email}
                username={username}
                setUsername={setUsername}
                usernameError={usernameError}
                phone={phone}
                setPhone={setPhone}
                countryCode={countryCode}
                setCountryCode={setCountryCode}
                created_at={user.created_at}
                handleSave={handleSave}
                saving={saving}
            />
        </div>
    );
};

export default EditProfile;
