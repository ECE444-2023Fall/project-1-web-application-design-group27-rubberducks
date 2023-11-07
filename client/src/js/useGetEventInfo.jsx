import { useState, useEffect, useCallback } from "react";

export const useGetEventInfo = (eventId) => {
  const [loading, setLoading] = useState(true);
  const [eventInfo, setEventInfo] = useState({});

  const loadEventInfo = useCallback(async () => {
    setEventInfo(
      await fetch("/api/events/" + eventId)
        .then((res) => res.json())
        .then((data) => data)
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    loadEventInfo();
  }, [loadEventInfo]);

  return { eventInfo, loading };
};