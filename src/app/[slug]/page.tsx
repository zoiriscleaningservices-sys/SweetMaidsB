import { Metadata } from 'next';
import { serviceSlugs, getLocationData, formatName } from '@/lib/data';
import { getTemplate, extractSections, localizedReplace } from '@/lib/template';

export async function generateStaticParams() {
  const data = getLocationData();
  const slugs = Object.keys(data);
  const params: { slug: string }[] = [];

  slugs.forEach((slug) => {
    params.push({ slug });
  });

  return params;
}

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
    const title = `Best Cleaning Services in ${cleanName}, FL | Top Rated Local Cleaners`;
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
    const localizedHtml = localizedReplace(bodyContent, 'Bradenton', slug, false);
    return <div dangerouslySetInnerHTML={{ __html: localizedHtml }} />;
  } else {
    const data = getLocationData();
    const locData = data[slug];
    if (!locData) return <div>Location not found</div>;

    const cleanName = formatName(locData.name);
    const rawHtml = getTemplate('house-cleaning');
    if (!rawHtml) return <div>Template missing</div>;

    const bodyContent = extractSections(rawHtml);
    const localizedHtml = localizedReplace(bodyContent, cleanName, slug, false);
    
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
            "name": `What is the best cleaning service in ${cleanName}, FL?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Sweet Maid is the top-rated provider of cleaning services in ${cleanName}, FL. Our team of local cleaners offers exceptional detail, eco-friendly products, and a 100% satisfaction guarantee to ensure your property is spotless.`
            }
          },
          {
            "@type": "Question",
            "name": `How much does a maid service cost in ${cleanName}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `The cost of maid services in ${cleanName} varies based on the size of the property and the specific depth of cleaning required. Contact Sweet Maid for a free, instant quote to get the most accurate local pricing.`
            }
          },
          {
            "@type": "Question",
            "name": `Who provides the best housekeepers near me in ${cleanName}, FL?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Sweet Maid Cleaning is widely recognized as providing the best professional housekeepers in ${cleanName}, FL. We guarantee satisfaction on all our cleaning services.`
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
