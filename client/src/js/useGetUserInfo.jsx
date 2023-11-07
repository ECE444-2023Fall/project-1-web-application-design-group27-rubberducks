import { useState, useEffect, useCallback } from "react";

export const useGetUserInfo = () => {
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({});
  const user = JSON.parse(localStorage.getItem("user"));
  const id = user ? user.id : null;

  const loadUserInfo = useCallback(async () => {
    if (id) {
      setUserInfo(
        await fetch("/api/accounts/" + id)
          .then((res) => res.json())
          .then((data) => data)
      );
      setLoading(false);
    } else {
      window.location.href = "/login-error";
    }
  }, [id]);

  useEffect(() => {
    loadUserInfo();
  }, [loadUserInfo]);

  return { userInfo, loading };
};
