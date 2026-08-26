import { Metadata } from 'next';
import { resolveAnyLocation, formatName, serviceSlugs } from '@/lib/data';
import Link from 'next/link';

interface Props {
  params: Promise<{ slug: string; service: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, service } = await params;
  const locData = resolveAnyLocation(slug);
  const locationName = locData ? formatName(locData.name) : formatName(slug.replace(/-/g, ' '));
  const serviceName = formatName(service.replace(/-/g, ' '));

  const title = `2026 ${serviceName} Cost in ${locationName}, FL | Price Calculator & Rates`;
  const description = `Find out how much ${serviceName.toLowerCase()} costs in ${locationName}, Florida. View average hourly rates, square footage pricing, and instant free quotes from Sweet Maid.`;

  return {
    title,
    description,
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
              href={`/${slug}/${service}/`}
              className="text-sm font-semibold text-gray-600 hover:text-pink-600 transition-colors"
              aria-label={`View ${serviceName} in ${locationName}`}
            >
              View Service Details
            </Link>
            <a
              href="tel:19412222080"
              className="bg-pink-500 hover:bg-pink-600 text-white text-sm font-bold px-4 py-2 rounded-full transition-colors"
              aria-label="Call Sweet Maid for Quote"
            >
              (941) 222-2080
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
            How Much Does <span className="text-pink-600">{serviceName}</span> Cost in {locationName}, FL?
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            The average cost for professional {serviceName.toLowerCase()} in {locationName}, Florida ranges from <strong>${basePrice} to ${basePrice + 160}</strong> depending on home size, condition, and frequency.
          </p>
        </div>

        {/* Pricing Estimator Table */}
        <section className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-pink-100 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 font-serif">
            Estimated {serviceName} Rates in {locationName}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-pink-100 text-pink-700 text-sm md:text-base">
                  <th className="py-4 px-4 font-bold">Property Size</th>
                  <th className="py-4 px-4 font-bold">Est. Cleaning Time</th>
                  <th className="py-4 px-4 font-bold">Average Price Range</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pink-50 text-gray-700 text-sm md:text-base">
                {pricingTiers.map((tier, idx) => (
                  <tr key={idx} className="hover:bg-pink-50/40 transition-colors">
                    <td className="py-4 px-4 font-medium">{tier.size}</td>
                    <td className="py-4 px-4 text-gray-500">{tier.estHours}</td>
                    <td className="py-4 px-4 font-bold text-gray-900">{tier.estCost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 p-4 rounded-2xl bg-pink-50 text-xs md:text-sm text-gray-600 flex items-center gap-3">
            <span className="text-lg">💡</span>
            <span><strong>Pro-Tip:</strong> Booking recurring service (weekly or bi-weekly) saves up to <strong>20%</strong> on every clean in {locationName}.</span>
          </div>
        </section>

        {/* Cost Factors */}
        <section className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-sm">
            <div className="text-2xl mb-3">📐</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Square Footage & Bedrooms</h3>
            <p className="text-sm text-gray-600">Larger layouts and multiple bathrooms require additional crew hours and specialized sanitization products.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-sm">
            <div className="text-2xl mb-3">✨</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Deep Clean vs. Maintenance</h3>
            <p className="text-sm text-gray-600">First-time cleans and move-outs require deep baseboard scrub, interior oven/fridge detailing, and grime extraction.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-sm">
            <div className="text-2xl mb-3">🌴</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Florida Climate Factors</h3>
            <p className="text-sm text-gray-600">Humidity, salt air, and pet hair in {locationName} require specialized HEPA filtration and moisture-safe cleaners.</p>
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
              href={`/${slug}/${service}/`}
              className="bg-white hover:bg-pink-50 text-pink-600 font-bold px-8 py-4 rounded-full shadow-lg transition-transform hover:scale-105"
              aria-label={`Book ${serviceName} in ${locationName}`}
            >
              Book {serviceName} Now
            </Link>
            <a
              href="tel:19412222080"
              className="bg-pink-700/60 hover:bg-pink-700/80 text-white font-bold px-8 py-4 rounded-full border border-pink-300/40 transition-colors"
              aria-label="Call for Instant Estimate"
            >
              Call (941) 222-2080
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-pink-100 py-8 bg-white text-center text-xs text-gray-500">
        <p>© 2026 Sweet Maid Cleaning Services. Serving {locationName} and all 799+ Florida communities.</p>
      </footer>
    </div>
  );
}
