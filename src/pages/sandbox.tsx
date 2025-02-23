import StrapiTextRenderer from "@/components/common/StrapiTextRenderer";
import { ENV } from "@/constant/ENV";
const sampleHtml =
  "<h2>Selamat Datang di Perusahaan Kami</h2><p>Kami adalah penyedia layanan <strong>terbaik</strong> untuk kebutuhan Anda.</p><ul><li>Kualitas Terjamin</li><li>Harga Terjangkau</li><li>Layanan Terbaik</li></ul><p><img src='http://localhost:3000/next.svg' alt='Perusahaan'></p>";

const sampleMardown =
  "## Selamat Datang di Perusahaan Kami\n\nKami adalah penyedia layanan **terbaik** untuk kebutuhan Anda.\n\n- Kualitas Terjamin\n- Harga Terjangkau\n- Layanan Terbaik\n\n![Perusahaan](http://localhost:3000/next.svg)";

const Sanbox = () => {
  return (
    <>
      <StrapiTextRenderer content={sampleHtml} type="HTML" />
      <StrapiTextRenderer content={sampleMardown} type="MARKDOWN" />
    </>
  );
};

export default Sanbox;
