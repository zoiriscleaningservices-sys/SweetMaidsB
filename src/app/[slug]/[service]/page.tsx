import { getTemplate, extractSections, localizedReplace } from '@/lib/template';
import { getLocationData, formatName, serviceSlugs } from '@/lib/data';
import { Metadata } from 'next';

export async function generateStaticParams() {
  const data = getLocationData();
  const locations = Object.keys(data);
  const params: { slug: string, service: string }[] = [];

  locations.forEach(loc => {
    serviceSlugs.forEach(service => {
      params.push({ slug: loc, service: service });
    });
  });

  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string, service: string }> }): Promise<Metadata> {
  const { slug, service } = await params;
  const data = getLocationData();
  const locData = data[slug];
  if (!locData) return {};

  const cleanName = formatName(locData.name);
  const serviceName = formatName(service.replace(/-/g, ' '));
  
  const title = `Top ${serviceName} in ${cleanName}, FL | Sweet Maid`;
  const desc = `Looking for the best ${serviceName.toLowerCase()} in ${cleanName}, FL? Sweet Maid provides top-rated, reliable, and affordable cleaners specifically in ${cleanName}. Get your free quote today!`;
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

  if (!locData) {
    return <div>Location not found</div>;
  }

  const cleanName = formatName(locData.name);
  
  const rawHtml = getTemplate(service);
  if (!rawHtml) return <div>Service template missing</div>;

  const bodyContent = extractSections(rawHtml);
  const localizedHtml = localizedReplace(bodyContent, cleanName, slug, true, service);
  const serviceName = formatName(service.replace(/-/g, ' '));

  // Dynamically generate the localized JSON-LD schema with FAQ
  const schemaStr = JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": ["LocalBusiness", "Service", "Organization"],
      "name": `${serviceName} in ${cleanName}, FL - Sweet Maid`,
      "description": `Looking for the best ${serviceName.toLowerCase()} in ${cleanName}, FL? Sweet Maid provides top-rated, reliable ${serviceName.toLowerCase()} directly to your location in ${cleanName}.`,
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
          "name": `${serviceName} in ${cleanName}, FL`
        }
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": `What is the best ${serviceName.toLowerCase()} in ${cleanName}, FL?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `Sweet Maid is the top-rated provider of ${serviceName.toLowerCase()} in ${cleanName}, FL. Our team of local cleaners offers exceptional detail, eco-friendly products, and a 100% satisfaction guarantee to ensure your property is spotless.`
          }
        },
        {
          "@type": "Question",
          "name": `How much does ${serviceName.toLowerCase()} cost in ${cleanName}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `The cost of ${serviceName.toLowerCase()} in ${cleanName} varies based on the size of the property and the specific depth of cleaning required. Contact Sweet Maid for a free, instant quote to get the most accurate local pricing.`
          }
        },
        {
          "@type": "Question",
          "name": `Who provides the best ${serviceName.toLowerCase()} near me in ${cleanName}, FL?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `Sweet Maid Cleaning is widely recognized as providing the best ${serviceName.toLowerCase()} in ${cleanName}, FL. We guarantee satisfaction on all our cleaning services.`
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
