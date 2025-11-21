"use client";
import { useState, useRef, useEffect } from "react";

const MusicPlayer = () => {
  const tracks = [
    {
      title: "Hope World",
      artist: "J-Hope",
      album: "Hope World",
      src: "/1. Hope World.mp3",
      cover: "/hopeworld.jpg",
    },
    {
      title: "P.O.P (Piece Of Peace) pt.1",
      artist: "J-Hope",
      album: "Hope World",
      src: "/2. P.O.P (Piece Of Peace) pt.1.mp3",
      cover: "/hopeworld.jpg",
    },
    {
      title: "Hangsang (feat. Supreme Boi)",
      artist: "J-Hope",
      album: "Hope World",
      src: "/hangsang.mp3",
      cover: "/hopeworld.jpg",
    },
  ];

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.6);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = tracks[currentTrackIndex];

  // Atualiza tempo e duração da faixa
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const updateTime = () => setCurrentTime(audio.currentTime);
    const setAudioData = () => setDuration(audio.duration || 0);
    const handleEnded = () => nextTrack();

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", setAudioData);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", setAudioData);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentTrackIndex]);

  // Atualiza volume e reprodução ao trocar de música
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = isMuted ? 0 : volume;
      if (isPlaying) audio.play();
    }
  }, [currentTrackIndex, volume, isMuted]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) audio.pause();
    else audio.play();
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    setIsPlaying(true);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (audio) audio.currentTime = Number(e.target.value);
    setCurrentTime(Number(e.target.value));
  };

  // Avança +10s
  const forward10 = () => {
    const audio = audioRef.current;
    if (audio) audio.currentTime = Math.min(audio.currentTime + 10, duration);
  };

  // Retrocede -10s
  const rewind10 = () => {
    const audio = audioRef.current;
    if (audio) audio.currentTime = Math.max(audio.currentTime - 10, 0);
  };

  // Mute / Unmute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Formatação de tempo (m:ss)
  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  // Seleciona música e começa a tocar
  const selectTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
    setTimeout(() => audioRef.current?.play(), 100);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-white"
      style={{
        background: "linear-gradient(135deg,#7625ff,#c14bff,#ff56b3)",
      }}
    >
      <div className="bg-purple-800/40 backdrop-blur-lg p-6 rounded-3xl shadow-2xl w-[400px] text-center">
        {/* capa */}
        <img
          src={currentTrack.cover}
          alt={currentTrack.title}
          className="w-40 h-40 mx-auto rounded-2xl shadow-lg mb-4"
        />

        {/* info */}
        <h2 className="text-2xl font-bold mb-1">{currentTrack.title}</h2>
        <p className="text-pink-300 text-sm">{currentTrack.artist}</p>
        <p className="text-purple-400 text-xs mb-4">{currentTrack.album}</p>

        {/* progresso */}
        <div className="flex items-center justify-between text-xs text-gray-300 mb-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={currentTime}
          onChange={handleSliderChange}
          className="w-full accent-pink-400 mb-3"
        />

        {/* novos botões no estilo Spotify */}
        <div className="flex flex-col items-center justify-center gap-3 mb-3">
          <div className="flex items-center justify-center gap-8">
            {/* Voltar 10s */}
            <button
              onClick={rewind10}
              className="flex flex-col items-center justify-center text-sm text-white/80 hover:text-pink-300 transition"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-pink-600/30">
                <span className="text-lg font-bold">↺</span>
              </div>
              <span className="text-[10px] -mt-1">10s</span>
            </button>

            {/* Botão central Play/Pause */}
            <button
              onClick={togglePlay}
              className="relative flex items-center justify-center w-16 h-16 rounded-full 
                         bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600
                         hover:from-pink-600 hover:to-purple-700 
                         shadow-[0_0_20px_rgba(255,0,150,0.4)]
                         transition-all duration-300 transform hover:scale-110"
            >
              <span className="text-white text-3xl">
                {isPlaying ? "⏸" : "▶"}
              </span>
              <span className="absolute inset-0 rounded-full border border-white/20 animate-pulse"></span>
            </button>

            {/* Avançar 10s */}
            <button
              onClick={forward10}
              className="flex flex-col items-center justify-center text-sm text-white/80 hover:text-pink-300 transition"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-pink-600/30">
                <span className="text-lg font-bold">↻</span>
              </div>
              <span className="text-[10px] -mt-1">10s</span>
            </button>
          </div>

          {/* Próxima e anterior */}
          <div className="flex items-center justify-center gap-6 mt-2">
            <button onClick={prevTrack} className="text-lg hover:text-pink-300 transition">
              ⏮
            </button>
            <button onClick={nextTrack} className="text-lg hover:text-pink-300 transition">
              ⏭
            </button>
          </div>
        </div>

        {/* volume */}
        <div className="flex items-center gap-2 justify-center mt-3">
          <button onClick={toggleMute} className="text-xl hover:text-pink-300 transition">
            {isMuted ? "🔇" : "🔉"}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            disabled={isMuted}
            className="w-32 accent-pink-400"
          />
        </div>

        {/* lista de músicas */}
        <div className="mt-6 text-left">
          <h3 className="text-lg font-semibold mb-2 text-pink-300">
            Lista de músicas
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {tracks.map((track, index) => (
              <div
                key={index}
                onClick={() => selectTrack(index)}
                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  index === currentTrackIndex
                    ? "bg-pink-600/30 shadow-inner"
                    : "hover:bg-purple-700/40"
                }`}
              >
                <img
                  src={track.cover}
                  alt={track.title}
                  className="w-10 h-10 rounded-md object-cover"
                />
                <div>
                  <p className="text-sm font-medium">{track.title}</p>
                  <p className="text-xs text-purple-300">{track.artist}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <audio ref={audioRef} src={currentTrack.src}></audio>
    </div>
  );
};

export default MusicPlayer;
