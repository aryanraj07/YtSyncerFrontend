import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { useSocket } from "./SocketContext";
import { toast } from "react-toastify";

const NotificationContext = createContext();
export const NotificationContextProvider = ({ children }) => {
  const socket = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotificationBar, setShowNoticationBar] = useState(false);
  console.log("Socket ID in Notification Context:", socket?.id);
  useEffect(() => {
    const fetchNotfications = async () => {
      try {
        const res = await api.get("/notification");
        const all = res.data?.data?.notifications;
        console.log(all);

        setNotifications(all);
        setUnreadCount(all.filter((n) => !n.isRead).length);
      } catch (err) {
        console.log(err);
      }
    };
    fetchNotfications();
  }, []);
  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.on("notification:new", (data) => {
      console.log("🎯 Received notification:new event:", data);

      toast.success("New message");
      setNotifications((prev) => [data, ...prev]);
      if (!data.isRead) setUnreadCount((prev) => prev + 1);
    });
    return () => {
      socket.off("notification:new");
    };
  }, [socket]);
  const markAllAsRead = async () => {
    try {
      await api.patch("/notification/mark-all-read");
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.log(err);
    }
  };
  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notification/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      console.log(err);
    }
  };
  const handleShowNotifcationBar = async () => {
    setShowNoticationBar((prev) => !prev);
    if (unreadCount > 0) {
      await markAllAsRead();
    }
  };
  const updateNotification = (id, updates) => {
    setNotifications((prev) =>
      prev.id === id ? { ...prev, ...updates } : prev
    );
  };
  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        showNotificationBar,
        setUnreadCount,
        setNotifications,
        updateNotification,
        handleShowNotifcationBar,
        handleMarkAsRead,
      }}
    >
      {" "}
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
