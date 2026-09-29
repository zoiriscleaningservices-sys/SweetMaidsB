import { Metadata } from 'next';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { BUSINESS_INFO, CANONICAL_HOST, REGIONS } from '@/config/site-structure';

export const metadata: Metadata = {
  title: 'About Us | Family-Owned Florida Cleaning Company | Sweet Maid',
  description: 'Family-owned Florida cleaning company founded by Leo. Providing dependable residential and commercial cleaning across Florida communities. Learn more.',
  alternates: {
    canonical: `${CANONICAL_HOST}/about/`,
  },
  openGraph: {
    title: 'About Us | Family-Owned Florida Cleaning Company | Sweet Maid',
    description: 'Family-owned Florida cleaning company founded by Leo. Providing dependable residential and commercial cleaning across Florida communities.',
    url: `${CANONICAL_HOST}/about/`,
    type: 'website',
    images: [`${CANONICAL_HOST}/images/logo.png`],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | Family-Owned Florida Cleaning Company | Sweet Maid',
    description: 'Family-owned Florida cleaning company founded by Leo. Providing dependable residential and commercial cleaning across Florida communities.',
    images: [`${CANONICAL_HOST}/images/logo.png`],
  },
};

function getAboutFacts() {
  try {
    const factsPath = path.join(process.cwd(), 'about_facts.json');
    if (fs.existsSync(factsPath)) {
      return JSON.parse(fs.readFileSync(factsPath, 'utf8'));
    }
  } catch (e) {
    // fallback
  }
  return {
    founding_year: '',
    founder_story: '',
    team_size: '',
    how_we_vet_cleaners: '',
    supplies_policy: '',
    service_guarantee: ''
  };
}

