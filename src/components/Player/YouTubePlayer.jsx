import React, { useEffect, useRef } from "react";

// This component encapsulates the YouTube IFrame Player API logic
const YouTubePlayer = ({ videoId, onReady, onStateChange }) => {
  const playerDivRef = useRef(null);
  const playerInstanceRef = useRef(null);

  useEffect(() => {
    // 1. Load the YouTube IFrame Player API script if not already loaded
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    // 2. This function creates an <iframe> (and YouTube player)
    //    after the API code downloads.
    //    It's exposed globally by the YouTube API script.
    window.onYouTubeIframeAPIReady = () => {
      if (playerDivRef.current && videoId) {
        playerInstanceRef.current = new window.YT.Player(playerDivRef.current, {
          videoId: videoId,
          playerVars: {
            playsinline: 1, // Play inline on iOS
            autoplay: 0, // No autoplay by default; handle play/pause via custom controls
            controls: 0, // Hide YouTube's native controls
            rel: 0, // Hide related videos at the end
            modestbranding: 1, // Hide the YouTube logo in the control bar
            showinfo: 0, // Hides video title and uploader info (deprecated but good practice)
            iv_load_policy: 3, // Hide video annotations
            fs: 0, // Hide fullscreen button (we provide our own)
            disablekb: 1, // Disable keyboard controls
            cc_load_policy: 0, // Hide closed captions by default
            mute: 0, // Ensure not muted by default, though you can control volume with API
          },
          events: {
            onReady: (event) => {
              if (onReady) onReady(event);
            },
            onStateChange: (event) => {
              if (onStateChange) onStateChange(event);
            },
            onError: (event) => {
              console.error("YouTube Player Error:", event.data);
            }
          },
        });
      }
    };

    // If API is already loaded (e.g., component re-renders), manually call onYouTubeIframeAPIReady
    // This handles cases where the component mounts after the script has already loaded.
    if (window.YT && window.YT.Player) {
      window.onYouTubeIframeAPIReady();
    }

    // Cleanup function to destroy the player when component unmounts or videoId changes
    return () => {
      if (playerInstanceRef.current) {
        try {
          // Pause the video first (stopVideo doesn't exist, use pauseVideo instead)
          if (typeof playerInstanceRef.current.pauseVideo === 'function') {
            playerInstanceRef.current.pauseVideo();
          }

          // Clear any intervals that might be running
          if (playerInstanceRef.current.updateInterval) {
            clearInterval(playerInstanceRef.current.updateInterval);
          }

          // Destroy the player instance to prevent memory leaks
          if (typeof playerInstanceRef.current.destroy === 'function') {
            playerInstanceRef.current.destroy();
          }

          playerInstanceRef.current = null;
        } catch (error) {
          console.error("Error cleaning up YouTube player:", error);
          // Even if there's an error, set the ref to null
          playerInstanceRef.current = null;
        }
      }

      // If the component unmounts, remove the global onYouTubeIframeAPIReady to avoid conflicts
      // This is important if you have multiple instances or complex routing
      if (window.onYouTubeIframeAPIReady) {
        delete window.onYouTubeIframeAPIReady;
      }
    };
  }, [videoId, onReady, onStateChange]); // Re-run effect if videoId, onReady, or onStateChange changes

  return (
    <div className="absolute top-0 left-0 w-full h-full">
      <div id="youtube-player-container" ref={playerDivRef} className="w-full h-full" />
    </div>
  );
};

export default YouTubePlayer;