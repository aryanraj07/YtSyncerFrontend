import React from "react";
import { useNotifications } from "../../context/NotificationContext";
import { IoIosNotifications } from "react-icons/io";

const NotificaitonIcon = ({ onClick }) => {
  const { unreadCount } = useNotifications();

  return (
    <div className="cursor-pointer relative" onClick={onClick}>
      <IoIosNotifications className="w-6 h-6 text-violet-500" />
      {unreadCount > 0 && (
        <span className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
          {unreadCount}
        </span>
      )}
    </div>
  );
};

export default NotificaitonIcon;
