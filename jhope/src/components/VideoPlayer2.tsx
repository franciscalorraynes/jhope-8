"use client";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const playlist = [
  { id: "gdZLi9oWNZg", title: "BTS – Dynamite" },
  { id: "MBdVXkSdhwU", title: "BTS – Boy With Luv" },
  { id: "WMweEpGlu_U", title: "BTS – Butter" },
];

export default function VideoPlayer() {
  const playerRef = useRef<any>(null);
  const [player, setPlayer] = useState<any>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [volume, setVolume] = useState(50);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [intervalId, setIntervalId] = useState<any>(null);

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
      videoId: playlist[currentIndex].id,
      playerVars: {
        controls: 0,
        rel: 0,
      },
      events: {
        onReady: (event: any) => {
          event.target.setVolume(volume);
          setDuration(event.target.getDuration());
          startTimeTracking(event.target);
        },
        onStateChange: handleStateChange,
      },
    });

    setPlayer(newPlayer);
  }

  // Atualizar tempo atual
  function startTimeTracking(p: any) {
    const id = setInterval(() => {
      const time = p.getCurrentTime();
      setCurrentTime(time);
      setDuration(p.getDuration());
    }, 500);

    setIntervalId(id);
  }

  // Quando o vídeo acabar → próximo
  function handleStateChange(event: any) {
    if (event.data === window.YT.PlayerState.ENDED) {
      handleNextVideo();
    }
  }

  // Trocar vídeo
  function loadVideo(index: number) {
    if (!player) return;
    setCurrentIndex(index);
    player.loadVideoById(playlist[index].id);
    setCurrentTime(0);
  }

  // Controles
  function handlePlay() {
    player?.playVideo();
  }

  function handlePause() {
    player?.pauseVideo();
  }

  // Volume
  function handleVolumeChange(e: any) {
    const vol = Number(e.target.value);
    setVolume(vol);
    player?.setVolume(vol);
  }

  // Alterar posição
  function handleSeek(e: any) {
    const newTime = Number(e.target.value);
    player?.seekTo(newTime, true);
    setCurrentTime(newTime);
  }

  // +10s e -10s
  function handleForward() {
    player?.seekTo(player.getCurrentTime() + 10, true);
  }

  function handleBackward() {
    player?.seekTo(player.getCurrentTime() - 10, true);
  }

  // Próximo e anterior
  function handleNextVideo() {
    const next = (currentIndex + 1) % playlist.length;
    loadVideo(next);
  }

  function handlePreviousVideo() {
    const prev = (currentIndex - 1 + playlist.length) % playlist.length;
    loadVideo(prev);
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🎬 Player com Playlist</h2>

      {/* LISTA DE VÍDEOS */}
      <ul style={styles.list}>
        {playlist.map((video, index) => (
          <li
            key={video.id}
            style={{
              ...styles.listItem,
              background: index === currentIndex ? "#7c4dff" : "#333",
            }}
            onClick={() => loadVideo(index)}
          >
            {video.title}
          </li>
        ))}
      </ul>

      <div style={styles.videoWrapper}>
        <div ref={playerRef} />
      </div>

      {/* TEMPO ATUAL */}
      <p style={{ color: "#fff" }}>
        ⏱ {formatTime(currentTime)} / {formatTime(duration)}
      </p>

      {/* BARRA DE PROGRESSO */}
      <input
        type="range"
        min="0"
        max={duration}
        value={currentTime}
        onChange={handleSeek}
        style={{ width: "80%" }}
      />

      {/* CONTROLES */}
      <div style={styles.controls}>
        <button style={styles.button} onClick={handleBackward}>⏪ -10s</button>
        <button style={styles.button} onClick={handlePlay}>▶ Play</button>
        <button style={styles.button} onClick={handlePause}>⏸ Pause</button>
        <button style={styles.button} onClick={handleForward}>⏩ +10s</button>
      </div>

      {/* NAVEGAÇÃO */}
      <div style={styles.controls}>
        <button style={styles.button} onClick={handlePreviousVideo}>⬅ Anterior</button>
        <button style={styles.button} onClick={handleNextVideo}>➡ Próximo</button>
      </div>

      {/* VOLUME */}
      <div style={styles.volumeBox}>
        <span style={{ color: "#fff" }}>🔊</span>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
        />
      </div>
    </div>
  );
}

// Formatador de tempo
function formatTime(seconds: number) {
  if (!seconds) return "0:00";
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${min}:${sec}`;
}

// Estilo
const styles: any = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "15px",
    padding: "20px",
  },
  title: { color: "#fff" },
  list: {
    width: "80%",
    padding: 0,
    listStyle: "none",
    border: "1px solid #555",
    borderRadius: "6px",
    overflow: "hidden",
  },
  listItem: {
    padding: "10px",
    cursor: "pointer",
    borderBottom: "1px solid #444",
    color: "white",
  },
  videoWrapper: {
    width: "100%",
    maxWidth: "700px",
    aspectRatio: "16/9",
    background: "#000",
  },
  controls: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  button: {
    padding: "8px 15px",
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
