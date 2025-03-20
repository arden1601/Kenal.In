"use client";

import { useState, createContext, useContext, useCallback } from "react";

const JoinEventContext = createContext(undefined);

// eslint-disable-next-line react/prop-types
export const JoinEventProvider = ({ children }) => {
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [eventCode, setEventCode] = useState("");
  const [allEvents, setAllEvents] = useState([
    // Mock of Existing Events
    {
      name: "Event 1",
      code: "4I3G5",
      startTime: new Date(2024, 0, 15, 10, 0),
      endTime: new Date(2024, 0, 15, 12, 0),
      participants: [],
    },
    {
      name: "Event 2",
      code: "DF9G7",
      startTime: new Date(2024, 0, 20, 14, 0),
      endTime: new Date(2024, 0, 20, 16, 0),
      participants: [],
    },
  ]);

  const joinEvent = useCallback(() => {
    const eventToJoin = allEvents.find(
      (event) => event.code === eventCode.toUpperCase()
    ); //make code check case insensitive
    if (eventToJoin) {
      // Check if the event has already been joined
      if (joinedEvents.some((e) => e.code === eventToJoin.code)) {
        alert("You have already joined this event!");
        setEventCode("");
        return;
      }
      setJoinedEvents([...joinedEvents, eventToJoin]);
      setEventCode("");
    } else {
      alert("Event not found!");
      setEventCode("");
    }
  }, [eventCode, joinedEvents, allEvents]);

  const contextValue = {
    joinedEvents,
    eventCode,
    setEventCode,
    joinEvent,
    allEvents,
    setAllEvents,
  };

  return (
    <JoinEventContext.Provider value={contextValue}>
      {children}
    </JoinEventContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useJoinEvent = () => useContext(JoinEventContext);
