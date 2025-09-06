import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";

const Dashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const createRoom = async () => {
    try {
      const res = await api.post("/room", { name, videoUrl });
      navigate(`/room/${res.data.data._id}`);
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
    <div>
      <h2>Your ROom</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Create Room"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 border mr-2"
        />
        <input
          type="text"
          placeholder="Enter Yt vieo url"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="p-2 border mr-2"
        />
        <button onClick={createRoom}>Create Room</button>
      </div>
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
    </div>
  );
};

export default Dashboard;
