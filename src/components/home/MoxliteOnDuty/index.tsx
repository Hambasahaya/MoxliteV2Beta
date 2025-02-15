import MoxliteOnDutyCard from "../MoxliteOnDutyCard";

const MoxliteOnDuty = () => {
  return (
    <div
      className="p-[24px] lg:p-[120px]"
      style={{
        background:
          "radial-gradient(116.01% 139.72% at 50% 100%, #020617 33.17%, rgba(8, 31, 59, 1) 62.23%, rgba(62, 156, 146, 1) 100%)",
      }}
    >
      <div className="flex justify-between items-center font-bold text-white mb-[40px]">
        <div>
          <h2 className="text-[36px] lg:text-[48px] font-bold">
            Moxlite On Duty
          </h2>
        </div>
        <div>
          <p className="text-[14px] cursor-pointer font-medium">View All</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-cols-3 gap-6">
        <MoxliteOnDutyCard />
        <MoxliteOnDutyCard />
        <MoxliteOnDutyCard />
      </div>
    </div>
  );
};

export default MoxliteOnDuty;
