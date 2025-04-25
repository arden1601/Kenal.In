import Header from "../components/Dashboard/Header";
import Profile from "../components/Dashboard/Profile";
import CreateEvent from "../components/Dashboard/CreateEvent";
import CreatedEvent from "../components/Dashboard/CreatedEvent";
// import JoinEvent from "../components/Dashboard/JoinEvent";
// import EventParticipation from "../components/Dashboard/EventParticipation";
import { CreateEventProvider } from "../helper/context/CreateEventContext";
import { JoinEventProvider } from "../helper/context/JoinEventContext";

/**
 * The main dashboard page of the web application.
 *
 * This component wraps the sub-components of the dashboard page in the context providers
 * for creating and joining events.
 *
 * The sub-components include the profile, create event, join event, created event, and event history.
 */

const Dashboard = () => {
  return (
    <div className="relative min-w-full min-h-[100vh] bg-[#F8EEDC]">
      <CreateEventProvider>
        <JoinEventProvider>
          <Header page="Dashboard" />
          <div className="w-full flex h-[730px] justify-center gap-x-6 pt-32 pb-12">
            <Profile />
            <div className="flex h-full flex-col gap-y-6 w-fit justify-center">
              <CreateEvent />
              {/* <JoinEvent /> */}
            </div>
            <div className="flex flex-col gap-y-6 w-fit justify-center">
              <CreatedEvent />
              {/* <EventParticipation /> */}
            </div>
          </div>
        </JoinEventProvider>
      </CreateEventProvider>
    </div>
  );
};

export default Dashboard;
