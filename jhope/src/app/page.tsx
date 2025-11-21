// import MusicPlayer from '@/components/VideoPlayer';

// export default function Home() {
//   const song = {
//     title: "Hangsang",
//     artist: "J Hope",
//     album: "Hangsang",
//     duration: 210, // 3:30 em segundos
//     coverUrl: "/jhope.jpeg",
//     audioUrl: "/hangsang.mp3" // Placeholder - será substituído por áudio real
//   };

//   return (
//     <div>
//       <MusicPlayer song={song} />
//     </div>
//   );
// }
import VideoPlayer from "@/components/VideoPlayer";

export default function Home() {
  return (
    <main>
      <VideoPlayer />
    </main>
  );
}
