import { Metadata } from 'next';
import { getTemplate, extractSections, localizedReplace } from '@/lib/template';
import { formatName } from '@/lib/data';

export const metadata: Metadata = {
  title: '#1 Rated House Cleaning & Maid Services in Florida | Sweet Maid',
  description: 'Looking for top-rated, reliable, and insured house cleaning services in Florida? Sweet Maid offers professional deep cleaning, move-out cleaning, and recurring maid services with 100% satisfaction guaranteed. Get your free quote today!',
  keywords: 'cleaning services Florida, house cleaning Bradenton, maid service Tampa, deep cleaning Miami, Orlando cleaning company, Sarasota house cleaning',
  alternates: {
    canonical: 'https://sweetmaidcleaning.com/',
  },
  openGraph: {
    title: '#1 Rated House Cleaning & Maid Services in Florida | Sweet Maid',
    description: 'Looking for top-rated, reliable, and insured house cleaning services in Florida? Sweet Maid offers professional deep cleaning, move-out cleaning, and recurring maid services.',
    url: 'https://sweetmaidcleaning.com/',
    type: 'website',
    images: ['https://i.ibb.co/QSD3Ydt/image.jpg'],
  },
};

export default function HomePage() {
  const cleanName = formatName('Bradenton');
  const locationSlug = 'bradenton-fl';
  
  const rawHtml = getTemplate('home');
  if (!rawHtml) return <div>Home template missing</div>;

  const bodyContent = extractSections(rawHtml);
  // Pass is_sub_page as false to keep the `/images/` path correctly referenced 
  const localizedHtml = localizedReplace(bodyContent, cleanName, locationSlug, false, 'house-cleaning');

  const homeSchemas = [
    {
      "@context": "https://schema.org",
      "@type": ["LocalBusiness", "CleaningService", "HomeAndConstructionBusiness"],
      "name": "Sweet Maid Cleaning Service",
      "alternateName": "Sweet Maid Florida",
      "description": "Florida's #1 premier residential and commercial cleaning service provider. Trusted, insured, and 100% satisfaction guaranteed across all Florida cities.",
      "url": "https://sweetmaidcleaning.com/",
      "logo": "https://sweetmaidcleaning.com/images/logo.png",
      "image": "https://i.ibb.co/QSD3Ydt/image.jpg",
      "telephone": "(941) 222-2080",
      "priceRange": "$$",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Serving Bradenton, Sarasota, Tampa, Miami & All of Florida",
        "addressLocality": "Bradenton",
        "addressRegion": "FL",
        "postalCode": "34205",
        "addressCountry": "US"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 27.4989,
        "longitude": -82.5748
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "07:00",
        "closes": "20:00"
      },
      "areaServed": {
        "@type": "State",
        "name": "Florida"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "284",
        "bestRating": "5",
        "worstRating": "1"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Cleaning Services",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "House Cleaning Services" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Deep Cleaning Services" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Move-In & Move-Out Cleaning" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Airbnb & Vacation Rental Cleaning" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Commercial & Office Janitorial Services" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Post-Construction Cleaning" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Pressure Washing & Window Cleaning" } }
        ]
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What cleaning services does Sweet Maid provide in Florida?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Sweet Maid provides comprehensive residential and commercial cleaning across Florida, including standard house cleaning, deep cleaning, move-in/move-out turnover, Airbnb vacation rental management, post-construction cleaning, office janitorial services, window washing, and pressure washing."
          }
        },
        {
          "@type": "Question",
          "name": "Are Sweet Maid cleaners licensed, background-checked, and insured?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, 100% of Sweet Maid cleaners and cleaning crews are fully licensed, insured, and thoroughly background-checked for your complete peace of mind and safety."
          }
        },
        {
          "@type": "Question",
          "name": "How do I get a free quote or book a cleaning service in Florida?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can get an instant free estimate by calling us directly at (941) 222-2080, filling out our online quote form, or selecting your city on our Locations directory page."
          }
        },
        {
          "@type": "Question",
          "name": "Do you offer a satisfaction guarantee on cleaning services?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! We proudly offer a 100% Satisfaction Guarantee. If any area of your cleaning is not done to your complete satisfaction, simply notify us within 24 hours and our team will return to re-clean the area free of charge."
          }
        },
        {
          "@type": "Question",
          "name": "Do I need to provide cleaning supplies and equipment?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No, our professional cleaning team brings all commercial-grade, eco-friendly supplies and state-of-the-art equipment needed to make your home or business sparkle."
          }
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Sweet Maid Cleaning Service",
      "url": "https://sweetmaidcleaning.com/",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://sweetmaidcleaning.com/locations/?q={search_term_string}",
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
