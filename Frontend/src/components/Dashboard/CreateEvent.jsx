import { useRef } from "react";
import { format } from "date-fns";
// Import the useCreateEvent hook from your context file
import { useCreateEvent } from "../../helper/context/CreateEventContext";

const CreateEvent = () => {
  // Access state and functions from the CreateEventContext
  const {
    eventName,
    setEventName,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    createEvent,
    creatingEvent, // Get the loading state for creating an event
  } = useCreateEvent();

  const startTimeInputRef = useRef(null);
  const endTimeInputRef = useRef(null);

  const handleDateTimeChange = (dateType, event) => {
    const selectedDateTimeString = event.target.value;

    if (dateType === "start") {
      // Store as Date object
      setStartTime(
        selectedDateTimeString ? new Date(selectedDateTimeString) : undefined
      );
    } else if (dateType === "end") {
      // Store as Date object
      setEndTime(
        selectedDateTimeString ? new Date(selectedDateTimeString) : undefined
      );
    }
  };

  const formatForInput = (date) => {
    if (!date) return "";
    // format date to 'YYYY-MM-DDTHH:mm' for datetime-local input
    return format(date, "yyyy-MM-dd'T'HH:mm");
  };

  return (
    <div className="bg-white w-full md:w-96 p-4 md:p-6 rounded-xl shadow-lg space-y-4 flex-1">
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
          disabled={creatingEvent} // Disable input while creating
        />
      </div>
      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <label
            htmlFor="start-time"
            className="block text-sm font-medium text-[#573C27]">
            Start Time
          </label>
          <div className="relative">
            <input
              type="datetime-local"
              id="start-time"
              ref={startTimeInputRef}
              value={formatForInput(startTime)}
              onChange={(e) => handleDateTimeChange("start", e)}
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:border-blue-500 cursor-pointer"
              disabled={creatingEvent} // Disable input while creating
            />
          </div>
          {startTime && (
            <p className="text-xs text-[#573C27] mt-1 break-words">
              Selected: {format(startTime, "PPPpp")}{" "}
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
              type="datetime-local"
              id="end-time"
              ref={endTimeInputRef}
              value={formatForInput(endTime)}
              onChange={(e) => handleDateTimeChange("end", e)}
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:border-blue-500 cursor-pointer"
              disabled={creatingEvent} // Disable input while creating
            />
          </div>
          {endTime && (
            <p className="text-xs text-[#573C27] mt-1 break-words">
              Selected: {format(endTime, "PPPpp")}{" "}
            </p>
          )}
        </div>
      </div>
      <button
        onClick={createEvent}
        className="w-full bg-[#C95588] hover:brightness-[0.95] transition-all duration-300 cursor-pointer text-white font-bold py-2 px-4 rounded"
        disabled={!eventName || !startTime || !endTime || creatingEvent} // Disable button while creating or if fields are empty
      >
        {creatingEvent ? "Creating..." : "Create Event"}{" "}
        {/* Change button text */}
      </button>
    </div>
  );
};

export default CreateEvent;
