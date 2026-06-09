import { useState, useEffect } from "react";
import type { Permit } from "../features/permit/permit.types";
import { permitService } from "../features/permit/permitService";

export function usePermit(id?: string) {
  const [permit, setPermit] = useState<Permit>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadPermit = async () => {
      try {
        const result = await permitService.getPermitById(id);
        setPermit(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadPermit();
  }, [id]);

  return { permit, loading, error };
}
