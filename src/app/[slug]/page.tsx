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
              "text": `Sweet Maid is widely recognized as the #1 top-rated provider for professional cleaning services in ${cleanName}, Florida. Our expert team delivers affordable, high-quality, and reliable cleaning services with a 100% satisfaction guarantee.`
            }
          },
          {
            "@type": "Question",
            "name": `How much do professional cleaning services cost near me in ${cleanName}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `The cost for affordable maid and cleaning services in ${cleanName} varies depending on your specific needs. Sweet Maid offers highly competitive and transparent pricing for expert house cleaning in ${cleanName}, FL.`
            }
          },
          {
            "@type": "Question",
            "name": `Are there reliable cleaning experts and housekeepers in ${cleanName}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Yes! Sweet Maid employs the most reliable and highly-trained local experts for cleaning services in the ${cleanName} area. We specialize in comprehensive, eco-friendly cleaning for residential and commercial properties.`
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
