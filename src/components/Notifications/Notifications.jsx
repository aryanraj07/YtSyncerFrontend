import React from "react";
import { formatDistanceToNow } from "date-fns";
import { useNotifications } from "../../context/NotificationContext";
import { useNavigate } from "react-router-dom";
const Notifications = () => {
  // const [notifications, setNotifications] = useState([]);
  const {
    handleResponse,
    notifications,
    handleMarkAsRead,
    handleShowNotifcationBar,
  } = useNotifications();
  const navigate = useNavigate();
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-xl rounded-2xl p-4 w-full max-w-sm border border-violet-200 dark:border-violet-600">
      <h2 className="text-xl font-semibold mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">
        Notifications
      </h2>

      {notifications && notifications.length > 0 ? (
        <div className="relative max-h-[400px] overflow-y-auto space-y-3 pr-2">
          {notifications
            .filter((item) => !item.isRead)
            .map((item, index) => (
              <div
                key={index}
                onClick={() => handleMarkAsRead(item._id)}
                className="flex items-start gap-3 p-2 hover:bg-violet-50 dark:hover:bg-violet-800/30 rounded-lg transition-all"
              >
                <img
                  src={item.sender?.avatar || "/default-avatar.png"}
                  alt={item.sender?.username}
                  className="w-10 h-10 rounded-full object-cover border border-violet-300"
                />
                <div className="flex flex-col text-sm">
                  <span className="font-semibold text-violet-700 dark:text-violet-300">
                    {item.sender?.username}
                  </span>
                  {item.type === "friend_request" && (
                    <div className="flex flex-col gap-2">
                      <span className="text-gray-700 dark:text-gray-300">
                        {item.message}
                      </span>

                      <div className="flex gap-2 mt-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleResponse(
                              item.friendRequestId,
                              "accepted",
                              item._id,
                              item.sender._id
                            );
                          }}
                          className="bg-green-500 text-white px-3 py-1 rounded-md text-xs hover:bg-green-600"
                        >
                          Accept
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleResponse(
                              item.friendRequestId,
                              "rejected",
                              item._id,
                              item.sender._id
                            );
                          }}
                          className="bg-red-500 text-white px-3 py-1 rounded-md text-xs hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  )}
                  {item.type === "room_invite" && (
                    <div className="flex flex-col gap-2">
                      <span className="text-gray-700 dark:text-gray-300">
                        {item.message}
                      </span>

                      <div className="flex gap-2 mt-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(item._id);
                            navigate(`/room/${item.roomId}`);
                            handleShowNotifcationBar(false);
                          }}
                          className="bg-green-500 text-white px-3 py-1 rounded-md text-xs hover:bg-green-600"
                        >
                          Join
                        </button>
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded-md text-xs hover:bg-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(item._id);
                            handleShowNotifcationBar(true);
                          }}
                        >
                          Ignore
                        </button>
                      </div>
                    </div>
                  )}
                  <span className="text-sm text-gray-500">
                    {(() => {
                      try {
                        const dateValue =
                          typeof item.createdAt === "string"
                            ? item.createdAt
                            : item.createdAt?.$date;

                        return dateValue
                          ? formatDistanceToNow(new Date(dateValue), {
                              addSuffix: true,
                            })
                          : "Just now";
                      } catch (err) {
                        console.warn("Invalid date:", item.createdAt);
                        return "Just now";
                      }
                    })()}
                  </span>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic">No notifications yet!</p>
      )}
    </div>
  );
};

export default Notifications;
