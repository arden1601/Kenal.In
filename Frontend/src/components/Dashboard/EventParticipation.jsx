import { useJoinEvent } from "../../helper/context/JoinEventContext";
import { format } from "date-fns";

/**
 * Component to display the list of joined events.
 *
 * The component renders a table with the columns Event Name, Code, Start Date, End Date, and Presence.
 * The Presence column contains a placeholder string "Not Yet", but you might want to track the actual presence
 * of the user in the event.
 */
const EventParticipation = () => {
  const { joinedEvents } = useJoinEvent();

  return (
    <div className="bg-white w-[520px] p-6 rounded-xl shadow-lg space-y-4 flex-[0.5] overflow-y-auto">
      <h2 className="text-xl text-center font-semibold text-[#573C27]">
        Event Participation
      </h2>
      {joinedEvents.length === 0 ? (
        <p className="text-gray-500 text-center mt-20">No events joined yet.</p>
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
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                  Start Date
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                  End Date
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                  Presence
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {joinedEvents.map((event, index) => (
                <tr key={index}>
                  <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    {event.name}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    {event.code}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    {event.startTime ? format(event.startTime, "PPPpp") : "N/A"}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    {event.endTime ? format(event.endTime, "PPPpp") : "N/A"}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    Not Yet
                  </td>{" "}
                  {/* You might want to track actual presence */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EventParticipation;
