import { format } from "date-fns";
import { DownloadCloud } from "lucide-react";
import { useEffect } from "react";
import { useCreateEvent } from "../../helper/context/CreateEventContext";
import { useNavigate } from "react-router-dom";

const CreatedEvent = () => {
  const { events, downloadRecap, loadingEvents, eventError, getEvents } =
    useCreateEvent();
  const navigate = useNavigate();

  useEffect(() => {
    getEvents();
  }, [getEvents]);

  const handleRowClick = (eventId) => {
    navigate(`/dashboard/cam/${eventId}`);
  };

  // Helper function to safely format dates, handling strings (including number strings),
  // Unix timestamps (seconds), and Unix timestamps (milliseconds)
  const safeFormatDate = (dateValue, formatString) => {
    if (!dateValue) return "N/A"; // Return N/A for null, undefined, or empty string

    let date;
    if (typeof dateValue === "number") {
      // Check if the number seems like milliseconds (large) or seconds (small)
      // A rough heuristic: dates in the near future in milliseconds are > 10^12
      // If the number is less than, say, the year 2000 in milliseconds, assume it's seconds.
      // 10^12 is roughly the year 2001
      if (dateValue < 1000000000000) {
        // Assume it's a Unix timestamp in seconds
        date = new Date(dateValue * 1000);
        console.log(
          `Attempting to parse number as seconds: ${dateValue} -> ${new Date(
            dateValue * 1000
          )}`
        );
      } else {
        // Assume it's a Unix timestamp in milliseconds
        date = new Date(dateValue);
        console.log(
          `Attempting to parse number as milliseconds: ${dateValue} -> ${new Date(
            dateValue
          )}`
        );
      }
    } else if (typeof dateValue === "string") {
      // Attempt to parse string as a number first
      const numberValue = Number(dateValue); // Use Number() for potential floating points too
      if (!isNaN(numberValue)) {
        // If it's a valid number string, treat it as a timestamp (seconds or milliseconds)
        if (numberValue < 1000000000000) {
          // Assume seconds
          date = new Date(numberValue * 1000);
          console.log(
            `Attempting to parse number string as seconds: "${dateValue}" -> ${new Date(
              numberValue * 1000
            )}`
          );
        } else {
          // Assume milliseconds
          date = new Date(numberValue);
          console.log(
            `Attempting to parse number string as milliseconds: "${dateValue}" -> ${new Date(
              numberValue
            )}`
          );
        }
      } else {
        // If it's not a number string, attempt to parse as a regular date string
        date = new Date(dateValue);
        console.log(
          `Attempting to parse string as date: "${dateValue}" -> ${new Date(
            dateValue
          )}`
        );
      }
    } else {
      // Handle other unexpected types
      console.warn(
        `Received unexpected date value type: ${typeof dateValue}`,
        dateValue
      );
      return "Invalid Type";
    }

    // Check if the date object is valid
    if (isNaN(date.getTime())) {
      console.warn(
        `Invalid date value received: ${dateValue}`,
        typeof dateValue
      );
      return "Invalid Date"; // Or some other indicator
    }
    return format(date, formatString);
  };

  if (loadingEvents) {
    return (
      <div className="bg-white w-full md:w-[520px] p-4 md:p-6 rounded-xl shadow-lg space-y-4 flex-1 overflow-y-auto text-center text-[#573C27]">
        Loading events...
      </div>
    );
  }

  if (eventError) {
    return (
      <div className="bg-white w-full md:w-[520px] p-4 md:p-6 rounded-xl shadow-lg space-y-4 flex-1 overflow-y-auto text-center text-red-500">
        Error loading events: {eventError}
      </div>
    );
  }

  return (
    <div className="bg-white w-full md:w-[520px] p-4 md:p-6 rounded-xl shadow-lg space-y-4 flex-1 overflow-y-auto">
      <h2 className="text-xl font-semibold text-[#573C27] text-center">
        Created Events
      </h2>
      {events.length === 0 ? (
        <p className="text-gray-500 text-center mt-10 md:mt-20">
          No events created yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full leading-normal shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="px-2 md:px-5 py-2 md:py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                  Event Name
                </th>
                <th className="px-2 md:px-5 py-2 md:py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                  Event ID
                </th>
                <th className="px-2 md:px-5 w-20 md:w-40 py-2 md:py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                  Start
                </th>
                <th className="px-2 md:px-5 w-20 md:w-40 py-2 md:py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                  End
                </th>
                <th className="px-2 md:px-5 py-2 md:py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                  Attendees
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {events.map((event) => (
                <tr
                  key={event.id}
                  onClick={() => handleRowClick(event.id)}
                  className="cursor-pointer hover:bg-gray-100 transition-colors duration-150">
                  <td className="px-2 md:px-5 py-2 md:py-5 border-b border-gray-200 text-xs md:text-sm">
                    <div className="truncate max-w-[80px] md:max-w-full">
                      {event.eventName}
                    </div>
                  </td>
                  <td className="px-2 md:px-5 py-2 md:py-5 border-b border-gray-200 text-xs md:text-sm">
                    {event.id}
                  </td>
                  <td className="px-2 md:px-5 w-20 md:w-40 py-2 md:py-5 border-b border-gray-200 text-xs md:text-sm">
                    <div className="truncate">
                      {/* Use safeFormatDate helper */}
                      {safeFormatDate(event.start_date, "PP")}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {/* Use safeFormatDate helper */}
                      {safeFormatDate(event.start_date, "p")}
                    </div>
                  </td>
                  <td className="px-2 md:px-5 w-20 md:w-40 py-2 md:py-5 border-b border-gray-200 text-xs md:text-sm">
                    <div className="truncate">
                      {/* Use safeFormatDate helper */}
                      {safeFormatDate(event.end_date, "PP")}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {/* Use safeFormatDate helper */}
                      {safeFormatDate(event.end_date, "p")}
                    </div>
                  </td>
                  <td
                    className="px-2 md:px-5 py-2 md:py-5 border-b border-gray-200 text-xs md:text-sm"
                    onClick={(e) => e.stopPropagation()}>
                    <span className="mr-2">
                      {event.attendeeDetails?.length || 0}
                    </span>
                    <button
                      onClick={() => downloadRecap(event)}
                      className={`
                        inline-flex items-center justify-center
                        px-2 md:px-3 py-1 rounded-full
                        text-blue-500
                        hover:bg-blue-100
                        transition-colors duration-200
                        ${
                          event.attendeeDetails?.length === 0
                            ? "cursor-not-allowed opacity-50"
                            : ""
                        }
                      `}
                      disabled={event.attendeeDetails?.length === 0}>
                      <DownloadCloud className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CreatedEvent;
