import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { useSocket } from "./SocketContext";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext();
export const NotificationContextProvider = ({ children }) => {
  const { auth } = useAuth();
  const socket = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotificationBar, setShowNoticationBar] = useState(false);
  console.log("Socket ID in Notification Context:", socket?.id);
  useEffect(() => {
    if (!auth?.isLoggedIn || !auth?.user) return;
    let isMounted = true;
    const fetchNotfications = async () => {
      try {
        const res = await api.get("/notification");
        if (!isMounted) return;
        const all = res.data?.data?.notifications;
        console.log(all);

        setNotifications(all);
        setUnreadCount(all.filter((n) => !n.isRead).length);
      } catch (err) {
        console.log(err);
        if (err.response?.status === 401) {
          // 🧩 Stop the infinite loop
          localStorage.removeItem("auth");
          window.location.replace("/login");
        }
      }
    };
    fetchNotfications();
    return () => {
      isMounted = false;
    };
  }, [auth?.isLoggedIn]);
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (data) => {
      console.log("🎯 Received notification:new event:", data);
      toast.success("New message");
      setNotifications((prev) => [data, ...prev]);
      if (!data.isRead) setUnreadCount((prev) => prev + 1);
    };

    const handleFriendAccepted = (notif) => {
      console.log("✅ Friend request accepted notification received:", notif);
      toast.success(notif.message);
      setNotifications((prev) => [notif, ...prev]);
      if (!notif.isRead) setUnreadCount((prev) => prev + 1);
    };

    // Bind all listeners once
    socket.on("notification:new", handleNewNotification);
    socket.on("notification:friend-request-accepted", handleFriendAccepted);

    console.log("📡 Listeners bound for notification events");

    // Cleanup on unmount
    return () => {
      socket.off("notification:new", handleNewNotification);
      socket.off("notification:friend-request-accepted", handleFriendAccepted);
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
  const handleResponse = async (friendRequestId, action, itemId, senderId) => {
    try {
      const res = await api.post("/friend/respond-request", {
        requestId: friendRequestId,
        action,
      });
      if (res?.data?.statusCode === 200) {
        toast.success(res.data.message || `Friend request ${action}ed`);
        setNotifications((prev) => prev.filter((n) => n._id !== itemId));
        updateNotification(friendRequestId, action);
        setUnreadCount((prev) => Math.max(prev - 1, 0));
        if (socket) {
          socket.emit("request:accepted", {
            senderId: senderId,
            message: res?.data?.message,
          });
          return { success: true, message: res.data.message };
        } else {
          return { success: false, message: "Error" };
        }
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || err.message);
    }
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
        handleResponse,
      }}
    >
      {" "}
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
