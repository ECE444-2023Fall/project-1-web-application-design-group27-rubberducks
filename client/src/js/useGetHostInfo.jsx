import { useState, useEffect, useCallback } from "react";

export const useGetHostInfo = (hostId) => {
  const [loading, setLoading] = useState(true);
  const [hostInfo, setHostInfo] = useState({});

  const loadHostInfo = useCallback(async () => {
    const response = await fetch("/api/hosts/" + hostId);

    if (response.status === 404) {
      window.location.href = "/404";
    } else if (response.ok) {
      const data = await response.json();
      setHostInfo(data);
      setLoading(false);
    } else {
      console.log(response.status);
    }
  }, []);

  useEffect(() => {
    loadHostInfo();
  }, [loadHostInfo]);

  return { hostInfo, loading };
};
