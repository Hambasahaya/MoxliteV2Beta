import { NextSeo } from "next-seo";
import { ProductJsonLd, ArticleJsonLd, BreadcrumbJsonLd } from "@/components/common/StructuredData";
import {
  generateProductSEO,
  generateBreadcrumb,
} from "@/lib/seo-generator";
import { getDefaultSEO } from "@/constant/seo.config";

/**
 * CONTOH: Halaman Product dengan SEO Lengkap
 * 
 * Implementasi:
 * 1. NextSeo untuk meta tags
 * 2. ProductJsonLd untuk structured data
 * 3. BreadcrumbJsonLd untuk breadcrumb
 */

const ExampleProductPage = () => {
  const productName = "Lampu Panggung LED 200W";
  const productSlug = "lampu-panggung-led-200w";
  const productCategory = "Lampu Panggung";
  const productImage = "https://moxlite.com/image/lampu-200w.jpg";
  const price = 5000000;

  const seoData = generateProductSEO(
    productName,
    productCategory,
    "Lampu panggung LED 200W profesional untuk konser, event, dan pertunjukan. Tahan lama dan hemat energi.",
    productSlug
  );

  const breadcrumbData = generateBreadcrumb(`/product/${productSlug}`);

  return (
    <>
      <NextSeo {...seoData} />
      <ProductJsonLd
        productName={productName}
        description="Lampu panggung LED 200W profesional untuk konser, event, dan pertunjukan"
        images={[productImage]}
        brand="Moxlite"
        price={price}
        priceCurrency="IDR"
        availability="InStock"
        rating={4.8}
        reviewCount={150}
        url={`https://moxlite.com/product/${productSlug}`}
      />
      <BreadcrumbJsonLd items={breadcrumbData} />

      <main>
        <h1>{productName}</h1>
        <p>Rp {price.toLocaleString("id-ID")}</p>
        {/* Rest of product page content */}
      </main>
    </>
  );
};

export default ExampleProductPage;

/**
 * CONTOH: Halaman Article dengan SEO
 */

const ExampleArticlePage = () => {
  const articleTitle = "Tips Memilih Lampu Panggung yang Tepat untuk Event Anda";
  const articleSlug = "tips-memilih-lampu-panggung";
  const publishDate = "2024-01-15T10:00:00Z";

  const seoData = generateProductSEO(
    articleTitle,
    "Blog",
    "Panduan lengkap memilih lampu panggung yang sesuai dengan kebutuhan event Anda.",
    articleSlug
  );

  return (
    <>
      <NextSeo {...seoData} />
      <ArticleJsonLd
        title={articleTitle}
        description="Panduan lengkap memilih lampu panggung yang sesuai dengan kebutuhan event Anda."
        image="https://moxlite.com/image/article-banner.jpg"
        url={`https://moxlite.com/news/${articleSlug}`}
        datePublished={publishDate}
        author="Tim Moxlite"
        publisherName="Moxlite"
      />

      <main>
        <h1>{articleTitle}</h1>
        <p>Published: {new Date(publishDate).toLocaleDateString("id-ID")}</p>
        {/* Rest of article content */}
      </main>
    </>
  );
};

/**
 * CARA PENGGUNAAN - IMPLEMENTASI DI PAGE ANDA:
 * 
 * 1. IMPORT YANG DIPERLUKAN:
 * ```
 * import { NextSeo } from "next-seo";
 * import { ProductJsonLd, ArticleJsonLd, BreadcrumbJsonLd, FAQJsonLd } from "@/components/common/StructuredData";
 * import { generateProductSEO, generateArticleSEO, generateBreadcrumb } from "@/lib/seo-generator";
 * ```
 * 
 * 2. UNTUK HALAMAN PRODUK:
 * ```
 * const ProductPage = () => {
 *   const seoData = generateProductSEO("Nama Produk", "Kategori", "Deskripsi", "slug");
 *   return (
 *     <>
 *       <NextSeo {...seoData} />
 *       <ProductJsonLd
 *         productName="Nama Produk"
 *         description="Deskripsi"
 *         images={["url-gambar"]}
 *         brand="Moxlite"
 *         price={harga}
 *       />
 *       {/* Page content */}
 *     </>
 *   );
 * };
 * ```
 * 
 * 3. UNTUK HALAMAN CITY/KOTA:
 * ```
 * import { generateCitySEO, generateCityStructuredData } from "@/lib/seo-generator";
 * 
 * const CityPage = ({ city }) => {
 *   const seoData = generateCitySEO(city);
 *   const schema = generateCityStructuredData(city);
 *   
 *   return (
 *     <>
 *       <NextSeo {...seoData} />
 *       <StructuredData data={schema} />
 *     </>
 *   );
 * };
 * ```
 * 
 * 4. UNTUK HALAMAN FAQ:
 * ```
 * <FAQJsonLd 
 *   faqs={[
 *     { question: "Q1", answer: "A1" },
 *     { question: "Q2", answer: "A2" }
 *   ]}
 * />
 * ```
 */
