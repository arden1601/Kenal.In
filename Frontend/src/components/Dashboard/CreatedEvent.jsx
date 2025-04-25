import { format } from "date-fns";
import { DownloadCloud } from "lucide-react";
import { useCreateEvent } from "../../helper/context/CreateEventContext";
import { useNavigate } from "react-router-dom"; // Import useNavigate

/**
 * Component to display the list of created events.
 *
 * The component renders a table with the columns Event Name, Code, Start Date, End Date, and Recap.
 * The Recap column contains a button to download a CSV file containing the participants and their registration times.
 * The button is disabled if there are no participants for the event.
 * Each row is clickable and routes to /cam/[code].
 */
const CreatedEvent = () => {
  const { events, downloadRecap } = useCreateEvent();
  const navigate = useNavigate(); // Get the navigate function

  // Handler function for row click
  const handleRowClick = (eventCode) => {
    navigate(`/dashboard/cam/${eventCode}`);
  };

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
                  Code
                </th>
                <th className="px-2 md:px-5 w-20 md:w-40 py-2 md:py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                  Start
                </th>
                <th className="px-2 md:px-5 w-20 md:w-40 py-2 md:py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                  End
                </th>
                <th className="px-2 md:px-5 py-2 md:py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                  Recap
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {events.map((event, index) => (
                // Add onClick handler and cursor style to the row
                <tr
                  key={index}
                  onClick={() => handleRowClick(event.code)}
                  className="cursor-pointer hover:bg-gray-100 transition-colors duration-150">
                  <td className="px-2 md:px-5 py-2 md:py-5 border-b border-gray-200 text-xs md:text-sm">
                    <div className="truncate max-w-[80px] md:max-w-full">{event.name}</div>
                  </td>
                  <td className="px-2 md:px-5 py-2 md:py-5 border-b border-gray-200 text-xs md:text-sm">
                    {event.code}
                  </td>
                  <td className="px-2 md:px-5 w-20 md:w-40 py-2 md:py-5 border-b border-gray-200 text-xs md:text-sm">
                    <div className="truncate">
                      {event.startTime ? format(event.startTime, "PP") : "N/A"}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {event.startTime ? format(event.startTime, "p") : ""}
                    </div>
                  </td>
                  <td className="px-2 md:px-5 w-20 md:w-40 py-2 md:py-5 border-b border-gray-200 text-xs md:text-sm">
                    <div className="truncate">
                      {event.endTime ? format(event.endTime, "PP") : "N/A"}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {event.endTime ? format(event.endTime, "p") : ""}
                    </div>
                  </td>
                  <td
                    className="px-2 md:px-5 py-2 md:py-5 border-b border-gray-200 text-xs md:text-sm"
                    onClick={(e) => e.stopPropagation()} // Prevent row click when clicking the button
                  >
                    <button
                      onClick={() => downloadRecap(event)}
                      className={`
                        inline-flex items-center justify-center
                        px-2 md:px-3 py-1 rounded-full
                        text-blue-500
                        hover:bg-blue-100
                        transition-colors duration-200
                        ${
                          event?.participants?.length === 0
                            ? "cursor-not-allowed opacity-50"
                            : ""
                        }
                      `}
                      disabled={event?.participants?.length === 0}>
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