// InviteFriendsModal.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import { toast } from "react-toastify";
import { useSocket } from "../../context/SocketContext";

const InviteFriendsModal = ({ roomId, onClose }) => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);

  const socket = useSocket();
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await api.get("/friend");
        setFriends(res.data.data || []);
      } catch (err) {
        console.log(err);
      }
    };
    fetchFriends();
  }, []);

  const handleInvite = async (friendId) => {
    if (!socket || !socket.connected) {
      toast.warn("Socket not connected yet. Retrying...");
      await new Promise((resolve) => {
        const check = setInterval(() => {
          if (socket?.connected) {
            clearInterval(check);
            resolve();
          }
        }, 500);
      });
    }

    setLoading(true);

    try {
      await api.post(`/room/${roomId}/invite`, { friendId });
      toast.success("Invitation sent!");
    } catch (err) {
      console.log(err);
      alert("Error sending invite");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white rounded-xl p-6 w-[400px] shadow-lg relative">
        <h2 className="text-xl font-semibold mb-4">Invite Friends</h2>
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500"
        >
          ✕
        </button>

        {friends.length > 0 ? (
          <ul className="space-y-3">
            {friends.map((friend) => (
              <li
                key={friend._id}
                className="flex items-center justify-around p-2 hover:bg-violet-50 dark:hover:bg-violet-800/30 rounded-lg transition-all"
              >
                <div className="flex items-start gap-3 ">
                  <span>
                    <img
                      src={friend?.avatar}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover border border-violet-300"
                    />
                  </span>
                  <span className="font-semibold text-violet-700 dark:text-violet-300">
                    {friend?.username}
                  </span>
                </div>
                <button
                  className="bg-blue-500 text-white text-sm px-3 py-1 rounded"
                  onClick={() => handleInvite(friend._id)}
                  disabled={loading}
                >
                  {loading ? "..." : "Invite"}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No friends found.</p>
        )}

        <hr className="my-4" />
        <div>
          <p className="text-sm text-gray-500 mb-2">Or share link manually:</p>
          <input
            type="text"
            readOnly
            value={`${window.location.origin}/room/${roomId}`}
            className="w-full border rounded px-2 py-1"
          />
          <button
            className="text-sm text-blue-600 mt-2"
            onClick={() => {
              navigator.clipboard.writeText(
                `${window.location.origin}/room/${roomId}`
              );
              alert("Link copied!");
            }}
          >
            Copy Link
          </button>
        </div>
      </div>
    </div>
  );
};

export default InviteFriendsModal;