export default function AboutPage() {
  const facts = getAboutFacts();
  const readyRegions = Object.values(REGIONS).filter(r => r.ready);

  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": `${CANONICAL_HOST}/about/#webpage`,
        "url": `${CANONICAL_HOST}/about/`,
        "name": "About Sweet Maid Cleaning Service",
        "description": "Learn about Sweet Maid Cleaning Service, a family-owned residential and commercial cleaning company serving Florida communities.",
        "isPartOf": {
          "@type": "WebSite",
          "@id": `${CANONICAL_HOST}/#website`,
          "name": BUSINESS_INFO.name,
          "url": `${CANONICAL_HOST}/`
        }
      },
      {
        "@type": "Organization",
        "@id": `${CANONICAL_HOST}/#organization`,
        "name": BUSINESS_INFO.name,
        "url": `${CANONICAL_HOST}/`,
        "logo": `${CANONICAL_HOST}/images/logo.png`,
        "founder": {
          "@type": "Person",
          "name": "Leo"
        },
        "telephone": BUSINESS_INFO.phone,
        "email": BUSINESS_INFO.email,
        "sameAs": BUSINESS_INFO.socialProfiles
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <div className="min-h-screen bg-slate-50 text-gray-800 flex flex-col font-sans">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-pink-100 shadow-xs">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <img src="/images/logo.png" alt="Sweet Maid" className="h-14 w-auto object-contain" />
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-700">
              <Link href="/" className="hover:text-pink-600 transition">Home</Link>
              <Link href="/services/" className="hover:text-pink-600 transition">Services</Link>
              <Link href="/locations/" className="hover:text-pink-600 transition">Locations</Link>
              <Link href="/about/" className="text-pink-600">About</Link>
              <Link href="/blog/" className="hover:text-pink-600 transition">Blog</Link>
            </nav>

            <div className="flex items-center gap-4">
              <a href="tel:19412222080" className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-pink-600 hover:text-pink-700">
                <i className="fa-solid fa-phone"></i> (941) 222-2080
              </a>
              <Link href="/book-online/" className="bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-full shadow-sm transition">
                Get Free Quote
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative pt-16 pb-14 bg-gradient-to-b from-pink-50/70 via-white to-slate-50 text-center px-6 border-b border-pink-100/60">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-pink-100/80 text-pink-800 text-xs font-bold px-4 py-1.5 rounded-full mb-6 shadow-2xs">
              <i className="fa-solid fa-heart text-pink-500"></i> Family-Owned Florida Cleaning Company
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 font-serif leading-tight mb-4">
              About Sweet Maid Cleaning Service
            </h1>
            <p className="text-base sm:text-xl text-gray-600 font-light leading-relaxed">
              Sweet Maid is a family-owned residential and commercial cleaning company founded by Leo, serving communities across Florida with dependable, personalized care.
            </p>
          </div>
        </section>

        {/* Section 1: Our Story */}
        <section className="py-16 bg-white border-b border-pink-100/60">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div className="text-xs font-bold text-pink-600 uppercase tracking-wider mb-2">Our Roots</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-serif mb-6">Our Story</h2>
            
            <div className="prose prose-pink max-w-none text-gray-700 leading-relaxed space-y-4 text-base">
              <p>
                Sweet Maid began with a simple commitment: providing Florida families and businesses with genuine, thorough cleaning services that treat every property with respect. Founded and led by owner Leo, our family-owned company believes that a spotless environment creates peace of mind and comfort.
              </p>
              {facts.founding_year && (
                <p>
                  Established in {facts.founding_year}, we have continually focused on building lasting relationships with local Florida homeowners and property managers.
                </p>
              )}
              {facts.founder_story && (
                <p>{facts.founder_story}</p>
              )}
              {facts.team_size && (
                <p>Our dedicated team of {facts.team_size} cleaning professionals works diligently across our active Florida regions.</p>
              )}
              <p>
                Rather than treating housekeeping as a one-size-fits-all routine, we listen closely to your specific priorities, ensuring that kitchens, bathrooms, bedrooms, and commercial workspaces receive tailored attention on every scheduled visit.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: How We Work */}
        <section className="py-16 bg-slate-50 border-b border-pink-100/60">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div className="text-xs font-bold text-pink-600 uppercase tracking-wider mb-2">Our Process</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-serif mb-6">How We Work</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-pink-50 text-pink-500 flex items-center justify-center text-xl mb-4">
                  <i className="fa-solid fa-list-check"></i>
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-2">Personalized Checklists</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Every home is unique. We review your layout and requirements to formulate a customized room-by-room action plan.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-pink-50 text-pink-500 flex items-center justify-center text-xl mb-4">
                  <i className="fa-solid fa-clock"></i>
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-2">Dependable Scheduling</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  We value your time. Our cleaning specialists arrive promptly within your designated appointment window.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-pink-50 text-pink-500 flex items-center justify-center text-xl mb-4">
                  <i className="fa-solid fa-shield-cat"></i>
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-2">Respect for Your Home</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  We treat your furniture, personal belongings, and pets with utmost care, maintaining a discreet and courteous presence.
                </p>
              </div>
            </div>

            {facts.how_we_vet_cleaners && (
              <div className="mt-8 bg-white p-6 rounded-2xl border border-pink-100 text-sm text-gray-700">
                <h4 className="font-bold text-gray-900 mb-2">Our Cleaner Standards:</h4>
                <p>{facts.how_we_vet_cleaners}</p>
              </div>
            )}

            {facts.supplies_policy && (
              <div className="mt-4 bg-white p-6 rounded-2xl border border-pink-100 text-sm text-gray-700">
                <h4 className="font-bold text-gray-900 mb-2">Supplies & Equipment:</h4>
                <p>{facts.supplies_policy}</p>
              </div>
            )}
          </div>
        </section>

        {/* Section 3: Where We Serve in Florida */}
        <section className="py-16 bg-white border-b border-pink-100/60">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div className="text-xs font-bold text-pink-600 uppercase tracking-wider mb-2">Coverage Map</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-serif mb-4">Where We Serve in Florida</h2>
            <p className="text-sm text-gray-600 mb-8 leading-relaxed">
              We provide residential and commercial cleaning across established regional hubs in Florida. Select any active hub to explore local service details:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {readyRegions.map((reg) => (
                <Link
                  key={reg.slug}
                  href={`/${reg.slug}/`}
                  className="p-3.5 rounded-xl bg-slate-50 hover:bg-pink-50/70 border border-pink-100 text-xs font-semibold text-gray-800 hover:text-pink-600 transition flex items-center justify-between"
                >
                  <span>{reg.name}</span>
                  <i className="fa-solid fa-arrow-right text-[10px] text-pink-400"></i>
                </Link>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link href="/locations/" className="text-xs font-bold text-pink-600 hover:underline">
                Explore Full Florida Locations Directory →
              </Link>
            </div>
          </div>
        </section>

        {/* Section 4: What to Expect on a Visit */}
        <section className="py-16 bg-slate-50 border-b border-pink-100/60">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div className="text-xs font-bold text-pink-600 uppercase tracking-wider mb-2">Customer Experience</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-serif mb-6">What to Expect on a Visit</h2>

            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-2xs flex items-start gap-4">
                <span className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 font-bold flex items-center justify-center text-sm shrink-0">1</span>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1">Clear Arrival Communication</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">You receive prompt notice before our team arrives so you always know when to expect us.</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-2xs flex items-start gap-4">
                <span className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 font-bold flex items-center justify-center text-sm shrink-0">2</span>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1">Comprehensive Room Detailing</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">From dusting hard-to-reach ceiling fan blades to scrubbing bathroom tile, our crew proceeds methodically through your checklist.</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-2xs flex items-start gap-4">
                <span className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 font-bold flex items-center justify-center text-sm shrink-0">3</span>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1">Final Quality Check</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">We conduct a careful visual inspection before departing, ensuring every countertop, floor, and sink meets our high standards.</p>
                </div>
              </div>
            </div>

            {facts.service_guarantee && (
              <div className="mt-8 bg-pink-50/70 p-5 rounded-2xl border border-pink-200 text-xs text-pink-900">
                <h4 className="font-bold mb-1">Our Service Guarantee:</h4>
                <p>{facts.service_guarantee}</p>
              </div>
            )}
          </div>
        </section>

        {/* Section 5: CTA */}
        <section className="py-20 bg-white text-center px-6">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 font-serif mb-4">
              Ready for a Spotless Florida Home?
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mb-8 leading-relaxed">
              Connect with our friendly family-owned team today to schedule your cleaning appointment or receive a free customized estimate.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/book-online/"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white rounded-full font-bold shadow-md hover:shadow-lg transition-all"
              >
                Get a Free Quote
              </Link>
              <a
                href="tel:19412222080"
                className="w-full sm:w-auto px-8 py-4 bg-pink-50 hover:bg-pink-100 text-pink-600 rounded-full font-bold border border-pink-200 transition-colors flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-phone"></i> (941) 222-2080
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-900 text-gray-400 py-12 text-xs border-t border-slate-800 mt-auto">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>&copy; 2026 Sweet Maid Cleaning Service. All rights reserved.</div>
            <div className="flex gap-4">
              <Link href="/privacy-policy/" className="hover:text-white transition">Privacy Policy</Link>
              <Link href="/terms-and-conditions/" className="hover:text-white transition">Terms & Conditions</Link>
              <Link href="/locations/" className="hover:text-white transition">Locations</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
