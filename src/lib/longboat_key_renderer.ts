import { Metadata } from 'next';
import { longboatKeyPages, LongboatPageData } from './longboat_key_content';

export function getLongboatPageData(key: string): LongboatPageData | null {
  return longboatKeyPages[key] || null;
}

export function getLongboatMetadata(key: string): Metadata {
  const page = longboatKeyPages[key];
  if (!page) return {};

  const title = page.title;
  const description = page.metaDescription;
  const canonicalUrl = `https://www.sweetmaidcleaning.com${page.route}`;

  return {
    title,
    description,
    keywords: null as any,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
      images: ['https://i.ibb.co/QSD3Ydt/image.jpg']
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://i.ibb.co/QSD3Ydt/image.jpg']
    }
  };
}

export function getLongboatJsonLd(key: string): string {
  const page = longboatKeyPages[key];
  if (!page) return '';

  const canonicalUrl = `https://www.sweetmaidcleaning.com${page.route}`;

  // 1. LocalBusiness schema (NO streetAddress, NO AggregateRating/Review)
  const localBusiness = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "CleaningService", "Organization"],
    "name": "Sweet Maid Cleaning Service",
    "description": page.metaDescription,
    "url": canonicalUrl,
    "telephone": "(941) 222-2080",
    "email": "info@sweetmaidcleaning.com",
    "image": "https://www.sweetmaidcleaning.com/images/logo.png",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Longboat Key",
      "addressRegion": "FL",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 27.3977,
      "longitude": -82.6269
    },
    "areaServed": {
      "@type": "City",
      "name": "Longboat Key",
      "sameAs": "https://en.wikipedia.org/wiki/Longboat_Key,_Florida"
    },
    "sameAs": [
      "https://www.facebook.com/SweetMaidCleaningService/",
      "https://www.instagram.com/sweetmaidcleaningservice/",
      "https://www.linkedin.com/company/sweet-maid-cleaning-service/",
      "https://www.pinterest.com/sweetmaidcleaning/",
      "https://www.tiktok.com/@sweetmaidcleaningservice",
      "https://x.com/sweetmaidclean",
      "https://www.youtube.com/@sweetmaidcleaning",
      "https://www.yelp.com/biz/sweet-maid-cleaning-service-bradenton-3"
    ]
  };

  // 2. Service schema
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": page.h1,
    "description": page.metaDescription,
    "provider": {
      "@type": "LocalBusiness",
      "name": "Sweet Maid Cleaning Service",
      "telephone": "(941) 222-2080"
    },
    "areaServed": {
      "@type": "City",
      "name": "Longboat Key"
    }
  };

  // 3. FAQPage schema (wrapping only visible FAQs)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": page.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  // 4. BreadcrumbList schema
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.sweetmaidcleaning.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Longboat Key",
        "item": "https://www.sweetmaidcleaning.com/longboat-key-fl/"
      }
    ]
  };

  if (page.slug !== 'hub') {
    breadcrumbs.itemListElement.push({
      "@type": "ListItem",
      "position": 3,
      "name": page.h1.replace(/\s+in\s+Longboat\s+Key,?\s*FL/i, '').trim(),
      "item": canonicalUrl
    });
  }

  return JSON.stringify([localBusiness, serviceSchema, faqSchema, breadcrumbs]);
}

