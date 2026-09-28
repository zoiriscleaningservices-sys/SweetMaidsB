import { Metadata } from 'next';
import { getTemplate, extractSections, localizedReplace, generatePageImageSchema } from '@/lib/template';
import { formatName } from '@/lib/data';
import { BUSINESS_INFO, CANONICAL_HOST, REGIONS } from '@/config/site-structure';

export const metadata: Metadata = {
  title: 'House Cleaning & Maid Services in Bradenton, FL | Sweet Maid',
  description: 'Looking for trusted house cleaning in Bradenton, FL? Sweet Maid offers maid services, deep cleaning, and move-out cleans. Request a free estimate today.',
  alternates: {
    canonical: `${CANONICAL_HOST}/`,
  },
  openGraph: {
    title: 'House Cleaning & Maid Services in Bradenton, FL | Sweet Maid',
    description: 'Looking for trusted house cleaning in Bradenton, FL? Sweet Maid offers maid services, deep cleaning, and move-out cleans. Request a free estimate today.',
    url: `${CANONICAL_HOST}/`,
    type: 'website',
    images: [`${CANONICAL_HOST}/images/logo.png`],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'House Cleaning & Maid Services in Bradenton, FL | Sweet Maid',
    description: 'Looking for trusted house cleaning in Bradenton, FL? Sweet Maid offers maid services, deep cleaning, and move-out cleans. Request a free estimate today.',
    images: [`${CANONICAL_HOST}/images/logo.png`],
  }
};

export default function HomePage() {
  const cleanName = formatName('Bradenton');
  const locationSlug = 'bradenton-fl';
  
  const rawHtml = getTemplate('home');
  if (!rawHtml) return <div>Home template missing</div>;

  const bodyContent = extractSections(rawHtml);
  // Pass is_sub_page as false to keep the `/images/` path correctly referenced
  const localizedHtml = localizedReplace(bodyContent, cleanName, locationSlug, false, 'house-cleaning');

  const manateePlaces = REGIONS.manatee.placesServed.slice(0, 25);

  const homeSchemas = [
    {
      "@context": "https://schema.org",
      "@type": ["LocalBusiness", "CleaningService", "Organization"],
      "name": BUSINESS_INFO.name,
      "description": "Family-owned house cleaning and maid service serving Bradenton and surrounding Manatee County communities.",
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
      "areaServed": manateePlaces.map(place => ({
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
          "name": "What cleaning services does Sweet Maid provide in Bradenton?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Sweet Maid Cleaning Service provides comprehensive residential and commercial cleaning in Bradenton, including recurring maid services, deep cleaning resets, move-in and move-out turnovers, Airbnb vacation rental cleaning, and office janitorial care."
          }
        },
        {
          "@type": "Question",
          "name": "How do I request a quote or book cleaning in Bradenton?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can request a free estimate by calling our team directly at (941) 222-2080 or submitting your home details through our online quote request form."
          }
        },
        {
          "@type": "Question",
          "name": "What days and hours is Sweet Maid open in Bradenton?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our customer service and dispatch teams operate Monday through Saturday from 8:00 AM to 6:00 PM."
          }
        },
        {
          "@type": "Question",
          "name": "Do I need to supply cleaning products or equipment?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our cleaning teams arrive equipped with vacuums, microfiber cloths, and cleaning solutions needed to service your home."
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
