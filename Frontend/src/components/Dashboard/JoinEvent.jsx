import { useJoinEvent } from "../../helper/context/JoinEventContext";

/**
 * A component allowing users to join an event by entering an event code.
 *
 * This component provides an input field for users to enter the event code
 * and a button to trigger the join event action. The event code is managed
 * through the context provided by `useJoinEvent`. On clicking the "Join Event"
 * button, the `joinEvent` function from the context is called to handle the
 * joining logic.
 */

const JoinEvent = () => {
  const { eventCode, setEventCode, joinEvent } = useJoinEvent();

  return (
    <div className="bg-white w-full md:w-96 p-6 rounded-xl shadow-lg space-y-4 flex-[0.45]">
      <h2 className="text-[#573C27] text-xl font-semibold text-center">
        Join Event
      </h2>
      <div className="space-y-2">
        <label
          htmlFor="event-code"
          className="block text-sm font-medium text-[#573C27]">
          Input Event Code
        </label>
        <input
          id="event-code"
          type="text"
          value={eventCode}
          onChange={(e) => setEventCode(e.target.value)}
          placeholder="Enter event code"
          className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:border-blue-500"
        />
      </div>
      <button
        onClick={joinEvent}
        className="w-full bg-[#C95588] hover:brightness-[0.95] cursor-pointer transition-all duration-300 text-white font-bold py-2 px-4 rounded flex items-center justify-center">
        Join Event
      </button>
    </div>
  );
};

export default JoinEvent;
