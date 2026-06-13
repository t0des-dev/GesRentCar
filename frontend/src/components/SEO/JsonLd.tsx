import Script from "next/script";

interface JsonLdProps {
  agency: {
    name?: string;
    slogan?: string;
    phone?: string;
    email?: string;
  };
}

export default function JsonLd({ agency }: JsonLdProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AutoRental",
    "name": agency?.name || "VectoriaRentCar",
    "description": agency?.slogan || "Premium Car Rental Experience",
    "url": typeof window !== "undefined" ? window.location.origin : "https://vectoria-rent.com",
    "telephone": agency?.phone || "+212600000000",
    "email": agency?.email || "contact@vectoria-rent.com",
    "image": typeof window !== "undefined" ? `${window.location.origin}/og-image.jpg` : "",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Marrakech",
      "addressCountry": "MA"
    },
    "priceRange": "$$$"
  };

  return (
    <Script
      id="json-ld-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
