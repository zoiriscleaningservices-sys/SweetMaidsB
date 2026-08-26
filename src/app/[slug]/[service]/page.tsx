import { Metadata } from 'next';
import { serviceSlugs, resolveAnyLocation, formatName } from '@/lib/data';
import { miamiBrowardSlugs } from '@/lib/miami_broward_slugs';
import { getTemplate, extractSections, localizedReplace, serviceH1Map } from '@/lib/template';
import { generateSeoContentPack } from '@/lib/seo_engine';


export async function generateMetadata({ params }: { params: Promise<{ slug: string, service: string }> }): Promise<Metadata> {
  const { slug, service } = await params;
  const locData = resolveAnyLocation(slug);
  if (!locData) return {};

  const cleanName = formatName(locData.name);
  const seoPack = generateSeoContentPack(cleanName, slug, service, service);

  const title = seoPack.metaTitle;
  const desc = seoPack.heroSub.replace(/<[^>]+>/g, '');
  const keywords = seoPack.dailySearchKeywords.join(', ');

  return {
    title,
    description: desc,
    keywords,
    alternates: {
      canonical: `https://sweetmaidcleaning.com/${slug}/${service}/`,
    },
    openGraph: {
      title,
      description: desc,
      url: `https://sweetmaidcleaning.com/${slug}/${service}/`,
      type: 'website',
      images: ['https://i.ibb.co/QSD3Ydt/image.jpg']
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
      images: ['https://i.ibb.co/QSD3Ydt/image.jpg']
    }
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string, service: string }> }) {
  const { slug, service } = await params;
  
  const locData = resolveAnyLocation(slug);
  if (!locData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 text-center">
        <div className="max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Location Not Found</h1>
          <p className="text-gray-600 mb-6">We couldn't find the location you're looking for.</p>
          <a href="/" className="inline-block bg-pink-400 hover:bg-pink-500 text-white font-bold px-6 py-3 rounded-full transition-colors">
            Return Home
          </a>
        </div>
      </div>
    );
  }

  const cleanName = formatName(locData.name);

  const rawHtml = getTemplate(service);
  if (!rawHtml) return <div>Service template missing</div>;

  const bodyContent = extractSections(rawHtml);
  const localizedHtml = localizedReplace(bodyContent, cleanName, slug, true, service);
  
  let serviceNameForSchema = formatName(service.replace(/-/g, ' '));
  if (!serviceNameForSchema.toLowerCase().endsWith('services')) {
    serviceNameForSchema += ' Services';
  }

  // Dynamically generate the localized JSON-LD schema with FAQ
  const isMiamiOrBroward = miamiBrowardSlugs.includes(slug);
  const isMiami = slug === 'miami-fl';

  const schemaStr = JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": ["LocalBusiness", "CleaningService", "Organization"],
      "name": isMiamiOrBroward ? `Sweet Maid - ${serviceNameForSchema} ${cleanName}` : `${serviceNameForSchema} in ${cleanName}, FL - Sweet Maid`,
      "description": isMiamiOrBroward 
        ? `Sweet Maid Offers Customized ${serviceNameForSchema} in ${cleanName}, Florida. Call (305) 851-6959 Today for a Free Estimate by Trusted & Insured Pros!`
        : `Looking for the best ${serviceNameForSchema.toLowerCase()} in ${cleanName}, FL? Sweet Maid provides top-rated, reliable ${serviceNameForSchema.toLowerCase()} directly to your location in ${cleanName}.`,
      "url": `https://sweetmaidcleaning.com/${slug}/${service}/`,
      "telephone": isMiamiOrBroward ? "(305) 851-6959" : "(941) 222-2080",
      "image": "https://i.ibb.co/QSD3Ydt/image.jpg",
      "priceRange": "$$",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": `Serving ${cleanName} & Surrounding Florida Areas`,
        "addressLocality": cleanName,
        "addressRegion": "FL",
        "addressCountry": "US"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": locData.lat,
        "longitude": locData.lng
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "284",
        "bestRating": "5",
        "worstRating": "1"
      },
      "areaServed": isMiami ? [
        { "@type": "AdministrativeArea", "name": "Miami" },
        { "@type": "AdministrativeArea", "name": "Miami-Dade County" },
        { "@type": "AdministrativeArea", "name": "Brickell" },
        { "@type": "AdministrativeArea", "name": "Coral Gables" },
        { "@type": "AdministrativeArea", "name": "Coconut Grove" },
        { "@type": "AdministrativeArea", "name": "Wynwood" },
        { "@type": "AdministrativeArea", "name": "Doral" },
        { "@type": "AdministrativeArea", "name": "Miami Beach" }
      ] : {
        "@type": "City",
        "name": cleanName
      },
      "makesOffer": {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": isMiamiOrBroward ? `${serviceNameForSchema} in ${cleanName}, FL` : `${serviceNameForSchema} in ${cleanName}, FL`
        }
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": isMiamiOrBroward ? `Who provides the best ${serviceNameForSchema.toLowerCase()} in ${cleanName}, FL?` : `Who provides the best ${serviceNameForSchema.toLowerCase()} in ${cleanName}, FL?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": isMiamiOrBroward 
              ? (isMiami 
                  ? `Sweet Maid is widely recognized as the #1 top-rated provider for ${serviceNameForSchema.toLowerCase()} in Miami, Florida. Our expert team delivers highly affordable, meticulous, and professional customized ${serviceNameForSchema.toLowerCase()} perfectly tailored for both residential and commercial properties across Miami, including Brickell, Coral Gables, Coconut Grove, Wynwood, Doral, and Miami Beach. All of our cleaners are trusted, insured, and backed by a 100% satisfaction guarantee.`
                  : `Sweet Maid is widely recognized as the #1 top-rated provider for ${serviceNameForSchema.toLowerCase()} in ${cleanName}, Florida. Our expert team delivers highly affordable, meticulous, and professional customized ${serviceNameForSchema.toLowerCase()} perfectly tailored for both residential and commercial properties across ${cleanName}. All of our cleaners are trusted, insured, and backed by a 100% satisfaction guarantee.`)
              : `Sweet Maid is widely recognized as the #1 top-rated provider for ${serviceNameForSchema.toLowerCase()} in ${cleanName}, Florida. Our expert team delivers highly affordable, meticulous, and professional ${serviceNameForSchema.toLowerCase()} perfectly tailored for both residential and commercial properties in ${cleanName}. We stand by our work with a 100% satisfaction guarantee.`
          }
        },
        {
          "@type": "Question",
          "name": isMiamiOrBroward ? `How much does customized ${serviceNameForSchema.toLowerCase()} cost in ${cleanName}?` : `How much does professional ${serviceNameForSchema.toLowerCase()} cost near me in ${cleanName}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": isMiamiOrBroward 
              ? `The cost for customized ${serviceNameForSchema.toLowerCase()} in ${cleanName} varies depending on your specific needs, the size of your home, and the frequency of the service. Sweet Maid offers highly competitive and transparent pricing for expert ${serviceNameForSchema.toLowerCase()} in ${cleanName}, Florida. Contact us at (305) 851-6959 today for a fast, free local estimate!`
              : `The cost for affordable ${serviceNameForSchema.toLowerCase()} in ${cleanName} varies depending on your specific needs, the size of your property, and the frequency of the service. Sweet Maid offers highly competitive and transparent pricing for expert ${serviceNameForSchema.toLowerCase()} in ${cleanName}, FL. Contact us today for a fast, free local estimate!`
          }
        },
        {
          "@type": "Question",
          "name": isMiamiOrBroward ? `Are there reliable ${serviceNameForSchema.toLowerCase()} experts in ${cleanName}, Florida?` : `Are there reliable ${serviceNameForSchema.toLowerCase()} experts in ${cleanName}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": isMiamiOrBroward 
              ? `Yes! Sweet Maid employs the most reliable, highly-trained, and vetted local experts for ${serviceNameForSchema.toLowerCase()} in the ${cleanName} area. We specialize in comprehensive, eco-friendly ${serviceNameForSchema.toLowerCase()} solutions tailored specifically for luxury homes, condos, and businesses in ${cleanName}, FL. All of our cleaners are fully vetted, insured, and bonded.`
              : `Yes! Sweet Maid employs the most reliable and highly-trained local experts for ${serviceNameForSchema.toLowerCase()} in the ${cleanName} area. We specialize in comprehensive, eco-friendly ${serviceNameForSchema.toLowerCase()} solutions tailored specifically for homes and businesses in ${cleanName}, Florida. All of our cleaners are fully vetted, insured, and bonded.`
          }
        },
        {
          "@type": "Question",
          "name": isMiamiOrBroward ? `What is included in your ${cleanName} ${serviceNameForSchema.toLowerCase()}?` : `What is included in your ${serviceNameForSchema.toLowerCase()} in ${cleanName}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": isMiamiOrBroward 
              ? `Our premium ${serviceNameForSchema.toLowerCase()} in ${cleanName} includes a comprehensive, top-to-bottom cleaning process. Depending on the exact package you choose (deep cleaning, recurring service, or move-out cleaning), we cover everything from deep scrubbing and kitchen sanitization to dusting baseboards, vacuuming, and polishing surfaces. Sweet Maid ensures every corner of your ${cleanName} home receives the highest standard of care.`
              : `Our premium ${serviceNameForSchema.toLowerCase()} in ${cleanName} includes a comprehensive, top-to-bottom approach. Depending on the exact package you choose, we cover everything from deep scrubbing and sanitization to dusting and polishing. Sweet Maid ensures every corner of your ${cleanName} property receives the highest standard of care.`
          }
        },
        {
          "@type": "Question",
          "name": isMiamiOrBroward ? `Do you use eco-friendly products for ${serviceNameForSchema.toLowerCase()} in ${cleanName}, FL?` : `Do you use eco-friendly products for ${serviceNameForSchema.toLowerCase()} in ${cleanName}, FL?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": isMiamiOrBroward 
              ? `Absolutely. Sweet Maid prioritizes your health and safety by using premium, eco-friendly, and pet-safe cleaning products for all our ${serviceNameForSchema.toLowerCase()} across ${cleanName}, Florida. We deliver a spotless shine without the use of harsh, toxic, or dangerous chemicals.`
              : `Absolutely. Sweet Maid prioritizes your health and safety by using premium, eco-friendly, and pet-safe cleaning products for all our ${serviceNameForSchema.toLowerCase()} across ${cleanName}, Florida. We deliver a spotless shine without the use of harsh or dangerous chemicals.`
          }
        },
        {
          "@type": "Question",
          "name": isMiamiOrBroward ? `Can I schedule recurring ${serviceNameForSchema.toLowerCase()} in ${cleanName}?` : `Can I schedule recurring ${serviceNameForSchema.toLowerCase()} in ${cleanName}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": isMiamiOrBroward 
              ? `Yes, we offer highly flexible scheduling for recurring ${serviceNameForSchema.toLowerCase()} in ${cleanName}. Whether you need weekly, bi-weekly, or monthly home maintenance, Sweet Maid can customize a recurring schedule that perfectly fits your lifestyle and ensures your ${cleanName} condo or house stays impeccably clean.`
              : `Yes, we offer highly flexible scheduling for ${serviceNameForSchema.toLowerCase()} in ${cleanName}. Whether you need weekly, bi-weekly, or monthly maintenance, Sweet Maid can customize a recurring schedule that perfectly fits your lifestyle and ensures your ${cleanName} home or office stays impeccably clean.`
          }
        },
        {
          "@type": "Question",
          "name": isMiamiOrBroward ? `Do I need to provide supplies for my ${serviceNameForSchema.toLowerCase()} in ${cleanName}?` : `Do I need to provide supplies for my ${serviceNameForSchema.toLowerCase()} in ${cleanName}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": isMiamiOrBroward 
              ? `No, you do not need to lift a finger! The Sweet Maid team arrives at your ${cleanName} property fully equipped with industry-leading tools, HEPA vacuums, and professional-grade supplies necessary to complete your ${serviceNameForSchema.toLowerCase()} to absolute perfection.`
              : `No, you do not need to lift a finger! The Sweet Maid team arrives at your ${cleanName} property fully equipped with industry-leading tools and professional-grade supplies necessary to complete your ${serviceNameForSchema.toLowerCase()} to absolute perfection.`
          }
        },
        {
          "@type": "Question",
          "name": isMiamiOrBroward ? `How do I book ${serviceNameForSchema.toLowerCase()} in ${cleanName}, Florida?` : `How do I book ${serviceNameForSchema.toLowerCase()} in ${cleanName}, Florida?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": isMiamiOrBroward 
              ? `Booking your ${serviceNameForSchema.toLowerCase()} in ${cleanName} is incredibly easy. You can call our local line directly at (305) 851-6959, or use our instant online booking platform to secure your preferred date and time for premium ${serviceNameForSchema.toLowerCase()}.`
              : `Booking your ${serviceNameForSchema.toLowerCase()} in ${cleanName} is incredibly easy. You can call our local ${cleanName} office directly, or use our instant online booking platform to secure your preferred date and time for premium ${serviceNameForSchema.toLowerCase()}.`
          }
        },
        {
          "@type": "Question",
          "name": isMiamiOrBroward ? `Is Sweet Maid insured and bonded for ${serviceNameForSchema.toLowerCase()} in ${cleanName}, FL?` : `Is Sweet Maid insured and bonded for ${serviceNameForSchema.toLowerCase()} in ${cleanName}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": isMiamiOrBroward 
              ? `Yes, providing peace of mind is our top priority. Sweet Maid is fully licensed, insured, and bonded to perform ${serviceNameForSchema.toLowerCase()} throughout ${cleanName}, Florida. Your property is entirely protected while our specialists are on-site.`
              : `Yes, providing peace of mind is our top priority. Sweet Maid is fully licensed, insured, and bonded to perform ${serviceNameForSchema.toLowerCase()} throughout ${cleanName}, FL. Your property is entirely protected while our specialists are on-site.`
          }
        },
        {
          "@type": "Question",
          "name": isMiamiOrBroward ? `Why choose Sweet Maid for ${serviceNameForSchema.toLowerCase()} in ${cleanName} over competitors?` : `Why choose Sweet Maid for ${serviceNameForSchema.toLowerCase()} in ${cleanName} over competitors?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": isMiamiOrBroward 
              ? `Sweet Maid outshines competitors like Molly Maid by offering unmatched localized reliability, crystal-clear communication, and customized ${serviceNameForSchema.toLowerCase()}. Our dedication to detail, strict employee vetting, and local Florida ownership make us the undisputed choice for ${serviceNameForSchema.toLowerCase()} in ${cleanName}.`
              : `Sweet Maid outshines the competition by offering unmatched reliability, crystal-clear communication, and elite-level ${serviceNameForSchema.toLowerCase()} in ${cleanName}. Our dedication to perfection, localized expertise in Florida, and strictly vetted staff make us the undisputed choice for ${serviceNameForSchema.toLowerCase()}.`
          }
        }
      ]
    }
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaStr }} />
      <div dangerouslySetInnerHTML={{ __html: localizedHtml }} />
    </>
  );
}
