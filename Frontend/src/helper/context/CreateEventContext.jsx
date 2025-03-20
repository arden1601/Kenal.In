"use client";

import { createContext, useContext, useCallback, useState } from "react";
import { format } from "date-fns";

const CreateEventContext = createContext(undefined);

// eslint-disable-next-line react/prop-types
export const CreateEventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [eventName, setEventName] = useState("");
  const [startTime, setStartTime] = useState(undefined);
  const [endTime, setEndTime] = useState(undefined);

  const createEvent = useCallback(() => {
    if (eventName && startTime && endTime) {
      const newEvent = {
        name: eventName,
        code: Math.random().toString(36).substring(2, 7).toUpperCase(), // Generate a 5-character random code
        startTime: startTime,
        endTime: endTime,
        participants: [],
      };
      setEvents([...events, newEvent]);
      setEventName("");
      setStartTime(undefined);
      setEndTime(undefined);
    }
  }, [eventName, startTime, endTime, events]);

  const downloadRecap = useCallback((event) => {
    // In a real application, you would generate an Excel file here.
    // This is a simplified example that generates a CSV string and triggers a download.
    if (!event || !event.participants) {
      console.warn(
        "Cannot download recap: Event or participants are undefined/empty."
      );
      return;
    }

    if (event.participants.length === 0) {
      console.warn("No participants to download.");
      return; // Early return if no participants
    }

    // Prepare CSV header
    const header = "Name,Email,Registration Time\n"; // Added a header row

    // Prepare CSV rows.  Added a check for null/undefined values.
    const rows = event.participants
      .map(
        (p) =>
          `${p.name || ""},${p.email || ""},${
            p.registrationTime
              ? format(p.registrationTime, "yyyy-MM-dd HH:mm:ss")
              : ""
          }`
      )
      .join("\n");

    const csvContent = header + rows;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `event_recap_${event.name.replace(/\s+/g, "_")}.csv`
    ); // Sanitize filename
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  const contextValue = {
    events,
    eventName,
    setEventName,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    createEvent,
    downloadRecap,
  };

  return (
    <CreateEventContext.Provider value={contextValue}>
      {children}
    </CreateEventContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCreateEvent = () => useContext(CreateEventContext);