export function transformLongboatHtml(html: string, key: string): string {
  const page = longboatKeyPages[key];
  if (!page) return html;

  let output = html;

  // 1. Ensure exactly one H1 and inject page.h1
  output = output.replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, `<h1 class="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 font-serif drop-shadow-md">${page.h1}</h1>`);

  // 2. Inject primary intro paragraph into hero subtext
  output = output.replace(
    /(<h1[^>]*>[\s\S]*?<\/h1>\s*<p[^>]*>)[\s\S]*?(<\/p>)/i,
    `$1${page.introParagraph}$2`
  );

  // 3. Strip any residual schema scripts injected previously by templates
  output = output.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/gi, '');

  // 4. Replace FAQs with bespoke Longboat Key visible FAQs
  const bespokeFaqHtml = `<div class="space-y-4">
    ${page.faqs.map(faq => `
      <details class="group bg-gray-50 rounded-xl p-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer hover:bg-pink-50 transition">
        <summary class="flex items-center justify-between font-semibold text-lg text-gray-900">
          ${faq.q}
          <span class="transition duration-300 group-open:-rotate-180">
            <i class="fa-solid fa-chevron-down text-pink-300"></i>
          </span>
        </summary>
        <p class="mt-4 text-gray-600 leading-relaxed">
          ${faq.a}
        </p>
      </details>
    `).join('\n')}
  </div>`;

  const faqContainerRegex = /<div class="space-y-4">\s*<details[\s\S]*?<\/div>/i;
  if (faqContainerRegex.test(output)) {
    output = output.replace(faqContainerRegex, bespokeFaqHtml);
  }

  // 5. Replace "Popular Daily Cleaning Searches" keyword-link block
  output = output.replace(/<!--\s*Popular Daily Searches Matrix[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/gi, '');
  output = output.replace(/<div class="bg-gradient-to-b from-pink-50\/50 via-white to-pink-50\/30 rounded-3xl p-8 md:p-12 border border-pink-100\/80 mb-14">[\s\S]*?<\/div>\s*<\/div>/gi, '');

  // 6. Replace "Providing Top-Tier House Cleaning in Longboat Key" keyword-repeat block with natural local section
  const localSectionHtml = `
  <section class="py-16 bg-white border-t border-pink-100/70">
    <div class="max-w-4xl mx-auto px-6 text-center">
      <div class="inline-flex items-center gap-2 bg-pink-100 text-pink-700 text-xs font-bold px-3 py-1 rounded-full mb-4">
        <i class="fa-solid fa-shield-heart"></i>
        <span>Longboat Key Coastal Property Care</span>
      </div>
      <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-serif">${page.h2Keyword}</h2>
      <p class="text-gray-700 leading-relaxed text-base md:text-lg mb-4">
        ${page.bodyParagraphs[0]}
      </p>
      <p class="text-gray-600 leading-relaxed text-sm md:text-base mb-8">
        ${page.bodyParagraphs[1]}
      </p>
      
      <div class="border-t border-pink-100 pt-6 mt-6">
        <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Related Longboat Key Cleaning Services</h3>
        <div class="flex flex-wrap justify-center gap-3">
          ${page.internalLinks.map(l => `
            <a href="${l.href}" class="inline-flex items-center gap-2 bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-2xs hover:scale-105 active:scale-95">
              <i class="fa-solid fa-sparkles text-xs text-pink-500"></i>
              <span>${l.anchor}</span>
            </a>
          `).join('\n')}
        </div>
      </div>
    </div>
  </section>
  `;

  // Replace legacy Hyper-Local Authority Content Block with the bespoke local section
  output = output.replace(
    /<div class="max-w-4xl mx-auto text-center mb-14">\s*<div class="inline-flex items-center gap-2 bg-pink-100 text-pink-700[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/i,
    localSectionHtml
  );

  // 7. Map badge: Replace Bradenton HQ address with service-area positioning (NO street address!)
  const cleanMapBadgeHtml = `
  <div id="local-map-badge" class="absolute bottom-4 left-4 right-4 sm:right-auto bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-pink-100 flex flex-col sm:flex-row items-start sm:items-center gap-3 z-10">
    <div class="flex items-center gap-2.5">
      <div class="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center flex-shrink-0 text-sm">
        <i class="fa-solid fa-location-dot"></i>
      </div>
      <div>
        <div class="text-xs font-bold text-gray-900">Sweet Maid Cleaning Service</div>
        <div class="text-[11px] text-gray-600">Serving Longboat Key from our Bradenton–Lakewood Ranch base</div>
      </div>
    </div>
    <a href="https://maps.google.com/?q=Longboat+Key,+FL" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all shrink-0">
      <span>Open in Google Maps</span>
      <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
    </a>
  </div>
  `;
  output = output.replace(/<div id="local-map-badge"[^>]*>[\s\S]*?<\/div>\s*<\/div>/gi, cleanMapBadgeHtml);
  output = output.replace(/14651 Westbrook Cir Apt 312, Bradenton, FL 34211/gi, 'Serving Longboat Key from our Bradenton–Lakewood Ranch base');

  // 8. Remove the leftover "From the beaches to the ranch" line
  output = output.replace(
    /From the beaches to the ranch, our teams are in your neighborhood daily\.\s*We treat your community like our[\s\S]*?(?=<\/p>)/gi,
    'Serving Longboat Key residential and vacation rental properties with dependable, family-owned cleaning care'
  );
  output = output.replace(/From the beaches to the ranch/gi, 'Across Longboat Key');

  // 9. Purge all forbidden promotional claims
  output = output.replace(/#1\s+Rated/gi, 'Professional');
  output = output.replace(/#1/gi, '');
  output = output.replace(/\bBest\b/g, 'Trusted');
  output = output.replace(/leading provider/gi, 'family-owned provider');
  output = output.replace(/\bpremier\b/gi, 'trusted');
  output = output.replace(/top-rated/gi, 'professional');
  output = output.replace(/top rated/gi, 'professional');
  output = output.replace(/24\/7\s*Emergency\s*Service/gi, 'Same-Day Service');
  output = output.replace(/24\/7/gi, 'Flexible');
  output = output.replace(/Sweet Mind/gi, 'Sweet Maid Cleaning Service');
  output = output.replace(/Southwest Florida/gi, 'Florida');
  output = output.replace(/Westbrook/gi, '');

  // 10. Service-specific image alt texts: Format "[what's shown] – [service], Sweet Maid Cleaning Service"
  const serviceDisplayName = page.h1.replace(/\s+in\s+Longboat\s+Key,?\s*FL/i, '').trim();
  output = output.replace(/<img\s+([^>]+)>/gi, (match, rawAttrs) => {
    let attrs = rawAttrs;
    const srcMatch = attrs.match(/src=["']([^"']+)["']/i);
    const src = srcMatch ? srcMatch[1].toLowerCase() : '';

    let description = '';
    if (src.includes('11.18.08-pm-1')) {
      description = 'Clean hardwood floor in bright living area';
    } else if (src.includes('11.18.08-pm-2')) {
      description = 'Descaled walk-in shower tile and fixtures';
    } else if (src.includes('11.18.08-pm-3')) {
      description = 'Vacant apartment interior after turnover clean';
    } else if (src.includes('11.18.08-pm-4')) {
      description = 'Sanitized soaking bathtub and vanity';
    } else if (src.includes('11.18.08-pm')) {
      description = 'Spotless residential kitchen and stainless steel appliances';
    } else if (src.includes('11.18.07-pm-1')) {
      description = 'Sanitized bathroom tile and glass shower';
    } else if (src.includes('11.18.07-pm')) {
      description = 'Clean living room and sliding glass door';
    } else if (src.includes('11.18.09-pm-1')) {
      description = 'Freshly made bedroom linens in vacation rental';
    } else if (src.includes('11.18.09-pm-2')) {
      description = 'Dusted living room furniture and polished surfaces';
    } else if (src.includes('11.18.09-pm-3')) {
      description = 'Detailed kitchen cabinetry and counters';
    } else if (src.includes('11.18.09-pm')) {
      description = 'Scrubbed kitchen island sink and surfaces';
    } else if (src.includes('11.18.06-pm')) {
      description = 'Degreased gas stovetop and backsplash';
    } else if (src.includes('3.46.50-pm')) {
      description = 'Clean commercial office desks and workspace';
    } else if (src.includes('3.47.15-pm')) {
      description = 'Vacuumed condo living room and sliding glass doors';
    } else if (src.includes('12.07.26-pm')) {
      description = 'Post-construction floor cleanup and dust extraction';
    } else if (src.includes('11.17.59-pm')) {
      description = 'Restocked bathroom amenities and clean towels';
    } else if (src.includes('11.17.58-pm')) {
      description = 'Washed patio pavers and lanai deck';
    } else if (src.includes('carpet')) {
      description = 'Steam extraction cleaning on carpet fibers';
    } else if (src.includes('window')) {
      description = 'Streak-free squeegee cleaning on window glass';
    } else if (src.includes('logo')) {
      return match.replace(/alt=["'][^"']*["']/i, 'alt="Sweet Maid Cleaning Service logo"');
    } else if (src.includes('google')) {
      return match.replace(/alt=["'][^"']*["']/i, 'alt="Google logo"');
    }

    if (description) {
      const formattedAlt = `${description} – ${serviceDisplayName}, Sweet Maid Cleaning Service`;
      if (attrs.includes('alt=')) {
        attrs = attrs.replace(/alt=["'][^"']*["']/i, `alt="${formattedAlt}"`);
      } else {
        attrs += ` alt="${formattedAlt}"`;
      }
      return `<img ${attrs}>`;
    }

    return match;
  });

  return output;
}
