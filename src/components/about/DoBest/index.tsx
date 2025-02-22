import Accordion from "@/components/common/Accordion";

const DoBest = () => {
  return (
    <div
      id="advantages"
      className="px-[24px] py-[40px] lg:pt-[120px] lg:pb-[160px] lg:px-[120px] bg-[radial-gradient(65.83%_240.71%_at_50%_-18.88%,#030408_40%,#081F3B_60%,#3E9C92_92.17%)]"
    >
      <h1 className="font-bold text-[36px] lg:text-[48px] text-[#F8FAFC] mb-[18px] lg:mb-[40px]">
        What We Do Best
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-white">
        <Accordion
          title="Product, Supplier & Importer"
          content="It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English."
          invertColor
        />
        <Accordion
          title="Product, Supplier & Importer"
          content="It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English."
          invertColor
        />
        <Accordion
          title="Product, Supplier & Importer"
          content="It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English."
          invertColor
        />
        <Accordion
          title="Product, Supplier & Importer"
          content="It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English."
          invertColor
        />
        <Accordion
          title="Product, Supplier & Importer"
          content="It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English."
          invertColor
        />
      </div>
    </div>
  );
};

export default DoBest;
