import { Metadata } from 'next';
import { serviceSlugs, getLocationData, formatName } from '@/lib/data';
import { getTemplate, extractSections, localizedReplace } from '@/lib/template';


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const isService = serviceSlugs.includes(slug);

  if (isService) {
    let serviceName = formatName(slug.replace(/-/g, ' '));
    if (!serviceName.toLowerCase().endsWith('services')) {
      serviceName += ' Services';
    }
    const title = `Top ${serviceName} in Bradenton, FL | Sweet Maid`;
    const desc = `Looking for the best ${serviceName.toLowerCase()} in Bradenton, FL? Sweet Maid provides top-rated, reliable, and affordable cleaners specifically in Bradenton. Get your free quote today!`;
    const keywords = [
      `${serviceName.toLowerCase()} Bradenton FL`,
      `best ${serviceName.toLowerCase()} in Bradenton`,
      `Bradenton ${serviceName.toLowerCase()}`,
      `maid service Bradenton FL`,
      `professional cleaners Bradenton`,
      `local housekeepers Bradenton`,
      `trusted cleaning company Bradenton`
    ].join(', ');
    return {
      title,
      description: desc,
      keywords,
      alternates: { canonical: `https://sweetmaidcleaning.com/${slug}/` },
      openGraph: { title, description: desc, url: `https://sweetmaidcleaning.com/${slug}/`, type: 'website', images: ['https://i.ibb.co/QSD3Ydt/image.jpg'] },
      twitter: { card: 'summary_large_image', title, description: desc, images: ['https://i.ibb.co/QSD3Ydt/image.jpg'] }
    };
  } else {
    const data = getLocationData();
    const locData = data[slug];
    if (!locData) return {};

    const cleanName = formatName(locData.name);
    
    // Competitor Beating Strategy: Mimic Molly Maid's #1 ranking metadata for Miami, but with Sweet Maid branding
    let title = `Cleaning Services in ${cleanName}, FL | Sweet Maid`;
    let desc = `Looking for the best cleaning services in ${cleanName}, FL? Sweet Maid provides top-rated, reliable, and affordable maid services specifically for the ${cleanName} area. 100% Satisfaction Guaranteed.`;
    let keywords = [
      `cleaning services ${cleanName} FL`,
      `best house cleaning in ${cleanName}`,
      `${cleanName} maid service`,
      `professional cleaners ${cleanName}`,
      `local housekeepers ${cleanName}`,
      `trusted cleaning company ${cleanName}`,
      `affordable cleaning near me`,
      `top rated cleaners in ${cleanName} FL`
    ].join(', ');

    if (slug === 'miami-fl') {
      title = `House Cleaning Services in Miami, Florida | Sweet Maid`;
      desc = `Sweet Maid Offers Customized House Cleaning Services in Miami, Florida. Call (941) 222-2080 Today for a Free Estimate by Trusted & Insured Pros!`;
      keywords = [
        `house cleaning services miami florida`,
        `miami house cleaning`,
        `maid service miami fl`,
        `miami cleaning services`,
        `cleaning services in miami fl`,
        `residential cleaning miami`,
        `professional cleaners miami`,
        `sweet maid miami`
      ].join(', ');
    }

    return {
      title,
      description: desc,
      keywords,
      alternates: { canonical: `https://sweetmaidcleaning.com/${slug}/` },
      openGraph: { title, description: desc, url: `https://sweetmaidcleaning.com/${slug}/`, type: 'website', images: ['https://i.ibb.co/QSD3Ydt/image.jpg'] },
      twitter: { card: 'summary_large_image', title, description: desc, images: ['https://i.ibb.co/QSD3Ydt/image.jpg'] }
    };
  }
}

