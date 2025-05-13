import Header from "../components/Dashboard/Header";
import Profile from "../components/Dashboard/Profile";
import CreateEvent from "../components/Dashboard/CreateEvent";
import CreatedEvent from "../components/Dashboard/CreatedEvent";
// import JoinEvent from "../components/Dashboard/JoinEvent";
// import EventParticipation from "../components/Dashboard/EventParticipation";

const Dashboard = () => {
  return (
    <div className="relative min-w-full min-h-[100vh] bg-[#F8EEDC]">
      <Header page="Dashboard" />
      <div className="w-full flex flex-col md:flex-row h-auto md:h-[730px] justify-center gap-6 pt-32 pb-12 px-4 md:px-6">
        <Profile />
        <div className="flex h-full flex-col gap-6 w-full md:w-fit justify-center">
          <CreateEvent />
          {/* <JoinEvent /> */}
        </div>
        <div className="flex flex-col gap-6 w-full md:w-fit justify-center">
          <CreatedEvent />
          {/* <EventParticipation /> */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
