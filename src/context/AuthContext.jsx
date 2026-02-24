import { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "../supabase/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // ==========================
  // AUTH MODAL STATE
  // ==========================
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const onAuthSuccessRef = useRef(null);
  const pendingBookingStateRef = useRef(null);

  const openAuthModal = useCallback((onSuccess, pendingState) => {
    onAuthSuccessRef.current = onSuccess || null;
    pendingBookingStateRef.current = pendingState || null;
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    // Note: we don't clear onAuthSuccessRef here — it gets fired in the effect below
  }, []);

  // ==========================
  // CHECK ADMIN ROLE
  // ==========================
  async function fetchAdminStatus(userId) {
    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (error || !data) {
      setIsAdmin(false);
      return;
    }

    setIsAdmin(data.role === "admin");
  }

  // ==========================
  // 🔥 ATTACH USER TO TRACKING TABLES
  // (runs in background — NEVER blocks UI)
  // ==========================
  async function attachUser(userId) {
    try {
      const sessionId = localStorage.getItem("session_id");
      if (!sessionId) return;

      // attach to visitor_sessions
      await supabase
        .from("visitor_sessions")
        .update({ user_id: userId })
        .eq("session_id", sessionId);

      // attach to booking_intents
      await supabase
        .from("booking_intents")
        .update({ user_id: userId })
        .eq("session_id", sessionId)
        .is("user_id", null);
    } catch (err) {
      console.error("Attach failed:", err);
    }
  }

  // ==========================
  // AUTH LIFECYCLE
  // ==========================
  useEffect(() => {
    let mounted = true;

    // ======================
    // 1. Restore session FAST
    // ======================
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;

      const session = data.session;

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        fetchAdminStatus(session.user.id);
        attachUser(session.user.id); // 🔥 background
      }

      setLoading(false); // ✅ NEVER WAIT FOR DB
    });

    // ======================
    // 2. Listen login/logout
    // ======================
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        fetchAdminStatus(session.user.id);
        attachUser(session.user.id); // 🔥 background

        // Fire pending auth success callback (e.g. from booking widget)
        if (onAuthSuccessRef.current) {
          const callback = onAuthSuccessRef.current;
          onAuthSuccessRef.current = null;
          // Defer to next tick so state is settled
          setTimeout(() => callback(session.user), 0);
        }
      } else {
        setIsAdmin(false);
      }
    });

    // ======================
    // cleanup
    // ======================
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // ==========================
  // LOGOUT
  // ==========================
  async function signOut() {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setIsAdmin(false);
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        isAdmin,
        loading,
        signOut,
        // Modal State
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        pendingBookingStateRef
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ==========================
// HOOK
// ==========================
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
