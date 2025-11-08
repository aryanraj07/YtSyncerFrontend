import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";
import InviteFriendsModal from "./InviteFreindsModal";

const RoomLists = () => {
  const [rooms, setRooms] = useState([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [name, setName] = useState("");
  const [showInvite, setShowInvite] = useState(false);
  const navigate = useNavigate();
  const [newRoomId, setNewRoomId] = useState(null);
  const createRoom = async () => {
    try {
      const res = await api.post("/room", { name, videoUrl });
      setNewRoomId(res.data.data._id);
      setShowInvite(true);

      // navigate(`/room/${res.data.data._id}`);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchRooms = async () => {
      const res = await api.get("/room");
      setRooms(res.data.rooms || []);
    };
    fetchRooms();
  }, []);

  return (
    <>
      <div className="max-w-md ">
        <div className="space-y-4 mb-8">
          <input
            type="text"
            placeholder="Enter Room Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="inputBox w-full"
          />
          <input
            type="text"
            placeholder="Enter YouTube Video URL"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="inputBox w-full"
          />
          <button className="btnPrimary w-full" onClick={createRoom}>
            Create Room
          </button>
        </div>
      </div>
      <h2>Your Rooms</h2>
      <ul>
        {rooms.map((room) => (
          <li key={room._id} className="mb-2">
            <button
              onClick={() => navigate(`/room/${room._id}`)}
              className="text-blue-600"
            >
              {room.name}
            </button>
          </li>
        ))}
      </ul>
      {showInvite && (
        <InviteFriendsModal
          roomId={newRoomId}
          onClose={() => {
            setShowInvite(false);
            navigate(`/room/${newRoomId}`);
          }}
        />
      )}
    </>
  );
};

export default RoomLists;
