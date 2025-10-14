import { useState } from "react";
import DashboardTabs from "../components/dashboard/DashboardTabs";
import RoomLists from "../components/Rooms/RoomLists";
import FriendsSection from "../components/Freinds/FriendsSection";
import Notifications from "../components/Notifications/Notifications";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("rooms");

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Tabs Header */}
      <DashboardTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Main Content */}
        <div className="lg:col-span-9">
          {activeTab === "rooms" && <RoomLists />}
          {activeTab === "friends" && <FriendsSection />}
        </div>

        {/* Notifications Sidebar */}
      </div>
    </div>
  );
};

export default Dashboard;
