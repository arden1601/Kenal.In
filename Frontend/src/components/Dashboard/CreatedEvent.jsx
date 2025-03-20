import { format } from "date-fns";
import { DownloadCloud } from "lucide-react";
import { useCreateEvent } from "../../helper/context/CreateEventContext";

/**
 * Component to display the list of created events.
 *
 * The component renders a table with the columns Event Name, Code, Start Date, End Date, and Recap.
 * The Recap column contains a button to download a CSV file containing the participants and their registration times.
 * The button is disabled if there are no participants for the event.
 */
const CreatedEvent = () => {
  const { events, downloadRecap } = useCreateEvent();

  return (
    <div className="bg-white w-[520px] p-6 rounded-xl shadow-lg space-y-4 flex-[0.5] overflow-y-auto">
      <h2 className="text-xl font-semibold text-[#573C27] text-center">
        Created Events
      </h2>
      {events.length === 0 ? (
        <p className="text-gray-500 text-center mt-20">
          No events created yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-max leading-normal shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                  Event Name
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                  Code
                </th>
                <th className="px-5 w-40 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                  Start Date
                </th>
                <th className="px-5 w-40 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                  End Date
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                  Recap
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {events.map((event, index) => (
                <tr key={index}>
                  <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    {event.name}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    {event.code}
                  </td>
                  <td className="px-5 w-40 py-5 border-b border-gray-200 text-sm">
                    {event.startTime ? format(event.startTime, "PPPpp") : "N/A"}
                  </td>
                  <td className="px-5 w-40 py-5 border-b border-gray-200 text-sm">
                    {event.endTime ? format(event.endTime, "PPPpp") : "N/A"}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <button
                      onClick={() => downloadRecap(event)}
                      className={`
                        inline-flex items-center justify-center
                        px-3 py-1 rounded-full
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
