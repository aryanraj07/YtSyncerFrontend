import React, { useCallback, useEffect, useRef, useState } from "react";
import api from "../../api/axiosInstance";
import { toast } from "react-toastify";
import { useSocket } from "../../context/SocketContext";
import { useNotifications } from "../../context/NotificationContext";

const FriendList = () => {
  const socket = useSocket();
  const { handleResponse } = useNotifications();
  console.log("Socket ID in FriendList:", socket?.id);
  const [searchedFriends, setSearchedFriends] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [friends, setFriends] = useState([]);

  const fetchFriends = async () => {
    try {
      const response = await api.get("/friend");
      setFriends(response?.data?.data);
    } catch (err) {
      console.log(err);
    }
  };
  const searchFriend = useCallback(
    async (username) => {
      try {
        if (searchInput) {
          const res = await api.get(`/friend/search?username=${username}`);
          setSearchedFriends(res?.data?.data);
          setShowDropdown(true);
        }
      } catch (err) {
        console.log(err);
        setSearchedFriends([]);
        setShowDropdown(false);
      }
    },
    [searchInput]
  );
  const handleSendFreindRequest = async (friendUser, receiverId) => {
    setSearchedFriends((prev) => {
      prev.map((f) => (f._id === receiverId ? { ...f, requestSent: true } : f));
    });
    try {
      const res = await api.post(`/friend/friend-request`, {
        username: friendUser,
      });

      if (res?.data?.statusCode == 200) {
        toast.success(res.data.message);
      }
    if (!socket || !socket.connected) {
      console.warn("⚠️ Socket not connected yet");
      return;
    }
      const notification = res.data.data;
      console.log("📤 Emitting event: notification:friend-request", {
        receiverId,
        notification,
      });
      socket.emit("notification:friend-request", {
        receiverId,
        notification,
      });
      socket.once("error", (err) =>
        console.log("❌ Socket error received:", err)
      );
    } catch (err) {
      toast.error(err.message);
      setSearchedFriends((prev) => {
        prev.map((f) =>
          f._id === receiverId ? { ...f, requestSent: false } : f
        );
      });
      console.log(err);
    }
  };
  useEffect(() => {
    fetchFriends();
  }, []);
  const timerRef = useRef(null);
  useEffect(() => {
    if (!searchInput) {
      setSearchedFriends([]);
      setShowDropdown(false);
      return;
    }
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      searchFriend(searchInput);
    }, 500);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [searchInput, timerRef]);

  return (
    <div className="relative w-full max-w-md mx-auto mt-4">
      <input
        type="text"
        className="w-full  px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:Search Friends"
        value={searchInput}
        placeholder="Search "
        onChange={(e) => setSearchInput(e.target.value)}
      />
      {friends.length == 0 ? (
        <p className="text-violet-400">No friends yet Add friends</p>
      ) : (
        <ul className="mt-3 bg-indigo-950 rounded-lg divide-y divide-indigo-800">
          {friends.map((friend) => (
            <li
              key={friend._id}
              className="flex items-center justify-between px-4 py-2 hover:bg-indigo-900 transition"
            >
              <img
                src={friend?.avatar}
                alt={friend?.username || "friend"}
                className="h-10 w-10 rounded-full object-cover border border-indigo-700"
              />
              <span className="text-white font-medium">{friend?.username}</span>
            </li>
          ))}
        </ul>
      )}
      {/*<button className="bg-violet-700 text-whtie p-3 rounded">Search</button>*/}
      {showDropdown && searchedFriends?.length > 0 && (
        <div className="absolute bg-black rounded-lg z-10 mt-2 w-full shadow-lg  ">
          {searchedFriends.map((friend, index) => (
            <div
              className="flex justify-between items-center hover:bg-gray-900 p-2 "
              key={index}
            >
              <span>{friend.username}</span>
              <button
                disabled={friend.requestSent}
                className={`px-3 py-2 rounded ${
                  friend.requestSent || friend.isFriend
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-green-500"
                } text-white`}
                onClick={async () => {
                  if (friend.requestPendingFromThem) {
                    const result = await handleResponse(
                      friend.friendRequestId,
                      "accepted",
                      null,
                      friend._id
                    );
                    if (result.success) {
                      // ✅ Update state only after backend confirms
                      setSearchedFriends((prev) =>
                        prev.map((f) =>
                          f._id === friend._id
                            ? {
                                ...f,
                                isFriend: true,
                                requestPendingFromThem: false,
                              }
                            : f
                        )
                      );
                    } else {
                      toast.error("Failed to accept request, try again.");
                    }
                  } else if (!friend.requestSent) {
                    handleSendFreindRequest(friend.username, friend._id);
                  }
                }}
              >
                {friend?.isFriend
                  ? "Friends"
                  : friend?.requestSent
                  ? "Requested"
                  : friend?.requestPendingFromThem
                  ? "Accept"
                  : "Add"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendList;