export default async function LocationOrServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const isService = serviceSlugs.includes(slug);

  if (isService) {
    const rawHtml = getTemplate(slug);
    if (!rawHtml) return <div>Service template missing</div>;

    const bodyContent = extractSections(rawHtml);
    const localizedHtml = localizedReplace(bodyContent, 'Bradenton', slug, false, slug);
    return <div dangerouslySetInnerHTML={{ __html: localizedHtml }} />;
  } else {
    const data = getLocationData();
    const locData = data[slug];
    if (!locData) return <div>Location not found</div>;

    const cleanName = formatName(locData.name);
    const rawHtml = getTemplate('house-cleaning');
    if (!rawHtml) return <div>Template missing</div>;

    const bodyContent = extractSections(rawHtml);
    const localizedHtml = localizedReplace(bodyContent, cleanName, slug, false, 'cleaning');
    
    // Competitor Beating Strategy: Custom LocalBusiness and FAQ JSON-LD schemas targeting Miami neighborhoods
    const isMiami = slug === 'miami-fl';
    const schemaStr = JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": ["LocalBusiness", "CleaningService", "Organization"],
        "name": isMiami ? "Sweet Maid - House Cleaning Services Miami" : `Top Cleaning Services in ${cleanName}, FL - Sweet Maid`,
        "description": isMiami 
          ? "Sweet Maid Offers Customized House Cleaning Services in Miami, Florida. Call (941) 222-2080 Today for a Free Estimate by Trusted & Insured Pros!"
          : `Looking for the best cleaning services in ${cleanName}, FL? Sweet Maid provides top-rated, reliable maid services directly to your location in ${cleanName}.`,
        "url": `https://sweetmaidcleaning.com/${slug}/`,
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
            "name": isMiami ? "House Cleaning Services in Miami, FL" : `Cleaning Services in ${cleanName}, FL`
          }
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": isMiami ? "Who provides the best house cleaning services in Miami, FL?" : `Who provides the best cleaning services in ${cleanName}, FL?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": isMiami 
                ? "Sweet Maid is widely recognized as the #1 top-rated provider for house cleaning services in Miami, Florida. Our expert team delivers highly affordable, meticulous, and professional customized house cleaning services perfectly tailored for both residential and commercial properties across Miami, including Brickell, Coral Gables, Coconut Grove, Wynwood, Doral, and Miami Beach. All of our cleaners are trusted, insured, and backed by a 100% satisfaction guarantee."
                : `Sweet Maid is widely recognized as the #1 top-rated provider for cleaning services in ${cleanName}, Florida. Our expert team delivers highly affordable, meticulous, and professional cleaning services perfectly tailored for both residential and commercial properties in ${cleanName}. We stand by our work with a 100% satisfaction guarantee.`
            }
          },
          {
            "@type": "Question",
            "name": isMiami ? "How much does customized house cleaning services cost in Miami?" : `How much does professional cleaning services cost near me in ${cleanName}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": isMiami 
                ? "The cost for customized house cleaning services in Miami varies depending on your specific needs, the size of your home, and the frequency of the service. Sweet Maid offers highly competitive and transparent pricing for expert maid services in Miami, Florida. Contact us at (941) 222-2080 today for a fast, free local estimate!"
                : `The cost for affordable cleaning services in ${cleanName} varies depending on your specific needs, the size of your property, and the frequency of the service. Sweet Maid offers highly competitive and transparent pricing for expert cleaning services in ${cleanName}, FL. Contact us today for a fast, free local estimate!`
            }
          },
          {
            "@type": "Question",
            "name": isMiami ? "Are there reliable house cleaning experts in Miami, Florida?" : `Are there reliable cleaning services experts in ${cleanName}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": isMiami 
                ? "Yes! Sweet Maid employs the most reliable, highly-trained, and vetted local experts for house cleaning in the Miami area. We specialize in comprehensive, eco-friendly maid service solutions tailored specifically for luxury homes, condos, and businesses in Miami, FL. All of our cleaners are fully vetted, insured, and bonded."
                : `Yes! Sweet Maid employs the most reliable and highly-trained local experts for cleaning services in the ${cleanName} area. We specialize in comprehensive, eco-friendly cleaning services solutions tailored specifically for homes and businesses in ${cleanName}, Florida. All of our cleaners are fully vetted, insured, and bonded.`
            }
          },
          {
            "@type": "Question",
            "name": isMiami ? "What is included in your Miami house cleaning services?" : `What is included in your cleaning services in ${cleanName}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": isMiami 
                ? "Our premium house cleaning services in Miami include a comprehensive, top-to-bottom cleaning process. Depending on the exact package you choose (deep cleaning, recurring service, or move-out cleaning), we cover everything from deep scrubbing and kitchen sanitization to dusting baseboards, vacuuming, and polishing surfaces. Sweet Maid ensures every corner of your Miami home receives the highest standard of care."
                : `Our premium cleaning services in ${cleanName} includes a comprehensive, top-to-bottom approach. Depending on the exact package you choose, we cover everything from deep scrubbing and sanitization to dusting and polishing. Sweet Maid ensures every corner of your ${cleanName} property receives the highest standard of care.`
            }
          },
          {
            "@type": "Question",
            "name": isMiami ? "Do you use eco-friendly products for cleaning in Miami, FL?" : `Do you use eco-friendly products for cleaning services in ${cleanName}, FL?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": isMiami 
                ? "Absolutely. Sweet Maid prioritizes your health and safety by using premium, eco-friendly, and pet-safe cleaning products for all our house cleaning services across Miami, Florida. We deliver a spotless shine without the use of harsh, toxic, or dangerous chemicals."
                : `Absolutely. Sweet Maid prioritizes your health and safety by using premium, eco-friendly, and pet-safe cleaning products for all our cleaning services across ${cleanName}, Florida. We deliver a spotless shine without the use of harsh or dangerous chemicals.`
            }
          },
          {
            "@type": "Question",
            "name": isMiami ? "Can I schedule recurring maid services in Miami?" : `Can I schedule recurring cleaning services in ${cleanName}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": isMiami 
                ? "Yes, we offer highly flexible scheduling for recurring maid services in Miami. Whether you need weekly, bi-weekly, or monthly home maintenance, Sweet Maid can customize a recurring schedule that perfectly fits your lifestyle and ensures your Miami condo or house stays impeccably clean."
                : `Yes, we offer highly flexible scheduling for cleaning services in ${cleanName}. Whether you need weekly, bi-weekly, or monthly maintenance, Sweet Maid can customize a recurring schedule that perfectly fits your lifestyle and ensures your ${cleanName} home or office stays impeccably clean.`
            }
          },
          {
            "@type": "Question",
            "name": isMiami ? "Do I need to provide cleaning supplies in Miami?" : `Do I need to provide supplies for my cleaning services in ${cleanName}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": isMiami 
                ? "No, you do not need to lift a finger! The Sweet Maid team arrives at your Miami property fully equipped with industry-leading tools, HEPA vacuums, and professional-grade supplies necessary to complete your house cleaning services to absolute perfection."
                : `No, you do not need to lift a finger! The Sweet Maid team arrives at your ${cleanName} property fully equipped with industry-leading tools and professional-grade supplies necessary to complete your cleaning services to absolute perfection.`
            }
          },
          {
            "@type": "Question",
            "name": isMiami ? "How do I book house cleaning services in Miami, Florida?" : `How do I book cleaning services in ${cleanName}, Florida?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": isMiami 
                ? "Booking your house cleaning services in Miami is incredibly easy. You can call our local line directly at (941) 222-2080, or use our instant online booking platform to secure your preferred date and time for premium, customized cleaning services."
                : `Booking your cleaning services in ${cleanName} is incredibly easy. You can call our local ${cleanName} office directly, or use our instant online booking platform to secure your preferred date and time for premium cleaning services.`
            }
          },
          {
            "@type": "Question",
            "name": isMiami ? "Is Sweet Maid insured and bonded in Miami, FL?" : `Is Sweet Maid insured and bonded for cleaning services in ${cleanName}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": isMiami 
                ? "Yes, providing peace of mind is our top priority. Sweet Maid is fully licensed, insured, and bonded to perform house cleaning services throughout Miami, Florida. Your property is entirely protected while our experts are on-site."
                : `Yes, providing peace of mind is our top priority. Sweet Maid is fully licensed, insured, and bonded to perform cleaning services throughout ${cleanName}, FL. Your property is entirely protected while our specialists are on-site.`
            }
          },
          {
            "@type": "Question",
            "name": isMiami ? "Why choose Sweet Maid for house cleaning in Miami over competitors?" : `Why choose Sweet Maid for cleaning services in ${cleanName} over competitors?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": isMiami 
                ? "Sweet Maid outshines competitors like Molly Maid by offering unmatched localized reliability, crystal-clear communication, and customized house cleaning services. Our dedication to detail, strict employee vetting, and local Florida ownership make us the undisputed choice for residential cleaning in Miami."
                : `Sweet Maid outshines the competition by offering unmatched reliability, crystal-clear communication, and elite-level cleaning services in ${cleanName}. Our dedication to perfection, localized expertise in Florida, and strictly vetted staff make us the undisputed choice for cleaning services.`
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
}
