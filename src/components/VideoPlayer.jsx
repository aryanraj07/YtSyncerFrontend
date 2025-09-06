// src/components/VideoPlayer.jsx
import React, { useEffect, useRef } from "react";
import YouTube from "react-youtube";
import { useSocket } from "../context/SocketContext";

export default function VideoPlayer({ videoUrl, roomId }) {
  const playerRef = useRef(null);
  const socket = useSocket();

  const getYouTubeId = (url) => {
    if (!url || typeof url !== "string") return null; // safe check
    const reg = /(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const m = url.match(reg);
    return m ? m[1] : null;
  };

  const opts = { playerVars: { autoplay: 0 } };

  const onReady = (e) => {
    playerRef.current = e.target;
  };

  const sendControl = (action) => {
    if (!socket) return;
    if (!playerRef.current) return;

    const currentTime = playerRef.current.getCurrentTime();

    // Do local control immediately
    if (action === "play") playerRef.current.playVideo();
    if (action === "pause") playerRef.current.pauseVideo();
    if (action === "seek") playerRef.current.seekTo(currentTime, true);

    // Emit event to other clients
    socket.emit("video:control", { roomId, action, currentTime });
  };
  useEffect(() => {
    // listen to remote control events
    const handler = ({ action, currentTime }) => {
      if (!playerRef.current) return;
      if (action === "play") playerRef.current.playVideo();
      if (action === "pause") playerRef.current.pauseVideo();
      if (action === "seek") playerRef.current.seekTo(currentTime, true);
    };

    if (socket) {
      socket.on("video:control", handler);
    }
    return () => {
      if (socket) socket.off("video:control", handler);
    };
  }, [socket]);

  return (
    <div className="p-4">
      <div className="mb-4 d-flex gap-2">
        <button
          onClick={() => sendControl("play")}
          className=" px-3 py-1 btn btn-success"
        >
          Play
        </button>
        <button
          onClick={() => sendControl("pause")}
          className=" px-3 py-1 btn btn-danger"
        >
          Pause
        </button>
        <button
          onClick={() => sendControl("seek")}
          className="px-3 py-1 btn btn-primary"
        >
          Sync
        </button>
      </div>
      {videoUrl && (
        <YouTube
          videoId={getYouTubeId(videoUrl)}
          onReady={onReady}
          opts={opts}
        />
      )}
    </div>
  );
}
