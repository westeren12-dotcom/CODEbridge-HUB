import React, { useState, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, SkipForward, SkipBack } from "lucide-react";

export default function VideoPlayer({ videoUrl, title, onComplete }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  const togglePlay = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const pct = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(pct);
      if (pct >= 90 && onComplete) {
        onComplete();
      }
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    if (videoRef.current) {
      videoRef.current.currentTime = pct * videoRef.current.duration;
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const skip = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  // Placeholder display when no video URL provided
  if (!videoUrl) {
    return (
      <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-700">
        <div className="aspect-video flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 gap-4">
          <div className="w-20 h-20 rounded-full bg-blue-600/20 flex items-center justify-center border border-blue-500/30">
            <Play size={36} className="text-blue-400 ml-1" />
          </div>
          <div className="text-center">
            <p className="text-white font-semibold text-lg">{title}</p>
            <p className="text-slate-400 text-sm mt-1">Add your video URL to firebase or src/data/lessons.js</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black rounded-2xl overflow-hidden border border-slate-700 group">
      <div className="relative">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full aspect-video object-contain bg-black"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
          muted={muted}
          onVolumeChange={() => {
            if (videoRef.current) setVolume(videoRef.current.volume);
          }}
        />
        {/* Click to play/pause overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          onClick={togglePlay}
        >
          {!playing && (
            <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center border border-white/30">
              <Play size={28} className="text-white ml-1" />
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform">
          {/* Progress bar */}
          <div
            className="w-full h-1.5 bg-slate-600 rounded-full mb-3 cursor-pointer hover:h-2.5 transition-all"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => skip(-10)} className="text-white/80 hover:text-white p-1">
                <SkipBack size={18} />
              </button>
              <button onClick={togglePlay} className="text-white w-8 h-8 flex items-center justify-center">
                {playing ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />}
              </button>
              <button onClick={() => skip(10)} className="text-white/80 hover:text-white p-1">
                <SkipForward size={18} />
              </button>
              <button onClick={() => { setMuted(!muted); }} className="text-white/80 hover:text-white p-1">
                {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <span className="text-white/60 text-xs">
                {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(duration)}
              </span>
            </div>
            <button
              onClick={() => videoRef.current?.requestFullscreen?.()}
              className="text-white/80 hover:text-white p-1"
            >
              <Maximize size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}