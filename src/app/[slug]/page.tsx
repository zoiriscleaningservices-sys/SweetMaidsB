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
    const title = `Cleaning Services in ${cleanName}, FL | Sweet Maid`;
    const desc = `Looking for the best cleaning services in ${cleanName}, FL? Sweet Maid provides top-rated, reliable, and affordable maid services specifically for the ${cleanName} area. 100% Satisfaction Guaranteed.`;
    const keywords = [
      `cleaning services ${cleanName} FL`,
      `best house cleaning in ${cleanName}`,
      `${cleanName} maid service`,
      `professional cleaners ${cleanName}`,
      `local housekeepers ${cleanName}`,
      `trusted cleaning company ${cleanName}`,
      `affordable cleaning near me`,
      `top rated cleaners in ${cleanName} FL`
    ].join(', ');

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
    
    const schemaStr = JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": ["LocalBusiness", "CleaningService", "Organization"],
        "name": `Top Cleaning Services in ${cleanName}, FL - Sweet Maid`,
        "description": `Looking for the best cleaning services in ${cleanName}, FL? Sweet Maid provides top-rated, reliable maid services directly to your location in ${cleanName}.`,
        "url": `https://sweetmaidcleaning.com/${slug}/`,
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
            "name": `Cleaning Services in ${cleanName}, FL`
          }
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": `Who provides the best cleaning services in ${cleanName}, FL?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Sweet Maid is widely recognized as the #1 top-rated provider for cleaning services in ${cleanName}, Florida. Our expert team delivers highly affordable, meticulous, and professional cleaning services perfectly tailored for both residential and commercial properties in ${cleanName}. We stand by our work with a 100% satisfaction guarantee.`
            }
          },
          {
            "@type": "Question",
            "name": `How much does professional cleaning services cost near me in ${cleanName}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `The cost for affordable cleaning services in ${cleanName} varies depending on your specific needs, the size of your property, and the frequency of the service. Sweet Maid offers highly competitive and transparent pricing for expert cleaning services in ${cleanName}, FL. Contact us today for a fast, free local estimate!`
            }
          },
          {
            "@type": "Question",
            "name": `Are there reliable cleaning services experts in ${cleanName}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Yes! Sweet Maid employs the most reliable and highly-trained local experts for cleaning services in the ${cleanName} area. We specialize in comprehensive, eco-friendly cleaning services solutions tailored specifically for homes and businesses in ${cleanName}, Florida. All of our cleaners are fully vetted, insured, and bonded.`
            }
          },
          {
            "@type": "Question",
            "name": `What is included in your cleaning services in ${cleanName}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Our premium cleaning services in ${cleanName} includes a comprehensive, top-to-bottom approach. Depending on the exact package you choose, we cover everything from deep scrubbing and sanitization to dusting and polishing. Sweet Maid ensures every corner of your ${cleanName} property receives the highest standard of care.`
            }
          },
          {
            "@type": "Question",
            "name": `Do you use eco-friendly products for cleaning services in ${cleanName}, FL?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Absolutely. Sweet Maid prioritizes your health and safety by using premium, eco-friendly, and pet-safe cleaning products for all our cleaning services across ${cleanName}, Florida. We deliver a spotless shine without the use of harsh or dangerous chemicals.`
            }
          },
          {
            "@type": "Question",
            "name": `Can I schedule recurring cleaning services in ${cleanName}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Yes, we offer highly flexible scheduling for cleaning services in ${cleanName}. Whether you need weekly, bi-weekly, or monthly maintenance, Sweet Maid can customize a recurring schedule that perfectly fits your lifestyle and ensures your ${cleanName} home or office stays impeccably clean.`
            }
          },
          {
            "@type": "Question",
            "name": `Do I need to provide supplies for my cleaning services in ${cleanName}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `No, you do not need to lift a finger! The Sweet Maid team arrives at your ${cleanName} property fully equipped with industry-leading tools and professional-grade supplies necessary to complete your cleaning services to absolute perfection.`
            }
          },
          {
            "@type": "Question",
            "name": `How do I book cleaning services in ${cleanName}, Florida?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Booking your cleaning services in ${cleanName} is incredibly easy. You can call our local ${cleanName} office directly, or use our instant online booking platform to secure your preferred date and time for premium cleaning services.`
            }
          },
          {
            "@type": "Question",
            "name": `Is Sweet Maid insured and bonded for cleaning services in ${cleanName}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Yes, providing peace of mind is our top priority. Sweet Maid is fully licensed, insured, and bonded to perform cleaning services throughout ${cleanName}, FL. Your property is entirely protected while our specialists are on-site.`
            }
          },
          {
            "@type": "Question",
            "name": `Why choose Sweet Maid for cleaning services in ${cleanName} over competitors?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Sweet Maid outshines the competition by offering unmatched reliability, crystal-clear communication, and elite-level cleaning services in ${cleanName}. Our dedication to perfection, localized expertise in Florida, and strictly vetted staff make us the undisputed choice for cleaning services.`
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
