import React from "react";
import myVideo from "./video.mp4";

function VideoPlayer({ className = "" }) {
  return (
    <div className={`overflow-hidden rounded-xl border-2 border-white bg-black shadow-lg ${className}`}>
      <video src={myVideo} autoPlay loop muted playsInline className="w-full rounded-xl" />
    </div>
  );
}

export default VideoPlayer;
