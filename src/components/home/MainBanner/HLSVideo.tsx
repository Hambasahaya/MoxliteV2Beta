import Hls from "hls.js";
import { useEffect, useRef, useState } from "react";

export default function HLSVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource("/video/hero_segmented/main_hero_banner.m3u8");
      hls.attachMedia(videoRef.current!);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setLoading(false);
        videoRef.current?.play();
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        console.error("HLS.js error:", data);
      });
    } else if (videoRef.current?.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = "/video/hero_segmented/main_hero_banner.m3u8";
      videoRef.current.addEventListener("loadedmetadata", () => {
        setLoading(false);
        videoRef.current?.play();
      });
    }
  }, []);

  return (
    <>
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black z-[-1]">
          <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <video
        ref={videoRef}
        className="fixed top-0 left-0 w-full h-full object-cover z-[-1]"
        autoPlay
        muted
        loop
        playsInline
        controls={false}
      />
    </>
  );
}
