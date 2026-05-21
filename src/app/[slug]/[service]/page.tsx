import { Metadata } from 'next';
import { serviceSlugs, getLocationData, formatName } from '@/lib/data';
import { getTemplate, extractSections, localizedReplace } from '@/lib/template';


export async function generateMetadata({ params }: { params: Promise<{ slug: string, service: string }> }): Promise<Metadata> {
  const { slug, service } = await params;
  const data = getLocationData();
  const locData = data[slug];
  if (!locData) return {};

  const cleanName = formatName(locData.name);
  let serviceName = formatName(service.replace(/-/g, ' '));
  if (!serviceName.toLowerCase().endsWith('services')) {
    serviceName += ' Services';
  }
  
  let title = `Top ${serviceName} in ${cleanName}, FL | Sweet Maid`;
  let desc = `Looking for the best ${serviceName.toLowerCase()} in ${cleanName}, FL? Sweet Maid provides top-rated, reliable, and affordable ${serviceName.toLowerCase()} specifically for the ${cleanName} area. Hire professional local cleaners today!`;
  let keywords = [
    `${serviceName.toLowerCase()} ${cleanName} FL`,
    `best ${serviceName.toLowerCase()} in ${cleanName}`,
    `${cleanName} ${serviceName.toLowerCase()}`,
    `maid service ${cleanName} FL`,
    `professional cleaners ${cleanName}`,
    `local housekeepers ${cleanName}`,
    `trusted cleaning company ${cleanName}`,
    `affordable ${serviceName.toLowerCase()} near me`,
    `top rated cleaners in ${cleanName} FL`
  ].join(', ');

  if (slug === 'miami-fl') {
    title = `${serviceName} in Miami, Florida | Sweet Maid`;
    desc = `Sweet Maid Offers Customized ${serviceName} in Miami, Florida. Call (941) 222-2080 Today for a Free Estimate by Trusted & Insured Pros!`;
    keywords = [
      `${serviceName.toLowerCase()} miami florida`,
      `miami ${serviceName.toLowerCase()}`,
      `best ${serviceName.toLowerCase()} in miami`,
      `professional ${serviceName.toLowerCase()} miami`,
      `residential cleaning services miami`,
      `sweet maid miami`
    ].join(', ');
  }

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
  
  const data = getLocationData();
  const locData = data[slug];
  if (!locData) return <div>Location not found</div>;

  const cleanName = formatName(locData.name);

  const rawHtml = getTemplate(service);
  if (!rawHtml) return <div>Service template missing</div>;

  const bodyContent = extractSections(rawHtml);
  const localizedHtml = localizedReplace(bodyContent, cleanName, slug, true, service);
  
  let serviceNameForSchema = formatName(service.replace(/-/g, ' '));
  if (!serviceNameForSchema.toLowerCase().endsWith('services')) {
    serviceNameForSchema += ' Services';
  }

  const isMiami = slug === 'miami-fl';

  // Dynamically generate the localized JSON-LD schema with FAQ
  const schemaStr = JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": ["LocalBusiness", "CleaningService", "Organization"],
      "name": isMiami ? `Sweet Maid - ${serviceNameForSchema} Miami` : `${serviceNameForSchema} in ${cleanName}, FL - Sweet Maid`,
      "description": isMiami 
        ? `Sweet Maid Offers Customized ${serviceNameForSchema} in Miami, Florida. Call (941) 222-2080 Today for a Free Estimate by Trusted & Insured Pros!`
        : `Looking for the best ${serviceNameForSchema.toLowerCase()} in ${cleanName}, FL? Sweet Maid provides top-rated, reliable ${serviceNameForSchema.toLowerCase()} directly to your location in ${cleanName}.`,
      "url": `https://sweetmaidcleaning.com/${slug}/${service}/`,
      "telephone": "(941) 222-2080",
      "image": "https://i.ibb.co/QSD3Ydt/image.jpg",
      "priceRange": "$$",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": cleanName,
        "addressRegion": "FL",
        "addressCountry": "US"
      },
      "geo": isMiami ? {
        "@type": "GeoCoordinates",
        "latitude": 25.7617,
        "longitude": -80.1918
      } : undefined,
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
          "name": isMiami ? `${serviceNameForSchema} in Miami, FL` : `${serviceNameForSchema} in ${cleanName}, FL`
        }
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": isMiami ? `Who provides the best ${serviceNameForSchema.toLowerCase()} in Miami, FL?` : `Who provides the best ${serviceNameForSchema.toLowerCase()} in ${cleanName}, FL?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": isMiami 
              ? `Sweet Maid is widely recognized as the #1 top-rated provider for ${serviceNameForSchema.toLowerCase()} in Miami, Florida. Our expert team delivers highly affordable, meticulous, and professional customized ${serviceNameForSchema.toLowerCase()} perfectly tailored for both residential and commercial properties across Miami, including Brickell, Coral Gables, Coconut Grove, Wynwood, Doral, and Miami Beach. All of our cleaners are trusted, insured, and backed by a 100% satisfaction guarantee.`
              : `Sweet Maid is widely recognized as the #1 top-rated provider for ${serviceNameForSchema.toLowerCase()} in ${cleanName}, Florida. Our expert team delivers highly affordable, meticulous, and professional ${serviceNameForSchema.toLowerCase()} perfectly tailored for both residential and commercial properties in ${cleanName}. We stand by our work with a 100% satisfaction guarantee.`
          }
        },
        {
          "@type": "Question",
          "name": isMiami ? `How much does customized ${serviceNameForSchema.toLowerCase()} cost in Miami?` : `How much does professional ${serviceNameForSchema.toLowerCase()} cost near me in ${cleanName}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": isMiami 
              ? `The cost for customized ${serviceNameForSchema.toLowerCase()} in Miami varies depending on your specific needs, the size of your home, and the frequency of the service. Sweet Maid offers highly competitive and transparent pricing for expert ${serviceNameForSchema.toLowerCase()} in Miami, Florida. Contact us at (941) 222-2080 today for a fast, free local estimate!`
              : `The cost for affordable ${serviceNameForSchema.toLowerCase()} in ${cleanName} varies depending on your specific needs, the size of your property, and the frequency of the service. Sweet Maid offers highly competitive and transparent pricing for expert ${serviceNameForSchema.toLowerCase()} in ${cleanName}, FL. Contact us today for a fast, free local estimate!`
          }
        },
        {
          "@type": "Question",
          "name": isMiami ? `Are there reliable ${serviceNameForSchema.toLowerCase()} experts in Miami, Florida?` : `Are there reliable ${serviceNameForSchema.toLowerCase()} experts in ${cleanName}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": isMiami 
              ? `Yes! Sweet Maid employs the most reliable, highly-trained, and vetted local experts for ${serviceNameForSchema.toLowerCase()} in the Miami area. We specialize in comprehensive, eco-friendly ${serviceNameForSchema.toLowerCase()} solutions tailored specifically for luxury homes, condos, and businesses in Miami, FL. All of our cleaners are fully vetted, insured, and bonded.`
              : `Yes! Sweet Maid employs the most reliable and highly-trained local experts for ${serviceNameForSchema.toLowerCase()} in the ${cleanName} area. We specialize in comprehensive, eco-friendly ${serviceNameForSchema.toLowerCase()} solutions tailored specifically for homes and businesses in ${cleanName}, Florida. All of our cleaners are fully vetted, insured, and bonded.`
          }
        },
        {
          "@type": "Question",
          "name": isMiami ? `What is included in your Miami ${serviceNameForSchema.toLowerCase()}?` : `What is included in your ${serviceNameForSchema.toLowerCase()} in ${cleanName}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": isMiami 
              ? `Our premium ${serviceNameForSchema.toLowerCase()} in Miami includes a comprehensive, top-to-bottom cleaning process. Depending on the exact package you choose (deep cleaning, recurring service, or move-out cleaning), we cover everything from deep scrubbing and kitchen sanitization to dusting baseboards, vacuuming, and polishing surfaces. Sweet Maid ensures every corner of your Miami home receives the highest standard of care.`
              : `Our premium ${serviceNameForSchema.toLowerCase()} in ${cleanName} includes a comprehensive, top-to-bottom approach. Depending on the exact package you choose, we cover everything from deep scrubbing and sanitization to dusting and polishing. Sweet Maid ensures every corner of your ${cleanName} property receives the highest standard of care.`
          }
        },
        {
          "@type": "Question",
          "name": isMiami ? `Do you use eco-friendly products for ${serviceNameForSchema.toLowerCase()} in Miami, FL?` : `Do you use eco-friendly products for ${serviceNameForSchema.toLowerCase()} in ${cleanName}, FL?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": isMiami 
              ? `Absolutely. Sweet Maid prioritizes your health and safety by using premium, eco-friendly, and pet-safe cleaning products for all our ${serviceNameForSchema.toLowerCase()} across Miami, Florida. We deliver a spotless shine without the use of harsh, toxic, or dangerous chemicals.`
              : `Absolutely. Sweet Maid prioritizes your health and safety by using premium, eco-friendly, and pet-safe cleaning products for all our ${serviceNameForSchema.toLowerCase()} across ${cleanName}, Florida. We deliver a spotless shine without the use of harsh or dangerous chemicals.`
          }
        },
        {
          "@type": "Question",
          "name": isMiami ? `Can I schedule recurring ${serviceNameForSchema.toLowerCase()} in Miami?` : `Can I schedule recurring ${serviceNameForSchema.toLowerCase()} in ${cleanName}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": isMiami 
              ? `Yes, we offer highly flexible scheduling for recurring ${serviceNameForSchema.toLowerCase()} in Miami. Whether you need weekly, bi-weekly, or monthly home maintenance, Sweet Maid can customize a recurring schedule that perfectly fits your lifestyle and ensures your Miami condo or house stays impeccably clean.`
              : `Yes, we offer highly flexible scheduling for ${serviceNameForSchema.toLowerCase()} in ${cleanName}. Whether you need weekly, bi-weekly, or monthly maintenance, Sweet Maid can customize a recurring schedule that perfectly fits your lifestyle and ensures your ${cleanName} home or office stays impeccably clean.`
          }
        },
        {
          "@type": "Question",
          "name": isMiami ? `Do I need to provide supplies for my ${serviceNameForSchema.toLowerCase()} in Miami?` : `Do I need to provide supplies for my ${serviceNameForSchema.toLowerCase()} in ${cleanName}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": isMiami 
              ? `No, you do not need to lift a finger! The Sweet Maid team arrives at your Miami property fully equipped with industry-leading tools, HEPA vacuums, and professional-grade supplies necessary to complete your ${serviceNameForSchema.toLowerCase()} to absolute perfection.`
              : `No, you do not need to lift a finger! The Sweet Maid team arrives at your ${cleanName} property fully equipped with industry-leading tools and professional-grade supplies necessary to complete your ${serviceNameForSchema.toLowerCase()} to absolute perfection.`
          }
        },
        {
          "@type": "Question",
          "name": isMiami ? `How do I book ${serviceNameForSchema.toLowerCase()} in Miami, Florida?` : `How do I book ${serviceNameForSchema.toLowerCase()} in ${cleanName}, Florida?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": isMiami 
              ? `Booking your ${serviceNameForSchema.toLowerCase()} in Miami is incredibly easy. You can call our local line directly at (941) 222-2080, or use our instant online booking platform to secure your preferred date and time for premium ${serviceNameForSchema.toLowerCase()}.`
              : `Booking your ${serviceNameForSchema.toLowerCase()} in ${cleanName} is incredibly easy. You can call our local ${cleanName} office directly, or use our instant online booking platform to secure your preferred date and time for premium ${serviceNameForSchema.toLowerCase()}.`
          }
        },
        {
          "@type": "Question",
          "name": isMiami ? `Is Sweet Maid insured and bonded for ${serviceNameForSchema.toLowerCase()} in Miami, FL?` : `Is Sweet Maid insured and bonded for ${serviceNameForSchema.toLowerCase()} in ${cleanName}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": isMiami 
              ? `Yes, providing peace of mind is our top priority. Sweet Maid is fully licensed, insured, and bonded to perform ${serviceNameForSchema.toLowerCase()} throughout Miami, Florida. Your property is entirely protected while our specialists are on-site.`
              : `Yes, providing peace of mind is our top priority. Sweet Maid is fully licensed, insured, and bonded to perform ${serviceNameForSchema.toLowerCase()} throughout ${cleanName}, FL. Your property is entirely protected while our specialists are on-site.`
          }
        },
        {
          "@type": "Question",
          "name": isMiami ? `Why choose Sweet Maid for ${serviceNameForSchema.toLowerCase()} in Miami over competitors?` : `Why choose Sweet Maid for ${serviceNameForSchema.toLowerCase()} in ${cleanName} over competitors?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": isMiami 
              ? `Sweet Maid outshines competitors like Molly Maid by offering unmatched localized reliability, crystal-clear communication, and customized ${serviceNameForSchema.toLowerCase()}. Our dedication to detail, strict employee vetting, and local Florida ownership make us the undisputed choice for ${serviceNameForSchema.toLowerCase()} in Miami.`
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
