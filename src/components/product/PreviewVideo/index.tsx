const PreviewVideo = () => {
  return (
    <div
      id="prev-vid"
      className="px-[24px] py-[40px] lg:px-[120px] lg:py-[80px] border border-[#CBD5E1]"
    >
      <h2 className="text-[30px] text-black font-bold mb-[40px]">
        Preview Video
      </h2>

      <div className="w-full h-[228px] lg:h-[675px]">
        <iframe
          className="w-full h-full rounded-lg border-none"
          src="https://www.youtube.com/embed/6Izpt-aqMFM"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default PreviewVideo;
