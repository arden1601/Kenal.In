import { useRef } from "react";
import { format } from "date-fns";
import { useCreateEvent } from "../../helper/context/CreateEventContext";

/**
 * Component to create an event.
 *
 * This component renders a form with input fields for the event name, start time, and end time.
 * When the form is submitted, the createEvent function from the context is called with the
 * given event name, start time, and end time.
 *
 * The component also shows the selected start and end times if they are not null.
 * The date/time pickers are stacked vertically and allow time selection.
 */
const CreateEvent = () => {
  const {
    eventName,
    setEventName,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    createEvent,
  } = useCreateEvent();

  const startTimeInputRef = useRef(null);
  const endTimeInputRef = useRef(null);

  // Function to handle the change of date and time.
  // The input type="datetime-local" gives a string in "YYYY-MM-DDTHH:mm" format.
  // new Date() can parse this format.
  const handleDateTimeChange = (dateType, event) => {
    const selectedDateTimeString = event.target.value;

    if (dateType === "start") {
      setStartTime(
        selectedDateTimeString ? new Date(selectedDateTimeString) : undefined
      );
    } else if (dateType === "end") {
      setEndTime(
        selectedDateTimeString ? new Date(selectedDateTimeString) : undefined
      );
    }
  };

  // We need to format the Date objects from state back into the
  // "YYYY-MM-DDTHH:mm" string format for the datetime-local input value
  // to ensure the input shows the selected value correctly after rendering.
  const formatForInput = (date) => {
    if (!date) return "";
    // Format to "YYYY-MM-DDTHH:mm" required by datetime-local input
    return format(date, "yyyy-MM-dd'T'HH:mm");
  };

  return (
    <div className="bg-white w-96 p-6 rounded-xl shadow-lg space-y-4 flex-1">
      <h2 className="text-xl font-semibold text-[#573C27] text-center">
        Create Event
      </h2>
      <div className="space-y-2">
        <label
          htmlFor="event-name"
          className="block text-sm font-medium text-[#573C27]">
          Event Name
        </label>
        <input
          id="event-name"
          type="text"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          placeholder="Enter event name"
          className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:border-blue-500"
        />
      </div>
      {/* Changed grid layout to flex column layout */}
      <div className="flex flex-col gap-4">
        {" "}
        {/* Use flex-col and gap for vertical spacing */}
        <div className="space-y-2">
          <label
            htmlFor="start-time"
            className="block text-sm font-medium text-[#573C27]">
            Start Time
          </label>
          <div className="relative">
            <input
              type="datetime-local" // Changed type to datetime-local
              id="start-time"
              ref={startTimeInputRef}
              // Set the input value from state, formatted for the input type
              value={formatForInput(startTime)}
              onChange={(e) => handleDateTimeChange("start", e)}
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:border-blue-500 cursor-pointer"
            />
          </div>
          {startTime && (
            <p className="text-xs text-[#573C27] mt-1">
              Selected: {format(startTime, "PPPpp")}{" "}
              {/* PPPpp includes date and time */}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label
            htmlFor="end-time"
            className="block text-sm font-medium text-[#573C27]">
            End Time
          </label>
          <div className="relative">
            <input
              type="datetime-local" // Changed type to datetime-local
              id="end-time"
              ref={endTimeInputRef}
              // Set the input value from state, formatted for the input type
              value={formatForInput(endTime)}
              onChange={(e) => handleDateTimeChange("end", e)}
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:border-blue-500 cursor-pointer"
            />
          </div>
          {endTime && (
            <p className="text-xs text-[#573C27] mt-1">
              Selected: {format(endTime, "PPPpp")}{" "}
              {/* PPPpp includes date and time */}
            </p>
          )}
        </div>
      </div>
      <button
        onClick={createEvent}
        className="w-full bg-[#C95588] hover:brightness-[0.95] transition-all duration-300 cursor-pointer text-white font-bold py-2 px-4 rounded"
        disabled={!eventName || !startTime || !endTime}>
        Create Event
      </button>
    </div>
  );
};

export default CreateEvent;
