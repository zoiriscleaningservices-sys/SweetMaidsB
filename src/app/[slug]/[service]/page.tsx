import { Metadata } from 'next';
import { serviceSlugs, getLocationData, formatName } from '@/lib/data';
import { getTemplate, extractSections, localizedReplace } from '@/lib/template';

export async function generateStaticParams() {
  const data = getLocationData();
  const slugs = Object.keys(data);
  const params: { slug: string; service: string }[] = [];

  slugs.forEach((slug) => {
    serviceSlugs.forEach((service) => {
      params.push({ slug, service });
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
  let serviceName = formatName(service.replace(/-/g, ' '));
  if (!serviceName.toLowerCase().endsWith('services')) {
    serviceName += ' Services';
  }
  
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
          "name": `What is the best ${serviceNameForSchema.toLowerCase()} in ${cleanName}, FL?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `Sweet Maid is the top-rated provider of ${serviceNameForSchema.toLowerCase()} in ${cleanName}, FL. Our team of local cleaners offers exceptional detail, eco-friendly products, and a 100% satisfaction guarantee to ensure your property is spotless.`
          }
        },
        {
          "@type": "Question",
          "name": `How much does ${serviceNameForSchema.toLowerCase()} cost in ${cleanName}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `The cost of ${serviceNameForSchema.toLowerCase()} in ${cleanName} varies based on the size of the property and the specific depth of cleaning required. Contact Sweet Maid for a free, instant quote to get the most accurate local pricing.`
          }
        },
        {
          "@type": "Question",
          "name": `Who provides the best ${serviceNameForSchema.toLowerCase()} near me in ${cleanName}, FL?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `Sweet Maid Cleaning is widely recognized as providing the best ${serviceNameForSchema.toLowerCase()} in ${cleanName}, FL. We guarantee satisfaction on all our cleaning services.`
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
