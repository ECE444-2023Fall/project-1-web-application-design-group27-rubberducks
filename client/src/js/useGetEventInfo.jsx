import { useState, useEffect, useCallback } from "react";

export const useGetEventInfo = (eventId) => {
  const [loading, setLoading] = useState(true);
  const [hostInfo, setHostInfo] = useState({});
  const [eventInfo, setEventInfo] = useState({});
  const [userInfo, setUserInfo] = useState({});
  const [loadingHostInfo, setLoadingHostInfo] = useState(true);
  const [ownerLoggedIn, setOwnerLoggedIn] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const id = user ? user.id : null;

  useEffect(() => {
    setLoading(true);

    fetch("/api/events/" + eventId) 
      .then((res) => {
        if (!res.ok) {
          window.location.href = "/404";
        }
        return res.json();
      })
      .then((eventData) => {
        setEventInfo(eventData);

        fetch("/api/hosts/" + eventData.owner)
          .then((res) => {
            if (!res.ok) {
              window.location.href = "/404";
            }
            return res.json();
          })
          .then((hostData) => {
            setHostInfo(hostData);
            setLoadingHostInfo(false);
          });

      });
  }, [eventId]);

  const loadUserInfo = useCallback(async () => {
    if (id) {
      fetch("/api/accounts/" + id)
        .then((res) => res.json())
        .then((data) => {
          setUserInfo(data);
          if (!loadingHostInfo) {
            if (hostInfo.owner === data.uid) {
              setOwnerLoggedIn(true);
            } else {
              setOwnerLoggedIn(false);
            }
            setLoading(false);
          }
        });
    } else {
      setOwnerLoggedIn(false);
      setLoading(false);
    }
  }, [id, hostInfo, loadingHostInfo]);

  useEffect(() => {
    loadUserInfo();
  }, [loadUserInfo, loadingHostInfo]);

  return { hostInfo, eventInfo, userInfo, ownerLoggedIn, loading };
};
