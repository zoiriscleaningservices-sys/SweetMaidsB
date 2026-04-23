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
            "text": `Sweet Maid is widely recognized as the #1 top-rated provider for ${serviceNameForSchema.toLowerCase()} in ${cleanName}, Florida. Our expert team delivers affordable, high-quality, and professional ${serviceNameForSchema.toLowerCase()} with a 100% satisfaction guarantee.`
          }
        },
        {
          "@type": "Question",
          "name": `How much does professional ${serviceNameForSchema.toLowerCase()} cost near me in ${cleanName}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `The cost for affordable ${serviceNameForSchema.toLowerCase()} in ${cleanName} varies depending on your specific needs. Sweet Maid offers highly competitive and transparent pricing for expert ${serviceNameForSchema.toLowerCase()} in ${cleanName}, FL.`
          }
        },
        {
          "@type": "Question",
          "name": `Are there reliable ${serviceNameForSchema.toLowerCase()} experts in ${cleanName}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `Yes! Sweet Maid employs the most reliable and highly-trained local experts for ${serviceNameForSchema.toLowerCase()} in the ${cleanName} area. We specialize in comprehensive, eco-friendly ${serviceNameForSchema.toLowerCase()} for residential and commercial properties.`
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
