import { useState, useEffect, useCallback } from "react";

export const useGetEventInfo = (eventId) => {
  const [loading, setLoading] = useState(true);
  const [eventInfo, setEventInfo] = useState({});

  const loadEventInfo = useCallback(async () => {
    const response = await fetch("/api/events/" + eventId);

    if (response.status === 404) {
      window.location.href = "/404";
    } else if (response.ok) {
      const data = await response.json();
      setEventInfo(data);
      setLoading(false);
    } else {
      console.log(response.status);
    }
  }, []);

  useEffect(() => {
    loadEventInfo();
  }, [loadEventInfo]);

  return { eventInfo, loading };
};