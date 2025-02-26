const Maintenance = () => {
  return (
    <div
      style={{
        background:
          "radial-gradient(116.0069560407267% 139.71710502756912% at 50% 0%, #020617 33.16662609577179%, rgba(8, 31, 59, 1) 62.23050355911255%, rgba(62, 156, 146, 1) 100%)",
      }}
      className="h-screen w-screen flex flex-col justify-center items-center text-white p-6 md:p-0"
    >
      <img src="/icon/moxlite-icon-1.svg" className="h-[36px] lg:h-[58px]" />
      <h1 className="text-[18px] lg:text-[48px] font-bold mt-6 mb-2 text-center">
        Good things are on the way
      </h1>
      <p className="text-[12px] lg:text-[30px] text-center">
        Our site is getting some tune up. We'll be back soon.
      </p>
      <p className="text-[12px] lg:text-[30px] text-center">
        Thanks for your patience!
      </p>
    </div>
  );
};

export default Maintenance;
