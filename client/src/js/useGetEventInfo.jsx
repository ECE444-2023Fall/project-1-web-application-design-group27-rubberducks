import { useState, useEffect, useCallback } from "react";

export const useGetEventInfo = (eventId) => {
  const [loading, setLoading] = useState(true);
  const [hostInfo, setHostInfo] = useState({});
  const [eventInfo, setEventInfo] = useState({});
  const [userInfo, setUserInfo] = useState({});
  const [loadingHostInfo, setLoadingHostInfo] = useState(true);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [ownerLoggedIn, setOwnerLoggedIn] = useState(false);
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const id = user ? user.id : null && setUserLoggedIn(false);

  useEffect(() => {
    setLoading(true);

    // fetch event information for given eventId
    fetch("/api/events/" + eventId) 
      .then((res) => {
        if (!res.ok) {
          window.location.href = "/404";
        }
        return res.json();
      })
      .then((eventData) => {
        setEventInfo(eventData);
        // fetch host info for host of given event
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

  // if there is a user logged in, fetch the user info
  const loadUserInfo = useCallback(async () => {
    if (id) {
      fetch("/api/accounts/" + id)
        .then((res) => res.json())
        .then((data) => {
          setUserInfo(data);
          setUserLoggedIn(true);

          if (!loadingHostInfo) {

            // check if the user logged in is the owner of the event
            if (hostInfo.owner === data.uid) {
              setOwnerLoggedIn(true);
            } else {
              setOwnerLoggedIn(false);
            }

            // check if the user is already registered for the event
            if (eventInfo.attendees.includes(data.uid)) {
              setIsAlreadyRegistered(true);
            } else {
              setIsAlreadyRegistered(false);
            }  

            setLoading(false);
          }
        });
    } else {
      setOwnerLoggedIn(false);
      setLoading(false);
      setUserLoggedIn(false);
    }
  }, [id, hostInfo, loadingHostInfo]);

  useEffect(() => {
    loadUserInfo();
  }, [loadUserInfo, loadingHostInfo]);

  return { hostInfo, eventInfo, userInfo, userLoggedIn, ownerLoggedIn, isAlreadyRegistered, loading };
};
