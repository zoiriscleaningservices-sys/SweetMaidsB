import { Metadata } from 'next';
import { resolveAnyLocation, formatName, serviceSlugs, getNearestLocations } from '@/lib/data';
import { is305Area } from '@/lib/miami_broward_slugs';
import Link from 'next/link';

interface Props {
  params: Promise<{ slug: string; service: string }>;
}

const shortServiceMap: Record<string, string> = {
  'medical-dental-facility-cleaning': 'Medical & Dental Cleaning',
  'industrial-warehouse-cleaning': 'Warehouse Janitorial',
  'church-worship-center-cleaning': 'Church Cleaning',
  'property-management-janitorial': 'Property Janitorial',
  'law-firm-office-cleaning': 'Law Firm Cleaning',
  'restaurant-kitchen-cleaning': 'Kitchen Cleaning',
  'gym-fitness-center-cleaning': 'Gym Cleaning',
  'oven-appliance-deep-cleaning': 'Oven Cleaning',
  'eviction-cleanout-service': 'Eviction Cleanout',
  'hoarder-cleaning-service': 'Hoarding Cleanout',
  'exterior-soft-washing': 'Soft Washing',
  'tile-and-grout-cleaning': 'Tile & Grout Cleaning',
  'pet-hair-removal-cleaning': 'Pet Hair Cleaning',
  'post-construction-cleaning': 'Post-Construction Cleaning',
  'post-renovation-cleaning': 'Post-Renovation Cleaning',
  'luxury-penthouse-cleaning': 'Penthouse Cleaning',
  'luxury-estate-cleaning': 'Luxury Estate Cleaning',
  'vacation-rental-cleaning': 'Vacation Rental Cleaning',
  'janitorial-cleaning-services': 'Janitorial Cleaning',
  'office-janitorial-services': 'Office Janitorial',
  'school-daycare-cleaning': 'Daycare Cleaning'
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, service } = await params;
  const locData = resolveAnyLocation(slug);
  const locationName = locData ? formatName(locData.name) : formatName(slug.replace(/-/g, ' '));
  const serviceName = formatName(service.replace(/-/g, ' '));
  const displaySrv = shortServiceMap[service] || serviceName;

  let title: string;
  const candidate1 = `2026 ${displaySrv} Cost in ${locationName}, FL | Sweet Maid Rates`;
  const candidate2 = `2026 ${displaySrv} Cost in ${locationName}, FL | Price Guide`;
  const candidate3 = `${displaySrv} Cost in ${locationName}, FL | Sweet Maid`;

  if (candidate1.length <= 65 && candidate1.length >= 52) {
    title = candidate1;
  } else if (candidate2.length <= 65 && candidate2.length >= 50) {
    title = candidate2;
  } else if (candidate3.length <= 65) {
    title = candidate3;
  } else {
    title = `${displaySrv} Cost in ${locationName}, FL`;
  }

  const description = `Find out how much ${serviceName.toLowerCase()} costs in ${locationName}, Florida. View average hourly rates, square footage pricing, and instant free quotes from Sweet Maid.`;

  return {
    title,
    description,
    keywords: `${serviceName} cost ${locationName} FL, cleaning prices ${locationName}, maid rates ${locationName} Florida, cleaning service estimate`,
    alternates: {
      canonical: `https://sweetmaidcleaning.com/cost/${slug}/${service}/`,
    },
    openGraph: {
      title,
      description,
      url: `https://sweetmaidcleaning.com/cost/${slug}/${service}/`,
      type: 'website',
    },
  };
}

