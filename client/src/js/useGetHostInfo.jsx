import { useState, useEffect, useCallback } from "react";

export const useGetHostInfo = (hostId) => {
  const [loading, setLoading] = useState(true);
  const [hostInfo, setHostInfo] = useState({});
  const [userInfo, setUserInfo] = useState({});
  const [loadingHostInfo, setLoadingHostInfo] = useState(true);
  const [ownerLoggedIn, setOwnerLoggedIn] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const id = user ? user.id : null;

  useEffect(() => {
    loadUserInfo();
    fetch("/api/hosts/" + hostId)
      .then((res) => {
        if (!res.ok) {
          window.location.href = "/404";
        }
        return res.json();
      })
      .then((data) => {
        setHostInfo(data);
        setLoadingHostInfo(false);
      });
  }, [hostId]);

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

  return { hostInfo, ownerLoggedIn, loading };
};
