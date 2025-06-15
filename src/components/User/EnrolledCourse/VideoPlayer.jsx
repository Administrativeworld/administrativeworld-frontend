import { useState, useRef, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Volume2, Maximize } from "lucide-react";
import YouTubePlayer from "./Player/YouTubePlayer";

function VideoPlayer({
  activeVideoDetails,
  onVideoEnd,
  isNextDisabled
}) {
  const [playerState, setPlayerState] = useState({
    playing: false,
    currentTime: 0,
    duration: 0,
  });
  const playerRef = useRef(null);

  const onPlayerReady = useCallback((event) => {
    playerRef.current = event.target;
  }, []);

  const onPlayerStateChange = useCallback((event) => {
    if (!window.YT) return;

    setPlayerState(prev => ({
      ...prev,
      playing: event.data === window.YT.PlayerState.PLAYING,
    }));

    if (event.data === window.YT.PlayerState.PLAYING) {
      if (playerRef.current?.updateInterval) {
        clearInterval(playerRef.current.updateInterval);
      }
      playerRef.current.updateInterval = setInterval(() => {
        if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
          setPlayerState(prev => ({
            ...prev,
            currentTime: playerRef.current.getCurrentTime() || 0,
            duration: playerRef.current.getDuration() || 0,
          }));
        }
      }, 1000);
    } else {
      if (playerRef.current?.updateInterval) {
        clearInterval(playerRef.current.updateInterval);
        playerRef.current.updateInterval = null;
      }
    }

    if (event.data === window.YT.PlayerState.ENDED) {
      if (!isNextDisabled()) {
        onVideoEnd();
      }
    }
  }, [activeVideoDetails.id, onVideoEnd, isNextDisabled]);

  useEffect(() => {
    if (playerRef.current?.updateInterval) {
      clearInterval(playerRef.current.updateInterval);
      playerRef.current.updateInterval = null;
    }
    setPlayerState({ playing: false, currentTime: 0, duration: 0 });
  }, [activeVideoDetails.id]);

  const togglePlayPause = () => {
    if (playerRef.current) {
      try {
        if (playerState.playing) {
          if (typeof playerRef.current.pauseVideo === 'function') {
            playerRef.current.pauseVideo();
          }
        } else {
          if (typeof playerRef.current.playVideo === 'function') {
            playerRef.current.playVideo();
          }
        }
      } catch (error) {
        console.error('Error controlling video playback:', error);
      }
    }
  };

  const restartVideo = () => {
    if (playerRef.current) {
      try {
        if (typeof playerRef.current.seekTo === 'function') {
          playerRef.current.seekTo(0);
        }
        if (typeof playerRef.current.playVideo === 'function') {
          playerRef.current.playVideo();
        }
      } catch (error) {
        console.error('Error restarting video:', error);
      }
    }
  };

  const toggleFullscreen = () => {
    if (playerRef.current?.getIframe) {
      try {
        const iframe = playerRef.current.getIframe();
        if (iframe?.requestFullscreen) {
          iframe.requestFullscreen();
        } else if (iframe?.mozRequestFullScreen) {
          iframe.mozRequestFullScreen();
        } else if (iframe?.webkitRequestFullscreen) {
          iframe.webkitRequestFullscreen();
        } else if (iframe?.msRequestFullscreen) {
          iframe.msRequestFullscreen();
        }
      } catch (error) {
        console.error('Error toggling fullscreen:', error);
      }
    }
  };

  return (
    <Card className="mb-6 overflow-hidden">
      <div className="aspect-video bg-black relative w-full">
        {activeVideoDetails.id ? (
          <div className="relative w-full h-full">
            <YouTubePlayer
              videoId={activeVideoDetails.id}
              onReady={onPlayerReady}
              onStateChange={onPlayerStateChange}
            />

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 flex justify-between items-center text-white opacity-0 transition-opacity duration-300 hover:opacity-100">
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
                  {Math.floor(playerState.currentTime % 60).toString().padStart(2, "0")} /{" "}
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
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center p-6">
              <Play className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Select a lesson to start learning</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

export default VideoPlayer;