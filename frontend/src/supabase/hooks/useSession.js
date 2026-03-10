import { useEffect } from "react";
import { supabase } from "../client";

export default function useSession() {
  useEffect(() => {
    const initSession = async () => {
      let sessionId = localStorage.getItem("session_id");

      if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem("session_id", sessionId);

        await supabase.from("visitor_sessions").insert({
          session_id: sessionId,
        });
      }
    };

    initSession();
  }, []);
}
