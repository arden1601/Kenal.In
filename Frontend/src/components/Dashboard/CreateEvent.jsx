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

  // Function to handle the change of date.
  const handleDateChange = (dateType, event) => {
    const selectedDate = event.target.value;

    if (dateType === "start") {
      setStartTime(selectedDate ? new Date(selectedDate) : undefined);
    } else if (dateType === "end") {
      setEndTime(selectedDate ? new Date(selectedDate) : undefined);
    }
  };

  return (
    <div className="bg-white w-96 p-6 rounded-xl shadow-lg space-y-4 flex-[0.55]">
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
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label
            htmlFor="start-time"
            className="block text-sm font-medium text-[#573C27]">
            Start Time
          </label>
          <div className="relative">
            <input
              type="date"
              id="start-time"
              ref={startTimeInputRef}
              onChange={(e) => handleDateChange("start", e)}
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:border-blue-500 cursor-pointer"
            />
          </div>
          {startTime && (
            <p className="text-xs text-[#573C27] mt-1">
              Selected: {format(startTime, "PPP")}
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
              type="date"
              id="end-time"
              ref={endTimeInputRef}
              onChange={(e) => handleDateChange("end", e)}
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:border-blue-500 cursor-pointer"
            />
          </div>
          {endTime && (
            <p className="text-xs text-[#573C27] mt-1">
              Selected: {format(endTime, "PPP")}
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
