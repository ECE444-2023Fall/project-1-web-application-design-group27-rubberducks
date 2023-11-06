import { useState, useEffect, useCallback } from "react";

export const useGetUserInfo = () => {
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({});
  const user = JSON.parse(localStorage.getItem("user"));
  const id = user.id;

  const loadUserInfo = useCallback(async () => {
    setUserInfo(
      await fetch("/api/accounts/" + id)
        .then((res) => res.json())
        .then((data) => data)
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    loadUserInfo();
  }, [loadUserInfo]);

  return { userInfo, loading };
};
