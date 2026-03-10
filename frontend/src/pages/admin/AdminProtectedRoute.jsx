import { useEffect, useState } from "react";
import { supabase } from "../../supabase/client";
import { Navigate } from "react-router-dom";

export default function AdminProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || !user.email_confirmed_at) {
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role === "admin") {
        setAllowed(true);
      }

      setLoading(false);
    };

    checkAdmin();
  }, []);

  if (loading) return <p>Checking admin...</p>;

  if (!allowed) return <Navigate to="/admin/login" />;

  return children;
}
