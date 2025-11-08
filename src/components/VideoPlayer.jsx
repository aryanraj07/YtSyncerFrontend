// src/components/VideoPlayer.jsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import YouTube from "react-youtube";
import { useSocket } from "../context/SocketContext";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
export default function VideoPlayer({ videoUrl, roomId }) {
  const isRemoteAction = useRef(false);

  const playerRef = useRef(null);
  const socket = useSocket();
  const lastTimeRef = useRef(0);
  const seekTimeout = useRef(null);
  const syncTimeout = useRef(null);
  const [showSyncing, setShowSyncing] = useState(false);
  const [timeDelta, setTimeDelta] = useState(0);
  const syncTimeoutRef = useRef(null);
  const getYouTubeId = (url) => {
    if (!url || typeof url !== "string") return null;
    const reg = /(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const m = url.match(reg);
    return m ? m[1] : null;
  };

  const opts = {
    width: "100%",
    height: "100%",
    playerVars: { autoplay: 0 },
  };

  const onReady = (e) => {
    playerRef.current = e.target;

    if (socket && roomId) {
      socket.emit("request:state", roomId);
    }
  };
  const showSync = useCallback((delta = 0) => {
    setTimeDelta(delta.toFixed(1));
    setShowSyncing(true);
    clearTimeout(syncTimeoutRef.current);
    syncTimeoutRef.current = setTimeout(() => setShowSyncing(false), 1500);
  }, []);
  const emitSeek = useCallback(
    (time) => {
      clearTimeout(seekTimeout.current);
      seekTimeout.current = setTimeout(() => {
        socket.emit("video:control", {
          roomId,
          action: "seek",
          currentTime: time,
        });
      }, 500);
    },
    [socket, roomId]
  );
  const sendControl = (action) => {
    if (!socket || !playerRef.current) return;
    const currentTime = playerRef.current.getCurrentTime();

    if (action === "play") playerRef.current.playVideo();
    if (action === "pause") playerRef.current.pauseVideo();
    if (action === "seek") playerRef.current.seekTo(currentTime, true);

    socket.emit("video:control", { roomId, action, currentTime });
  };

  const onStateChange = (e) => {
    const player = e.target;
    const state = e.data;
    if (isRemoteAction.current) return;

    // Get current time
    const currentTime = player.getCurrentTime();

    // Detect manual seek (big jump)
    if (Math.abs(currentTime - lastTimeRef.current) > 2) {
      emitSeek(currentTime);
    }

    // Detect play/pause state
    if (state === window.YT.PlayerState.PLAYING) {
      socket.emit("video:control", { roomId, action: "play", currentTime });
    }
    if (state === window.YT.PlayerState.PAUSED) {
      socket.emit("video:control", { roomId, action: "pause", currentTime });
    }

    // Save for next comparison
    lastTimeRef.current = currentTime;
  };
  const smoothSync = (targetTime) => {
    if (!playerRef.current) return;
    const current = playerRef.current.getCurrentTime();
    const diff = Math.abs(current - targetTime);

    if (diff > 1.5) {
      toast.info("⏱ Syncing video...", { autoClose: 1000 });
      playerRef.current.seekTo(targetTime, true);
    }
  };
  useEffect(() => {
    if (!socket) return;

    // ✅ Sync incoming control actions
    const onControl = ({ action, currentTime, by, socketId }) => {
      if (!playerRef.current) return;
      if (socket.id === socketId) return;
      isRemoteAction.current = true;
      if (action === "play") playerRef.current.playVideo();
      if (action === "pause") playerRef.current.pauseVideo();
      if (action === "seek") playerRef.current.seekTo(currentTime, true);
      if (by) toast.info(`${by} ${action}ed the video`);
      setTimeout(() => (isRemoteAction.current = false), 500);
    };

    // ✅ When backend sends saved state (on join or reconnect)
    const onVideoState = (state) => {
      if (!playerRef.current || !state) return;
      if (state.currentTime) {
        const delta = state.currentTime - playerRef.current.getCurrentTime();
        // seekTo() is a YouTube IFrame Player API method that lets you jump (seek) the video to a specific timestamp.
        playerRef.current.seekTo(state.currentTime, true);
        showSync(delta);
      }
      // 🧩 Calculate how much time has passed since state was saved
      const now = Date.now();
      const elapsed = (now - (state.updatedAt || now)) / 1000;
      let syncedTime =
        state.action === "play"
          ? state.currentTime + elapsed
          : state.currentTime;
      clearTimeout(syncTimeout.current);
      syncTimeout.current = setTimeout(() => {
        smoothSync(syncedTime);

        if (state.action === "play") playerRef.current.playVideo();
        if (state.action === "pause") playerRef.current.pauseVideo();
      }, 300);
      if (state.currentTime) playerRef.current.seekTo(state.currentTime, true);
      if (state.action === "play") playerRef.current.playVideo();
      if (state.action === "pause") playerRef.current.pauseVideo();
    };

    socket.on("video:control", onControl);
    socket.on("video:state", onVideoState);

    return () => {
      socket.off("video:control", onControl);
      socket.off("video:state", onVideoState);
    };
  }, [socket]);

  return (
    <div className="p-4">
      {/* Controls */}
      <div className="mb-4 mt-2 pt-2 flex flex-wrap gap-2 min-h-[100px]">
        <button
          onClick={() => sendControl("play")}
          className="px-3 py-1 btn btn-success"
        >
          Play
        </button>
        <button
          onClick={() => sendControl("pause")}
          className="px-3 py-1 btn btn-danger"
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
      {/* ✅ Responsive YouTube Wrapper */}
      <div className="relative w-full pb-[56.25%] h-0 overflow-hidden rounded-lg shadow-md">
        {videoUrl && (
          <div className="absolute top-0 left-0 w-full h-full">
            <YouTube
              videoId={getYouTubeId(videoUrl)}
              onReady={onReady}
              onStateChange={onStateChange}
              opts={opts}
              className="w-full h-full"
            />
          </div>
        )}
      </div>
    </div>
  );
}
