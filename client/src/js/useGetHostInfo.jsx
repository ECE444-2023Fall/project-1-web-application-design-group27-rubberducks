import { useState, useEffect, useCallback } from "react";

export const useGetHostInfo = (hostId) => {
  const [loading, setLoading] = useState(true);
  const [hostInfo, setHostInfo] = useState({});

  const loadHostInfo = useCallback(async () => {
    setHostInfo(
      await fetch("/api/hosts/" + hostId)
        .then((res) => res.json())
        .then((data) => data)
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    loadHostInfo();
  }, [loadHostInfo]);

  return { hostInfo, loading };
};
