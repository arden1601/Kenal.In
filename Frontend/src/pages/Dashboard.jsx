import Header from "../components/Dashboard/Header";
import Profile from "../components/Dashboard/Profile";
import CreateEvent from "../components/Dashboard/CreateEvent";
import CreatedEvent from "../components/Dashboard/CreatedEvent";
import JoinEvent from "../components/Dashboard/JoinEvent";
import EventHistory from "../components/Dashboard/EventHistory";

const Dashboard = () => {
  return (
    <div className="relative min-w-full min-h-[100vh] bg-[#F8EEDC]">
      <Header page="Dashboard" />
      <div className="w-full flex h-[730px] justify-center gap-x-6 pt-32 pb-12">
        <Profile />
        <div className="flex h-full flex-col gap-y-6 w-fit justify-center">
          <CreateEvent />
          <JoinEvent />
        </div>
        <div className="flex flex-col gap-y-6 w-fit justify-center">
          <CreatedEvent />
          <EventHistory />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
