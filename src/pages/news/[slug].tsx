import Layout from "@/components/common/Layout";
import NewsCarousel from "@/components/news/NewsCarousel";

const NewsDetail = () => {
  return (
    <Layout>
      <div className="p-[24px] lg:pt-[56px] lg:pb-[80px] lg:px-[120px] w-full flex flex-col items-center">
        <NewsCarousel />
        <div className="w-full lg:max-w-[640px] my-[40px]">
          <p className="mb-[8px]">31 Januari 2025</p>
          <h1 className="text-[36px] lg:text-[48px] font-bold leading-[1.2em]">
            Robe Helps Lift the Mask in South Africa
          </h1>
        </div>
        <div className="w-full lg:max-w-[640px]">
          The second series of The Masked Singer SA was one of the most
          successful music TV shows of 2024, broadcast on SABC, and featuring an
          outstanding production lighting design created by two of the country's
          most talented LDs, Ryan Lombard and Joshua Cutts, based around the
          core components of 150 Robe moving lights.All technical production was
          supplied by Blond Productions for the series which was recorded at the
          Studios on Harley facility in Randburg, Greater Johannesburg.Ryan and
          Josh had previously worked together on Family Feud and SAs Got Talent
          so it made sense for them to once again pool their expansive
          imaginations for The Masked Singer SA to give it a unique look and
          identity.With Josh coming in as a designer as well, Ryan made some
          changes to the original design based on what he had learned during
          season 1, which Josh looked at, adding some of his own ideas and
          finishing touches and building multiple fresh new lighting looks
          bursting with drama and style.Josh oversaw the lighting set up,
          programmed, and started off operating the run of shows as Ryan was
          busy with prior commitments, then Ryan took over once these were
          completed.The Robe set up included 12 x ESPRITES, 12 x MMX Spots and
          12 x 600E Beams, 48 x LEDBeam 100s, 12 x miniPointes, 24 x CycFX4s,
          six LEDWash 300s, 24 x LEDBeam 350s newly purchased by Blond for the
          production 12 x iSpiider wash-beams and four MegaPointes plus a
          RoboSpot system controlling selected ESPRITES.Ryan has worked
          extensively with Robe products throughout the last decade of his
        </div>
      </div>
    </Layout>
  );
};

export default NewsDetail;
