"use client";

import {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
} from "react";
import axios from "axios";
import { apiRoute } from "../api/route";
import toast from "react-hot-toast";
import { useUser } from "./UserContext";

const CreateEventContext = createContext(undefined);

// eslint-disable-next-line react/prop-types
export const CreateEventProvider = ({ children }) => {
  const { user, token } = useUser(); // Get user and token from UserContext

  const [events, setEvents] = useState([]);
  const [eventName, setEventName] = useState("");
  const [startTime, setStartTime] = useState(undefined);
  const [endTime, setEndTime] = useState(undefined);
  const [loadingEvents, setLoadingEvents] = useState(true); // Loading state for fetching events
  const [creatingEvent, setCreatingEvent] = useState(false); // Loading state for creating event
  const [eventError, setEventError] = useState(null);

  // Function to fetch events from the backend
  const getEvents = useCallback(async () => {
    if (!user || !token) {
      // Cannot fetch events if not logged in
      setLoadingEvents(false);
      return;
    }

    setLoadingEvents(true);
    setEventError(null);
    try {
      // Axios default header is set in UserContext useEffect
      const response = await axios.get(apiRoute.events.main);

      if (response.status === 200) {
        // Backend returns a list of events under the 'events' key
        setEvents(response.data.events || []);
      } else {
        setEventError("Failed to fetch events.");
        toast.error("Failed to fetch events.");
      }
    } catch (err) {
      console.error("Error fetching events:", err);
      const errorMessage =
        err.response?.data?.detail || "Failed to fetch events.";
      setEventError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoadingEvents(false);
    }
  }, [user, token]); // Depend on user and token

  // Fetch events when the component mounts or when user/token changes
  useEffect(() => {
    getEvents();
  }, [getEvents]); // Depend on the memoized getEvents function

  // Function to create a new event via the backend API
  const createEvent = useCallback(async () => {
    if (!eventName || !startTime || !endTime) {
      toast.error("Please fill in all event details.");
      return;
    }
    if (!user || !user.userId || !token) {
      toast.error("You must be logged in to create an event.");
      return;
    }

    setCreatingEvent(true);
    setEventError(null);

    try {
      const params = new URLSearchParams();
      params.append("eventName", eventName);
      // Backend expects date strings, ensure correct format if needed, but ISO string is usually fine
      params.append("start_date", startTime.toISOString());
      params.append("end_date", endTime.toISOString());
      params.append("userId", user.userId); // Include the logged-in user's ID

      // Axios default header is set in UserContext useEffect
      const response = await axios.post(apiRoute.events.main, params);

      if (response.status === 200) {
        toast.success("Event created successfully!");
        setEventName("");
        setStartTime(undefined);
        setEndTime(undefined);
        // Refetch the list of events to include the new one
        getEvents();
      } else {
        // This case should ideally be caught by the catch block for non-2xx responses
        setEventError("Failed to create event.");
        toast.error("Failed to create event.");
      }
    } catch (err) {
      console.error("Error creating event:", err);
      const errorMessage =
        err.response?.data?.detail || "Failed to create event.";
      setEventError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setCreatingEvent(false);
    }
  }, [eventName, startTime, endTime, user, token, getEvents]); // Depend on event details, user, token, and getEvents

  // Function to download event recap (using attendeeDetails from fetched event)
  const downloadRecap = useCallback((event) => {
    // The event object passed here should be one from the 'events' state,
    // which now includes 'attendeeDetails' from the backend.
    if (!event || !event.attendeeDetails) {
      console.warn(
        "Cannot download recap: Event or attendee details are undefined/empty."
      );
      toast.error("Cannot download recap: No attendee data available.");
      return;
    }

    if (event.attendeeDetails.length === 0) {
      console.warn("No participants to download.");
      toast.info("No participants to download.");
      return;
    }

    // Prepare CSV header
    // Assuming attendeeDetails contains id, fullName, email
    const header = "User ID,Full Name,Email\n";

    // Prepare CSV rows
    const rows = event.attendeeDetails
      .map(
        (attendee) =>
          `${attendee.id || ""},${attendee.fullName || ""},${
            attendee.email || ""
          }`
      )
      .join("\n");

    const csvContent = header + rows;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    // Use event ID or name for the filename
    link.setAttribute(
      "download",
      `event_recap_${event.id || event.eventName.replace(/\s+/g, "_")}.csv`
    );
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
    loadingEvents,
    creatingEvent,
    eventError,
    getEvents, // Provide getEvents in context if needed elsewhere
  };

  return (
    <CreateEventContext.Provider value={contextValue}>
      {children}
    </CreateEventContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCreateEvent = () => useContext(CreateEventContext);