export default async function CostEstimatorPage({ params }: Props) {
  const { slug, service } = await params;
  const locData = resolveAnyLocation(slug);
  const locationName = locData ? formatName(locData.name) : formatName(slug.replace(/-/g, ' '));
  const serviceName = formatName(service.replace(/-/g, ' '));
  const displaySrv = shortServiceMap[service] || serviceName;

  const is305 = is305Area(slug, locationName);
  const phoneFormatted = is305 ? "(305) 851-6959" : "(941) 222-2080";
  const phoneTel = is305 ? "tel:13058516959" : "tel:19412222080";
  const nearestLocations = getNearestLocations(slug, 10);

  // Dynamic realistic rates based on service type
  let basePrice = 149;
  let hourlyRate = 45;
  if (service.includes('deep') || service.includes('move')) {
    basePrice = 219;
    hourlyRate = 55;
  } else if (service.includes('commercial') || service.includes('office')) {
    basePrice = 199;
    hourlyRate = 50;
  } else if (service.includes('carpet') || service.includes('pressure')) {
    basePrice = 129;
    hourlyRate = 60;
  }

  const pricingTiers = [
    { size: "Studio / 1 Bedroom (< 1,000 sq ft)", estHours: "2 - 3 hrs", estCost: `$${basePrice} - $${basePrice + 50}` },
    { size: "2 - 3 Bedroom Home (1,000 - 2,200 sq ft)", estHours: "3 - 4.5 hrs", estCost: `$${basePrice + 60} - $${basePrice + 130}` },
    { size: "4+ Bedroom Estate (2,200 - 3,500 sq ft)", estHours: "4.5 - 6 hrs", estCost: `$${basePrice + 140} - $${basePrice + 240}` },
    { size: "Luxury Estate (3,500+ sq ft)", estHours: "Custom Crew", estCost: `$${basePrice + 250}+ (Custom Quote)` },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50/50 via-white to-pink-50/30 text-gray-800 font-sans">
      {/* Header Bar */}
      <header className="border-b border-pink-100 bg-white/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2" aria-label="Sweet Maid Home">
            <span className="text-2xl font-bold text-pink-600 font-serif">Sweet Maid</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="#quote"
              className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white text-sm font-bold px-5 py-2 rounded-full shadow-md transition-all flex items-center gap-1.5"
              aria-label="Get Free Quote"
            >
              <i className="fa-solid fa-file-invoice-dollar text-xs"></i> Get Free Quote
            </Link>
            <a
              href={phoneTel}
              className="hidden sm:inline-flex bg-pink-50 hover:bg-pink-100 text-pink-600 text-sm font-bold px-4 py-2 rounded-full border border-pink-200 transition-colors"
              aria-label="Call Sweet Maid for Quote"
            >
              {phoneFormatted}
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-4 py-12 md:py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-pink-100/80 text-pink-700 text-xs md:text-sm font-bold px-3 py-1 rounded-full mb-4">
            <span>📍 Local Market Pricing</span>
            <span>•</span>
            <span>Updated 2026</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 font-serif leading-tight">
            2026 {displaySrv} Cost in {locationName}, FL
          </h1>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            Comprehensive pricing guide and average rates for professional {serviceName.toLowerCase()} throughout {locationName}, Florida.
          </p>
        </div>

        {/* Pricing Table Section */}
        <section className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-pink-100/80 mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 font-serif">
            Average {displaySrv} Rates in {locationName}
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Estimated costs based on property size, required labor hours, and local market averages.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-pink-100 text-pink-900 text-sm">
                  <th className="py-3 px-4 font-bold">Home Size</th>
                  <th className="py-3 px-4 font-bold">Est. Cleaning Time</th>
                  <th className="py-3 px-4 font-bold">Price Range (Est.)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pink-50 text-sm">
                {pricingTiers.map((tier, idx) => (
                  <tr key={idx} className="hover:bg-pink-50/40 transition-colors">
                    <td className="py-4 px-4 font-semibold text-gray-800">{tier.size}</td>
                    <td className="py-4 px-4 text-gray-600">{tier.estHours}</td>
                    <td className="py-4 px-4 font-bold text-pink-600">{tier.estCost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Cost Factors Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-sm">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 text-xl mb-4">
              <i className="fa-solid fa-ruler-combined"></i>
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Home Square Footage</h3>
            <p className="text-gray-600 text-sm">
              Larger floor plans and multiple floors require additional cleaning staff and specialized floor care equipment.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-sm">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 text-xl mb-4">
              <i className="fa-solid fa-sparkles"></i>
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Service Frequency</h3>
            <p className="text-gray-600 text-sm">
              Recurring weekly or bi-weekly maid services receive up to 20% discount compared to one-time deep cleaning.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-sm">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 text-xl mb-4">
              <i className="fa-solid fa-paw"></i>
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Pets &amp; Add-ons</h3>
            <p className="text-gray-600 text-sm">
              Intensive pet hair removal, inside oven, inside fridge, and interior window tracks can be added for a small flat fee.
            </p>
          </div>
        </section>

        {/* Instant Quote CTA */}
        <section className="bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-3xl p-8 md:p-12 text-center shadow-2xl relative overflow-hidden">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 font-serif">
            Get Your Exact Price in 60 Seconds
          </h2>
          <p className="text-pink-100 text-lg max-w-xl mx-auto mb-8">
            No hidden fees. 100% Satisfaction Guaranteed. Licensed & Insured local cleaners in {locationName}.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="#quote"
              className="bg-white hover:bg-pink-50 text-pink-600 font-bold px-8 py-4 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
              aria-label={`Get Free Quote for ${serviceName} in ${locationName}`}
            >
              <i className="fa-solid fa-file-invoice-dollar"></i> Get a Free Quote
            </Link>
            <Link
              href={`/${slug}/${service}/`}
              className="bg-pink-700/60 hover:bg-pink-700/80 text-white font-bold px-8 py-4 rounded-full border border-pink-300/40 transition-colors"
              aria-label={`Book ${serviceName} in ${locationName}`}
            >
              View Service Details
            </Link>
            <a
              href={phoneTel}
              className="bg-pink-700/60 hover:bg-pink-700/80 text-white font-bold px-8 py-4 rounded-full border border-pink-300/40 transition-colors"
              aria-label="Call for Instant Estimate"
            >
              Call {phoneFormatted}
            </a>
          </div>
        </section>

        {/* Contact Form Section */}
        <section id="quote" className="mt-14 bg-white rounded-3xl shadow-xl p-6 md:p-10 border border-pink-100 scroll-mt-28">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <div className="inline-flex items-center gap-2 bg-pink-100/80 text-pink-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
                <i className="fa-solid fa-file-invoice-dollar"></i>
                <span>Fast &amp; Free Estimate</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 font-serif">
                Get a Free Quote in {locationName}
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Fill out the form below and we will get back to you within 24 hours with a personalized, transparent quote for {serviceName.toLowerCase()} in {locationName}.
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-500 shrink-0">
                    <i className="fas fa-phone text-lg"></i>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Direct Phone</p>
                    <a href={phoneTel} className="text-pink-600 font-bold hover:underline">{phoneFormatted}</a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-500 shrink-0">
                    <i className="fas fa-envelope text-lg"></i>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Email Support</p>
                    <a href="mailto:info@sweetmaidcleaning.com" className="text-gray-600 hover:text-pink-600 transition-colors">
                      info@sweetmaidcleaning.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-500 shrink-0">
                    <i className="fas fa-clock text-lg"></i>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Hours</p>
                    <p className="text-gray-600">Mon-Sat: 8AM - 6PM</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-500 shrink-0">
                    <i className="fas fa-shield-alt text-lg"></i>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Sweet Maid Guarantee</p>
                    <p className="text-gray-600">100% Satisfaction &amp; Sparkle Guarantee</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full">
              <form className="quote-card" id="quoteForm">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 font-serif">Get a Free Quote</h2>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">Fill out the form below and we will get back to you within 24 hours with a personalized quote.</p>

                <div className="field">
                  <label htmlFor="service">What Are You Looking For?</label>
                  <select
                    id="service"
                    name="service"
                    required
                    defaultValue={
                      service.includes('deep') ? 'deep-clean' :
                      service.includes('move') ? 'move-in-out' :
                      (service.includes('commercial') || service.includes('office') || service.includes('janitorial') || service.includes('warehouse')) ? 'commercial' :
                      (service.includes('airbnb') || service.includes('vacation')) ? 'airbnb' :
                      (service.includes('construction') || service.includes('renovation')) ? 'post-construction' :
                      (service.includes('recurring') || service.includes('maid')) ? 'recurring' :
                      'residential'
                    }
                  >
                    <option value="" disabled>Choose Service</option>
                    <option value="residential">Residential Cleaning</option>
                    <option value="recurring">Recurring Cleaning</option>
                    <option value="commercial">Commercial Cleaning</option>
                    <option value="airbnb">Airbnb / Turnover Cleaning</option>
                    <option value="deep-clean">Deep Cleaning</option>
                    <option value="move-in-out">Move In / Move Out Cleaning</option>
                    <option value="post-construction">Post Construction Cleaning</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="field">
                  <label htmlFor="fullName">Full Name</label>
                  <input type="text" id="fullName" name="fullName" required placeholder="Your full name" />
                </div>

                <div className="field-row">
                  <div className="field">
                    <label htmlFor="phone">Phone Number</label>
                    <input type="tel" id="phone" name="phone" required placeholder="(941) 000-0000" />
                  </div>
                  <div className="field">
                    <label htmlFor="email">Email Address</label>
                    <input type="email" id="email" name="email" required placeholder="name@example.com" />
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="address">Address</label>
                  <input type="text" id="address" name="address" placeholder="Start typing your address..." />
                  <small style={{ display: 'block', marginTop: '6px', fontSize: '13px', color: '#9aa2ad' }}>Optional</small>
                </div>

                <button type="submit" className="submit-btn">Get My Free Quote →</button>

                <div className="field consent-field">
                  <label className="consent-label">
                    <input type="checkbox" id="smsConsent" name="smsConsent" required />
                    <span>I consent to receive SMS notifications and alerts from Sweet Maid Cleaning Service.</span>
                  </label>
                  <div className="consent-links">
                    <Link href="/terms-and-conditions/" target="_blank" rel="noopener">Terms and Conditions</Link>
                    <span> · </span>
                    <Link href="/privacy-policy/" target="_blank" rel="noopener">Privacy Policy</Link>
                  </div>
                </div>

                <div className="trust-row">
                  <span className="stars">★★★★★</span>
                  <span>5 Star Rated</span>
                  <span>•</span>
                  <span>Insured &amp; Bonded</span>
                </div>

                <div className="call-line">
                  Prefer to talk? Call <a href={phoneTel}>{phoneFormatted}</a>
                </div>
              </form>

              <div className="success-card" id="successCard">
                <div className="success-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 13l4 4L19 7" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h2>Thank You for Submitting Your Request</h2>
                <p>We&apos;ve received your information and a member of our team will reach out shortly to confirm your free quote.</p>
                <div className="call-line">
                  Questions in the meantime? Call <a href={phoneTel}>{phoneFormatted}</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Explore Nearby Cleaning Service Areas */}
        <section className="mt-14 bg-white rounded-3xl p-8 border border-pink-100/80 text-center shadow-xs" aria-label="Explore Nearby Cleaning Service Areas">
          <div className="inline-flex items-center gap-2 bg-pink-100/80 text-pink-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
            <i className="fa-solid fa-map-pin"></i>
            <span>Local Florida Service Network</span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 font-serif mb-2">
            Explore Nearby Cleaning Service Areas Around {locationName}
          </h3>
          <p className="text-xs md:text-sm text-gray-500 mb-6 max-w-2xl mx-auto">
            Sweet Maid delivers top-rated professional cleaning services across {locationName} and neighboring communities:
          </p>
          <div className="flex flex-wrap justify-center items-center gap-y-2.5 text-sm">
            {nearestLocations.map((item, idx) => (
              <span key={item.slug} className="inline-flex items-center">
                <Link
                  href={`/${item.slug}/`}
                  className="text-gray-600 hover:text-pink-600 font-medium transition-colors"
                  aria-label={`Explore Sweet Maid cleaning services in ${item.name}, FL`}
                >
                  {item.name}
                </Link>
                {idx < nearestLocations.length - 1 && (
                  <span className="text-pink-300 mx-2.5 select-none">•</span>
                )}
              </span>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-pink-100 py-8 bg-white text-center text-xs text-gray-500">
        <p className="mb-2">© 2026 Sweet Maid Cleaning Services. Serving {locationName} and all 799+ Florida communities.</p>
        <div className="flex justify-center gap-6">
          <Link href="/privacy-policy/" className="hover:text-pink-500 transition-colors">Privacy Policy</Link>
          <Link href="/terms-and-conditions/" className="hover:text-pink-500 transition-colors">Terms &amp; Conditions</Link>
        </div>
      </footer>
    </div>
  );
}
