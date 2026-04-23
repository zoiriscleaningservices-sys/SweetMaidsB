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
  
  const title = `Top ${serviceName} in ${cleanName}, FL | Sweet Maid`;
  const desc = `Looking for the best ${serviceName.toLowerCase()} in ${cleanName}, FL? Sweet Maid provides top-rated, reliable, and affordable ${serviceName.toLowerCase()} specifically for the ${cleanName} area. Hire professional local cleaners today!`;
  const keywords = [
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

  // Dynamically generate the localized JSON-LD schema with FAQ
  const schemaStr = JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": ["LocalBusiness", "Service", "Organization"],
      "name": `${serviceNameForSchema} in ${cleanName}, FL - Sweet Maid`,
      "description": `Looking for the best ${serviceNameForSchema.toLowerCase()} in ${cleanName}, FL? Sweet Maid provides top-rated, reliable ${serviceNameForSchema.toLowerCase()} directly to your location in ${cleanName}.`,
      "url": `https://sweetmaidcleaning.com/${slug}/${service}/`,
      "telephone": "(941) 222-2080",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": cleanName,
        "addressRegion": "FL",
        "addressCountry": "US"
      },
      "areaServed": {
        "@type": "City",
        "name": cleanName
      },
      "makesOffer": {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": `${serviceNameForSchema} in ${cleanName}, FL`
        }
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": `Who provides the best ${serviceNameForSchema.toLowerCase()} in ${cleanName}, FL?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `Sweet Maid is widely recognized as the #1 top-rated provider for ${serviceNameForSchema.toLowerCase()} in ${cleanName}, Florida. Our expert team delivers highly affordable, meticulous, and professional ${serviceNameForSchema.toLowerCase()} perfectly tailored for both residential and commercial properties in ${cleanName}. We stand by our work with a 100% satisfaction guarantee.`
          }
        },
        {
          "@type": "Question",
          "name": `How much does professional ${serviceNameForSchema.toLowerCase()} cost near me in ${cleanName}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `The cost for affordable ${serviceNameForSchema.toLowerCase()} in ${cleanName} varies depending on your specific needs, the size of your property, and the frequency of the service. Sweet Maid offers highly competitive and transparent pricing for expert ${serviceNameForSchema.toLowerCase()} in ${cleanName}, FL. Contact us today for a fast, free local estimate!`
          }
        },
        {
          "@type": "Question",
          "name": `Are there reliable ${serviceNameForSchema.toLowerCase()} experts in ${cleanName}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `Yes! Sweet Maid employs the most reliable and highly-trained local experts for ${serviceNameForSchema.toLowerCase()} in the ${cleanName} area. We specialize in comprehensive, eco-friendly ${serviceNameForSchema.toLowerCase()} solutions tailored specifically for homes and businesses in ${cleanName}, Florida. All of our cleaners are fully vetted, insured, and bonded.`
          }
        },
        {
          "@type": "Question",
          "name": `What is included in your ${serviceNameForSchema.toLowerCase()} in ${cleanName}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `Our premium ${serviceNameForSchema.toLowerCase()} in ${cleanName} includes a comprehensive, top-to-bottom approach. Depending on the exact package you choose, we cover everything from deep scrubbing and sanitization to dusting and polishing. Sweet Maid ensures every corner of your ${cleanName} property receives the highest standard of care.`
          }
        },
        {
          "@type": "Question",
          "name": `Do you use eco-friendly products for ${serviceNameForSchema.toLowerCase()} in ${cleanName}, FL?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `Absolutely. Sweet Maid prioritizes your health and safety by using premium, eco-friendly, and pet-safe cleaning products for all our ${serviceNameForSchema.toLowerCase()} across ${cleanName}, Florida. We deliver a spotless shine without the use of harsh or dangerous chemicals.`
          }
        },
        {
          "@type": "Question",
          "name": `Can I schedule recurring ${serviceNameForSchema.toLowerCase()} in ${cleanName}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `Yes, we offer highly flexible scheduling for ${serviceNameForSchema.toLowerCase()} in ${cleanName}. Whether you need weekly, bi-weekly, or monthly maintenance, Sweet Maid can customize a recurring schedule that perfectly fits your lifestyle and ensures your ${cleanName} home or office stays impeccably clean.`
          }
        },
        {
          "@type": "Question",
          "name": `Do I need to provide supplies for my ${serviceNameForSchema.toLowerCase()} in ${cleanName}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `No, you do not need to lift a finger! The Sweet Maid team arrives at your ${cleanName} property fully equipped with industry-leading tools and professional-grade supplies necessary to complete your ${serviceNameForSchema.toLowerCase()} to absolute perfection.`
          }
        },
        {
          "@type": "Question",
          "name": `How do I book ${serviceNameForSchema.toLowerCase()} in ${cleanName}, Florida?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `Booking your ${serviceNameForSchema.toLowerCase()} in ${cleanName} is incredibly easy. You can call our local ${cleanName} office directly, or use our instant online booking platform to secure your preferred date and time for premium ${serviceNameForSchema.toLowerCase()}.`
          }
        },
        {
          "@type": "Question",
          "name": `Is Sweet Maid insured and bonded for ${serviceNameForSchema.toLowerCase()} in ${cleanName}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `Yes, providing peace of mind is our top priority. Sweet Maid is fully licensed, insured, and bonded to perform ${serviceNameForSchema.toLowerCase()} throughout ${cleanName}, FL. Your property is entirely protected while our specialists are on-site.`
          }
        },
        {
          "@type": "Question",
          "name": `Why choose Sweet Maid for ${serviceNameForSchema.toLowerCase()} in ${cleanName} over competitors?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `Sweet Maid outshines the competition by offering unmatched reliability, crystal-clear communication, and elite-level ${serviceNameForSchema.toLowerCase()} in ${cleanName}. Our dedication to perfection, localized expertise in Florida, and strictly vetted staff make us the undisputed choice for ${serviceNameForSchema.toLowerCase()}.`
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
