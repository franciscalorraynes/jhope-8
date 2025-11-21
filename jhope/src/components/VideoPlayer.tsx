"use client";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function VideoPlayer() {
  const playerRef = useRef<any>(null);
  const [player, setPlayer] = useState<any>(null);
  const [volume, setVolume] = useState(50);

  // Carregar YouTube API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);

      window.onYouTubeIframeAPIReady = loadPlayer;
    } else {
      loadPlayer();
    }
  }, []);

  // Criar player
  function loadPlayer() {
    const newPlayer = new window.YT.Player(playerRef.current, {
      height: "360",
      width: "640",
      videoId: "gdZLi9oWNZg", // 🔥 VIDEO PADRÃO (BTS - Dynamite)
      playerVars: {
        controls: 0,
        rel: 0,
      },
      events: {
        onReady: (event: any) => {
          event.target.setVolume(volume);
        },
      },
    });

    setPlayer(newPlayer);
  }

  // Play
  function handlePlay() {
    player?.playVideo();
  }

  // Pause
  function handlePause() {
    player?.pauseVideo();
  }

  // Volume
  function handleVolumeChange(e: any) {
    const vol = Number(e.target.value);
    setVolume(vol);
    player?.setVolume(vol);
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🎬 Video Player</h2>

      <div style={styles.videoWrapper}>
        <div ref={playerRef} />
      </div>

      <div style={styles.controls}>
        <button style={styles.button} onClick={handlePlay}>▶ Play</button>
        <button style={styles.button} onClick={handlePause}>⏸ Pause</button>

        <div style={styles.volumeBox}>
          <span>🔊</span>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
          />
        </div>
      </div>
    </div>
  );
}

// 🎨 Estilos inline (você pode mover para globals.css depois)
const styles: any = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    padding: "20px",
  },
  title: {
    color: "#fff",
  },
  videoWrapper: {
    width: "100%",
    maxWidth: "700px",
    aspectRatio: "16/9",
    background: "#111",
  },
  controls: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
  },
  button: {
    padding: "10px 20px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    background: "#7c4dff",
    color: "white",
    fontWeight: "bold",
  },
  volumeBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
};
