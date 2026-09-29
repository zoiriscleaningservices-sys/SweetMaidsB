import { Metadata } from 'next';
import { getTemplate, extractSections, localizedReplace, generatePageImageSchema } from '@/lib/template';
import { formatName } from '@/lib/data';
import { BUSINESS_INFO, CANONICAL_HOST, REGIONS } from '@/config/site-structure';

export const metadata: Metadata = {
  title: 'Professional Cleaning Services Across Florida | Sweet Maid',
  description: 'Looking for trusted house cleaning & maid services across Florida? Sweet Maid offers professional home cleaning, deep cleaning, and turnover services statewide. Request a free estimate today.',
  alternates: {
    canonical: `${CANONICAL_HOST}/`,
  },
  openGraph: {
    title: 'Professional Cleaning Services Across Florida | Sweet Maid',
    description: 'Looking for trusted house cleaning & maid services across Florida? Sweet Maid offers professional home cleaning, deep cleaning, and turnover services statewide. Request a free estimate today.',
    url: `${CANONICAL_HOST}/`,
    type: 'website',
    images: [`${CANONICAL_HOST}/images/logo.png`],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Professional Cleaning Services Across Florida | Sweet Maid',
    description: 'Looking for trusted house cleaning & maid services across Florida? Sweet Maid offers professional home cleaning, deep cleaning, and turnover services statewide. Request a free estimate today.',
    images: [`${CANONICAL_HOST}/images/logo.png`],
  }
};

export default function HomePage() {
  const cleanName = 'Florida';
  const locationSlug = 'home';
  
  const rawHtml = getTemplate('home');
  if (!rawHtml) return <div>Home template missing</div>;

  const bodyContent = extractSections(rawHtml);
  // Pass is_sub_page as false to keep the `/images/` path correctly referenced
  const localizedHtml = localizedReplace(bodyContent, cleanName, locationSlug, false, 'house-cleaning');

  const floridaPlaces = Array.from(
    new Set(
      Object.values(REGIONS).flatMap(r => r.placesServed)
    )
  ).slice(0, 45);

  const homeSchemas = [
    {
      "@context": "https://schema.org",
      "@type": ["LocalBusiness", "CleaningService", "Organization"],
      "name": BUSINESS_INFO.name,
      "description": "Family-owned house cleaning and professional maid service serving homes, condominiums, vacation rentals, and commercial spaces across Florida.",
      "url": `${CANONICAL_HOST}/`,
      "logo": `${CANONICAL_HOST}/images/logo.png`,
      "image": generatePageImageSchema(cleanName, "House Cleaning"),
      "telephone": BUSINESS_INFO.phone,
      "email": BUSINESS_INFO.email,
      "priceRange": "$$",
      "sameAs": BUSINESS_INFO.socialProfiles,
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "08:00",
        "closes": "18:00"
      },
      "areaServed": floridaPlaces.map(place => ({
        "@type": "Place",
        "name": `${place}, FL`
      })),
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Cleaning Services",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "House Cleaning Services" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Deep Cleaning Services" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Move-In & Move-Out Cleaning" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Airbnb Vacation Rental Cleaning" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Commercial Cleaning & Janitorial" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Carpet Cleaning Service" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Window Cleaning Service" } }
        ]
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What cleaning services does Sweet Maid provide across Florida?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Sweet Maid Cleaning Service provides comprehensive residential and commercial cleaning throughout Florida, including recurring maid services, deep cleaning resets, move-in and move-out turnovers, Airbnb vacation rental turnovers, and office janitorial care."
          }
        },
        {
          "@type": "Question",
          "name": "How do I request a quote or book cleaning service in Florida?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can request a free estimate anywhere in Florida by calling our dispatch team directly at (941) 222-2080 or booking online through our website."
          }
        },
        {
          "@type": "Question",
          "name": "What areas and cities in Florida does Sweet Maid serve?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We proudly serve homeowners and businesses across Florida, including Bradenton, Sarasota, Tampa, St. Petersburg, Orlando, Miami, Fort Lauderdale, West Palm Beach, Jacksonville, St. Augustine, and surrounding communities."
          }
        },
        {
          "@type": "Question",
          "name": "Do I need to supply cleaning products or equipment?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our professional cleaning teams arrive fully equipped with commercial HEPA vacuums, microfiber cloths, and eco-friendly cleaning solutions needed to service your home."
          }
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": BUSINESS_INFO.name,
      "url": `${CANONICAL_HOST}/`,
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${CANONICAL_HOST}/locations/?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchemas) }}
      />
      <div dangerouslySetInnerHTML={{ __html: localizedHtml }} />
    </>
  );
}
