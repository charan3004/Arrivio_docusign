import { useEffect, useState } from "react";
import { getPropertyById } from "../services/properties.service";

export function useProperty(id) {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    setLoading(true);

    getPropertyById(id)
      .then(setProperty)
      .finally(() => setLoading(false));
  }, [id]);

  return { property, loading };
}
