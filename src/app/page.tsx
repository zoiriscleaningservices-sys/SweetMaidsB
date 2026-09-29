import { Metadata } from 'next';
import { getTemplate, extractSections, localizedReplace, generatePageImageSchema } from '@/lib/template';
import { BUSINESS_INFO, CANONICAL_HOST, REGIONS } from '@/config/site-structure';

export const metadata: Metadata = {
  title: 'Cleaning Services in Florida | Sweet Maid Cleaning Service',
  description: 'Family-owned house cleaning, deep cleaning, and move-out maid services across Florida. Professional home care tailored to Florida living. Get a quote today.',
  alternates: {
    canonical: `${CANONICAL_HOST}/`,
  },
  openGraph: {
    title: 'Cleaning Services in Florida | Sweet Maid Cleaning Service',
    description: 'Family-owned house cleaning, deep cleaning, and move-out maid services across Florida. Professional home care tailored to Florida living. Get a quote today.',
    url: `${CANONICAL_HOST}/`,
    type: 'website',
    images: [`${CANONICAL_HOST}/images/logo.png`],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cleaning Services in Florida | Sweet Maid Cleaning Service',
    description: 'Family-owned house cleaning, deep cleaning, and move-out maid services across Florida. Professional home care tailored to Florida living. Get a quote today.',
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

  const readyRegionPlaces = Array.from(
    new Set(
      Object.values(REGIONS)
        .filter(r => r.ready)
        .flatMap(r => r.placesServed)
    )
  ).slice(0, 50);

  const homeSchemas = [
    {
      "@context": "https://schema.org",
      "@type": ["LocalBusiness", "CleaningService", "Organization"],
      "name": BUSINESS_INFO.name,
      "description": "Family-owned house cleaning, deep cleaning, and move-out maid services across Florida. Professional home care tailored to Florida living.",
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
      "areaServed": readyRegionPlaces.map(place => ({
        "@type": "Place",
        "name": `${place}, FL`
      })),
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Cleaning Services",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "House Cleaning Services" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Deep Cleaning Services" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Recurring Maid Service" } },
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
          "name": "How does Florida's humidity and coastal climate impact home cleaning needs?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Florida's subtropical humidity and salt air accelerate dust accumulation, AC vent mildew spores, and window oxidation. Sweet Maid utilizes specialized microfiber damp-dusting and HEPA filtration systems designed specifically for coastal Florida environments."
          }
        },
        {
          "@type": "Question",
          "name": "Do you offer seasonal opening and closing cleans for Florida snowbirds?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. We offer tailored seasonal cleaning protocols for second homes and winter residents across Florida, including running water lines, detailing bathrooms, vacuuming upholstery, and refreshing closed properties prior to arrival."
          }
        },
        {
          "@type": "Question",
          "name": "Can you manage turnover cleaning for short-term vacation rentals and Airbnbs?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Our Florida cleaning teams specialize in prompt same-day turnover cleaning for Airbnbs and vacation rentals, including complete linen resets, kitchen degreasing, bathroom sanitization, and guest-ready staging."
          }
        },
        {
          "@type": "Question",
          "name": "How do your regional service areas work across Florida?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We operate local cleaning hubs throughout Florida's ready service regions—including Tampa Bay, Sarasota, Manatee, Greater Orlando, South Florida, Jacksonville, and the Florida Keys. Each hub dispatches vetted cleaning specialists directly to your neighborhood."
          }
        },
        {
          "@type": "Question",
          "name": "How do I schedule an appointment or request an estimate?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can request a free estimate directly online through our website quote form or call our central Florida dispatch line at (941) 222-2080. We confirm your property details and customize your cleaning checklist before every visit."
          }
        },
        {
          "@type": "Question",
          "name": "What are your cleaning rates and pricing across Florida?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our upfront pricing starts from $180 for standard house cleaning, $250 for deep cleaning resets, $350 for move-in and move-out turnovers, and $200 for commercial office janitorial services. Exact quotes depend on your home's square footage and specific cleaning preferences."
          }
        }
      ]
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
