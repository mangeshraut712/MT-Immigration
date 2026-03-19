import { firmConfig } from "@/config/firm";
import { siteUrl } from "@/config/site";

const [addressLocality = "New York", addressRegion = "NY"] =
  firmConfig.contact.city.split(",").map((value) => value.trim());

export function SiteStructuredData() {
  const organizationId = new URL("#organization", siteUrl).toString();
  const websiteId = new URL("#website", siteUrl).toString();
  const legalServiceId = new URL("#legal-service", siteUrl).toString();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: firmConfig.name,
        url: siteUrl.toString(),
        logo: new URL(firmConfig.brand.logoSrc, siteUrl).toString(),
        email: firmConfig.contact.email,
        telephone: firmConfig.contact.phoneDisplay,
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: siteUrl.toString(),
        name: firmConfig.name,
        inLanguage: "en-US",
        publisher: {
          "@id": organizationId,
        },
      },
      {
        "@type": "LegalService",
        "@id": legalServiceId,
        name: firmConfig.name,
        url: siteUrl.toString(),
        image: new URL(firmConfig.brand.logoSrc, siteUrl).toString(),
        areaServed: "US",
        serviceType: [
          "Immigration law",
          "Visa applications",
          "Green card matters",
          "Humanitarian immigration matters",
        ],
        address: {
          "@type": "PostalAddress",
          addressLocality,
          addressRegion,
          addressCountry: "US",
        },
        provider: {
          "@id": organizationId,
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
