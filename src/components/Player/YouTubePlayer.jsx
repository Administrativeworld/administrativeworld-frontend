import { useRef, useState } from "react";
import PropTypes from "prop-types";
import YouTube from "react-youtube";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Volume2, Maximize } from "lucide-react";

const YouTubePlayer = ({ videoId, onEnd, onReady, onStateChange }) => {
  const playerRef = useRef(null);
  const [playerState, setPlayerState] = useState({
    playing: false,
    currentTime: 0,
    duration: 0,
    loaded: 0,
  });

  const opts = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 0,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
    },
  };

  const handlePlayerReady = (event) => {
    playerRef.current = event.target;
    onReady(event);
  };

  const handleStateChange = (event) => {
    setPlayerState((prev) => ({
      ...prev,
      playing: event.data === 1,
    }));

    if (event.data === 1) {
      const interval = setInterval(() => {
        if (playerRef.current) {
          setPlayerState((prev) => ({
            ...prev,
            currentTime: playerRef.current.getCurrentTime(),
            duration: playerRef.current.getDuration(),
            loaded: playerRef.current.getVideoLoadedFraction() * 100,
          }));
        }
      }, 1000);

      return () => clearInterval(interval);
    }

    if (event.data === 0) {
      onEnd();
    }

    onStateChange(event);
  };

  const togglePlayPause = () => {
    if (playerRef.current) {
      if (playerState.playing) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    }
  };

  const restartVideo = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(0);
      playerRef.current.playVideo();
    }
  };

  const toggleFullscreen = () => {
    if (playerRef.current) {
      playerRef.current.getIframe().requestFullscreen();
    }
  };

  return (
    <div className="relative w-full h-full">
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={handlePlayerReady}
        onStateChange={handleStateChange}
        className="w-full h-full"
      />

      {/* Custom video controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 flex justify-between items-center text-white opacity-0 transition-opacity hover:opacity-100">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/20"
            onClick={togglePlayPause}
          >
            {playerState.playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/20"
            onClick={restartVideo}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <div className="text-xs ml-2">
            {Math.floor(playerState.currentTime / 60)}:
            {Math.floor(playerState.currentTime % 60).toString().padStart(2, "0")} /
            {Math.floor(playerState.duration / 60)}:
            {Math.floor(playerState.duration % 60).toString().padStart(2, "0")}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20">
            <Volume2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/20"
            onClick={toggleFullscreen}
          >
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

YouTubePlayer.propTypes = {
  videoId: PropTypes.string.isRequired,
  onEnd: PropTypes.func.isRequired,
  onReady: PropTypes.func.isRequired,
  onStateChange: PropTypes.func.isRequired,
};

export default YouTubePlayer;
