import React, { useState } from "react";
import { IoIosNotifications } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import NotificaitonIcon from "../Notifications/NotificaitonIcon";

const DashboardTabs = ({ activeTab, setActiveTab }) => {
  const tabs = ["rooms", "friends", "chat"];
  return (
    <>
      <ul className="flex justify-between items-center">
        <div className="flex items-center gap-10 mb-5">
          {tabs.map((tab, index) => (
            <li
              key={index}
              className={`capitalize ${
                activeTab === tab ? "text-violet-400 cursor-pointer" : ""
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </li>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <IoSettingsOutline />
        </div>
      </ul>
    </>
  );
};

export default DashboardTabs;
