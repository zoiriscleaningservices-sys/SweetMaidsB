import { Metadata } from 'next';
import Link from 'next/link';
import { BUSINESS_INFO, CANONICAL_HOST, PRICING_FROM } from '@/config/site-structure';

export const metadata: Metadata = {
  title: 'Professional Cleaning & Maid Services in Florida | Sweet Maid',
  description: 'Explore 24 professional cleaning and property care services by Sweet Maid Cleaning Service. Upfront pricing from $180, family-owned care, and dependable service across Florida.',
  alternates: {
    canonical: 'https://www.sweetmaidcleaning.com/services/',
  },
  openGraph: {
    title: 'Professional Cleaning & Maid Services in Florida | Sweet Maid',
    description: 'Explore 24 professional cleaning and property care services by Sweet Maid Cleaning Service. Upfront pricing from $180, family-owned care, and dependable service across Florida.',
    url: 'https://www.sweetmaidcleaning.com/services/',
    type: 'website',
    images: [`${CANONICAL_HOST}/images/logo.png`],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Professional Cleaning & Maid Services in Florida | Sweet Maid',
    description: 'Explore 24 professional cleaning and property care services by Sweet Maid Cleaning Service.',
    images: [`${CANONICAL_HOST}/images/logo.png`],
  },
};

interface ServiceItem {
  name: string;
  slug: string;
  badge?: string;
  priceNote: string;
  description: string;
  features: string[];
}

const residentialServices: ServiceItem[] = [
  {
    name: 'House Cleaning',
    slug: 'house-cleaning',
    badge: 'Popular',
    priceNote: `From $${PRICING_FROM.standard_cleaning}`,
    description: 'Complete home maintenance cleaning covering kitchens, bathrooms, living areas, dusting, vacuuming, and mopping.',
    features: ['Dusting all surfaces & baseboards', 'Sanitizing countertops & sinks', 'Vacuuming rugs & mopping hard floors', 'Trash removal & bed making']
  },
  {
    name: 'Deep Cleaning',
    slug: 'deep-cleaning',
    badge: 'Thorough Care',
    priceNote: `From $${PRICING_FROM.deep_clean}`,
    description: 'Intensive detail cleaning designed for seasonal resets, built-up grime removal, hand-wiped baseboards, and deep scrubbing.',
    features: ['Hand-wiped baseboards & door frames', 'Deep scrub kitchen grease & backsplash', 'Detailed bathroom tile & grout scrubbing', 'Interior window sills & tracks cleaned']
  },
  {
    name: 'Recurring Maid Service',
    slug: 'recurring-maid-service',
    badge: 'Weekly / Bi-Weekly',
    priceNote: `From $${PRICING_FROM.standard_cleaning}`,
    description: 'Consistent housekeeping scheduled weekly, bi-weekly, or monthly with dedicated cleaning teams you can rely on.',
    features: ['Flexible recurring schedules', 'Consistent cleaning checklist', 'Dedicated family-owned crew', 'No long-term contracts required']
  },
  {
    name: 'Move-In & Move-Out Cleaning',
    slug: 'move-in-out-cleaning',
    priceNote: `From $${PRICING_FROM.move_out}`,
    description: 'Turnkey vacancy cleans for tenants, property owners, and realtors ensuring homes are pristine for inspection.',
    features: ['Inside cabinets, drawers & pantry', 'Inside oven & refrigerator cleaning', 'Closet shelving & baseboard wiping', 'Full sanitization for move-ready handover']
  },
  {
    name: 'Post-Construction Cleaning',
    slug: 'post-construction-cleaning',
    priceNote: `From $${PRICING_FROM.post_construction}`,
    description: 'Removal of fine drywall dust, paint overspray, sticker residue, and sawdust following renovations or new builds.',
    features: ['HEPA-filtered fine drywall dust vacuuming', 'Paint speck & adhesive removal', 'Interior glass & fixture polishing', 'Multi-phase rough & final cleanups']
  },
  {
    name: 'Carpet Cleaning',
    slug: 'carpet-cleaning',
    priceNote: 'Customized Quote',
    description: 'Professional hot-water extraction and steam cleaning for high-traffic rooms, pet dander, and deep carpet fibers.',
    features: ['Deep hot-water steam extraction', 'Spot treatment for common stains', 'Fast drying airflow methods', 'Safe for families and pets']
  },
  {
    name: 'Window Cleaning',
    slug: 'window-cleaning',
    priceNote: 'Customized Quote',
    description: 'Streak-free window cleaning for interior panes, exterior glass, sills, tracks, and sliding glass coastal doors.',
    features: ['Streak-free glass wash', 'Track & sill debris removal', 'Screen dusting & washing', 'Salt air film removal for coastal homes']
  },
  {
    name: 'Gutter Cleaning',
    slug: 'gutter-cleaning',
    priceNote: 'Customized Quote',
    description: 'Clearing roof gutters and downspouts of leaves, pine needles, and debris to protect home foundations from Florida downpours.',
    features: ['Hand removal of gutter debris', 'Downspout flush & flow check', 'Roofline inspection for blockages', 'Ground cleanup after service']
  },
  {
    name: 'Pressure Washing',
    slug: 'pressure-washing',
    priceNote: 'Customized Quote',
    description: 'Exterior surface cleaning for driveways, sidewalks, pool decks, lanais, and patios to remove algae and mildew.',
    features: ['Driveways, pavers & walkways', 'Pool decks, enclosures & lanais', 'Algae, mildew & grime removal', 'Surface-safe pressure adjustments']
  }
];

const commercialServices: ServiceItem[] = [
  {
    name: 'Commercial Cleaning',
    slug: 'commercial-cleaning',
    priceNote: `From $${PRICING_FROM.office_workplace}`,
    description: 'Scheduled commercial facility cleaning tailored to retail spaces, professional offices, and business centers.',
    features: ['Lobby & reception sanitization', 'Restroom restocking & deep cleaning', 'Breakroom & kitchen care', 'Nightly or after-hours schedules']
  },
  {
    name: 'Office & Janitorial Services',
    slug: 'office-janitorial-services',
    priceNote: `From $${PRICING_FROM.office_workplace}`,
    description: 'Dedicated janitorial care for modern office suites, tech hubs, and corporate workspaces.',
    features: ['Desk surface & electronics dusting', 'Conference room prep & cleanup', 'Trash collection & recycling', 'Floor vacuuming & damp mopping']
  },
  {
    name: 'Janitorial Cleaning Services',
    slug: 'janitorial-cleaning-services',
    priceNote: `From $${PRICING_FROM.office_workplace}`,
    description: 'Contract janitorial maintenance programs designed for commercial buildings, complexes, and multi-tenant facilities.',
    features: ['Daily, weekly, or custom frequency', 'Restroom hygiene management', 'Entryway glass & floor buffing', 'Consumable supplies management']
  },
  {
    name: 'Medical & Dental Facility Cleaning',
    slug: 'medical-dental-facility-cleaning',
    priceNote: 'Customized Protocol',
    description: 'Specialized healthcare sanitation adhering to strict surface cleaning standards for clinics and dental practices.',
    features: ['High-touch point disinfection', 'Exam room & waiting area hygiene', 'Hospital-grade surface sanitizers', 'Cross-contamination prevention protocols']
  },
  {
    name: 'Industrial & Warehouse Cleaning',
    slug: 'industrial-warehouse-cleaning',
    priceNote: 'Customized Facility Care',
    description: 'Heavy-duty maintenance for distribution centers, manufacturing shop floors, shipping bays, and utility spaces.',
    features: ['Warehouse floor sweeping & scrubbing', 'Loading dock & break area care', 'High-dusting of beams & pipes', 'Safety-compliant facility upkeep']
  },
  {
    name: 'Gym & Fitness Center Cleaning',
    slug: 'gym-fitness-center-cleaning',
    priceNote: 'Daily Sanitation',
    description: 'Health club and gym sanitation focused on equipment wiping, locker room hygiene, and odor reduction.',
    features: ['Weight bench & machine disinfection', 'Locker room & shower sanitizing', 'Rubber gym mat damp mopping', 'Continuous freshness & odor control']
  },
  {
    name: 'School & Daycare Cleaning',
    slug: 'school-daycare-cleaning',
    priceNote: 'Child-Safe Janitorial',
    description: 'Thorough school and early education center cleaning using non-toxic, child-safe cleaning formulations.',
    features: ['Play area & toy surface wipe-down', 'Classroom desk & table sanitizing', 'Restroom hand-wash station hygiene', 'Cafeteria & activity room cleaning']
  },
  {
    name: 'Church & Worship Center Cleaning',
    slug: 'church-worship-center-cleaning',
    priceNote: 'Facility Maintenance',
    description: 'Respectful care for sanctuaries, fellowship halls, classrooms, and gathering spaces for religious communities.',
    features: ['Pew & seating area cleaning', 'Fellowship hall & kitchen reset', 'Nursery & youth room sanitizing', 'Weekend prep & post-service cleanups']
  },
  {
    name: 'Floor Stripping & Waxing',
    slug: 'floor-stripping-waxing',
    priceNote: 'Commercial Floor Care',
    description: 'Restoration and protection for vinyl composition tile (VCT), linoleum, and commercial hard surface flooring.',
    features: ['Complete wax removal & stripping', 'Neutralizing wash & rinse', 'Multi-coat high-gloss wax application', 'High-traffic scuff mark removal']
  },
  {
    name: 'Property Management Janitorial',
    slug: 'property-management-janitorial',
    priceNote: 'Building Maintenance',
    description: 'Common area maintenance for condominium associations, apartment communities, and residential buildings.',
    features: ['Clubhouse & fitness center upkeep', 'Elevator & hallway dusting/mopping', 'Mailroom & lobby maintenance', 'Trash corral & amenity reset']
  }
];

const specializedServices: ServiceItem[] = [
  {
    name: 'Vacation Rental & Airbnb Cleaning',
    slug: 'airbnb-cleaning',
    badge: 'Same-Day Turnover',
    priceNote: `From $${PRICING_FROM.airbnb}`,
    description: 'Fast, dependable turnaround cleaning for short-term rental hosts with linen washing, guest staging, and restocking.',
    features: ['Linen & towel laundering on-site or off-site', 'Guest amenity replenishment', 'Photo verification of property condition', 'Prompt coordination between bookings']
  },
  {
    name: 'Luxury Estate Cleaning',
    slug: 'luxury-estate-cleaning',
    priceNote: 'Detailed Care',
    description: 'Discreet, high-touch housekeeping tailored for expansive waterfront residences, luxury estates, and penthouses.',
    features: ['Care for delicate marble, granite & quartz', 'Fine millwork & chandelier dusting', 'Customized owner preferences honored', 'Trained, vetted cleaning professionals']
  },
  {
    name: 'Home Watch Services',
    slug: 'home-watch-services',
    priceNote: 'Visual Property Checks',
    description: 'Scheduled visual inspections of absentee, seasonal, or unoccupied residences to monitor for obvious visual issues.',
    features: ['Visual check for leaks & humidity signs', 'A/C thermostat & breaker panel review', 'Exterior perimeter & entry check', 'Written visit report after each check']
  },
  {
    name: 'Property Maintenance',
    slug: 'property-maintenance',
    priceNote: 'Routine Upkeep',
    description: 'General interior and exterior maintenance upkeep helping homeowners and property managers maintain property conditions.',
    features: ['Light fixture bulb changes & filter checks', 'Door hardware & minor adjustment checks', 'Seasonal turnover property assessments', 'Preventative interior care support']
  },
  {
    name: 'Solar Panel Cleaning',
    slug: 'solar-panel-cleaning',
    priceNote: 'Pure Water Care',
    description: 'Deionized pure water washing for residential and commercial rooftop solar arrays to preserve light absorption.',
    features: ['Deionized water filtration method', 'Non-abrasive soft brush washing', 'Pollen, dust, bird drop & salt film removal', 'Chemical-free cleaning protecting warranties']
  }
];

const all24Services = [...residentialServices, ...commercialServices, ...specializedServices];

export default function ServicesDirectoryPage() {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Sweet Maid Cleaning Services Directory',
    description: 'Complete directory of 24 professional cleaning and property maintenance services offered across Florida by Sweet Maid Cleaning Service.',
    url: `${CANONICAL_HOST}/services/`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: all24Services.map((svc, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: svc.name,
        url: `${CANONICAL_HOST}/${svc.slug}/`,
        description: svc.description
      }))
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-gray-800 flex flex-col font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      {/* Top Notification Bar */}
      <div className="bg-pink-500 text-white text-xs sm:text-sm py-2 px-4 text-center font-medium shadow-inner">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <span>Family-Owned &amp; Operated Cleaning Services</span>
          <span className="hidden sm:inline">|</span>
          <a href="tel:19412222080" className="hover:underline flex items-center gap-1 font-bold">
            Call: (941) 222-2080
          </a>
        </div>
      </div>

      {/* Main Header Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-pink-100/70 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 md:h-24 relative">
            {/* Mobile Call (Left) */}
            <a
              href="tel:19412222080"
              className="lg:hidden w-10 h-10 flex items-center justify-center bg-pink-50 text-pink-500 rounded-full border border-pink-100 shadow-sm active:scale-95 transition-all"
              aria-label="Call Sweet Maid"
            >
              <i className="fa-solid fa-phone text-sm"></i>
            </a>

            {/* Brand Logo */}
            <Link href="/" className="flex items-center group absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">
              <img
                src="/images/logo.png"
                alt="Sweet Maid Cleaning Service"
                className="h-16 md:h-20 w-auto object-contain group-hover:scale-105 transition-transform"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link href="/" className="text-sm font-semibold text-gray-700 hover:text-pink-500 transition-colors">
                Home
              </Link>
              <Link href="/about/" className="text-sm font-semibold text-gray-700 hover:text-pink-500 transition-colors">
                About Us
              </Link>
              <Link href="/services/" className="text-sm font-bold text-pink-500 bg-pink-50 border border-pink-100 px-3 py-1.5 rounded-full transition-colors">
                Services
              </Link>
              <Link href="/locations/" className="text-sm font-semibold text-gray-700 hover:text-pink-500 transition-colors">
                Locations
              </Link>
              <Link href="/blog/" className="text-sm font-semibold text-gray-700 hover:text-pink-500 transition-colors">
                Blogs
              </Link>
              <Link href="/gallery/" className="text-sm font-semibold text-gray-700 hover:text-pink-500 transition-colors">
                Gallery
              </Link>
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-4">
              <a href="tel:19412222080" className="flex items-center gap-2 text-pink-500 font-bold hover:text-pink-700 transition text-sm">
                (941) 222-2080
              </a>
              <Link
                href="/book-online/"
                className="bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white text-sm px-6 py-2.5 rounded-full font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
              >
                Book Online
              </Link>
            </div>

            {/* Mobile Header Quick Action */}
            <div className="flex items-center gap-2 lg:hidden">
              <Link
                href="/book-online/"
                className="bg-gradient-to-r from-pink-400 to-pink-500 text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1 active:scale-95 transition-all"
              >
                Book
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-pink-50/70 via-white to-neutral-50 py-16 px-6 lg:px-8 border-b border-pink-100/60">
          <div className="max-w-4xl mx-auto text-center space-y-5">
            <span className="inline-block bg-pink-100/80 text-pink-700 text-xs font-bold tracking-wider px-3.5 py-1.5 rounded-full uppercase">
              Our Complete Service Directory
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight font-serif leading-tight">
              Professional Cleaning &amp; Property Care Services
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Family-owned housekeeping, thorough deep cleaning, commercial janitorial, and coastal property maintenance delivered with dependable care across Florida.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              <Link
                href="/book-online/"
                className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold text-sm px-7 py-3 rounded-full shadow-md hover:shadow-lg transition-all"
              >
                Book Online Now
              </Link>
              <a
                href="tel:19412222080"
                className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold text-sm px-6 py-3 rounded-full shadow-sm transition-all"
              >
                Call: (941) 222-2080
              </a>
            </div>

            {/* Quick Stats Pill */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-6 text-center">
              <div className="bg-white p-3 rounded-xl border border-pink-100/70 shadow-sm">
                <div className="text-lg font-bold text-pink-600">$180</div>
                <div className="text-xs text-gray-500">Standard Clean Starts</div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-pink-100/70 shadow-sm">
                <div className="text-lg font-bold text-pink-600">$250</div>
                <div className="text-xs text-gray-500">Deep Clean Starts</div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-pink-100/70 shadow-sm">
                <div className="text-lg font-bold text-pink-600">24</div>
                <div className="text-xs text-gray-500">Approved Services</div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-pink-100/70 shadow-sm">
                <div className="text-lg font-bold text-pink-600">Mon-Sat</div>
                <div className="text-xs text-gray-500">8AM - 6PM</div>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14 space-y-16">
          {/* Category 1: Residential Cleaning */}
          <section id="residential">
            <div className="border-b border-pink-100 pb-4 mb-8">
              <span className="text-xs font-bold text-pink-600 tracking-wider uppercase">Category 1</span>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-gray-900 mt-1">
                Residential House Cleaning &amp; Maid Services
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Care for houses, condos, townhomes, and seasonal Florida residences.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {residentialServices.map((svc) => (
                <div
                  key={svc.slug}
                  className="bg-white rounded-2xl border border-pink-100/80 p-6 flex flex-col justify-between hover:shadow-md transition-shadow relative group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-bold text-pink-600 bg-pink-50 px-2.5 py-1 rounded-full">
                        {svc.priceNote}
                      </span>
                      {svc.badge && (
                        <span className="text-[11px] font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                          {svc.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-pink-600 transition-colors">
                      <Link href={`/${svc.slug}/`} className="hover:underline">
                        {svc.name}
                      </Link>
                    </h3>
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                      {svc.description}
                    </p>
                    <ul className="mt-4 space-y-1.5 text-xs text-gray-500 border-t border-gray-100 pt-3">
                      {svc.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-pink-500 font-bold">•</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-5 mt-4 border-t border-gray-100 flex items-center justify-between">
                    <Link
                      href={`/${svc.slug}/`}
                      className="text-xs font-bold text-pink-600 hover:text-pink-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                    >
                      View Details &rarr;
                    </Link>
                    <Link
                      href="/book-online/"
                      className="text-xs font-semibold text-gray-600 hover:text-pink-600"
                    >
                      Book This
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Category 2: Commercial & Facility */}
          <section id="commercial">
            <div className="border-b border-pink-100 pb-4 mb-8">
              <span className="text-xs font-bold text-pink-600 tracking-wider uppercase">Category 2</span>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-gray-900 mt-1">
                Commercial Cleaning &amp; Facility Janitorial
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Dependable janitorial programs for Florida businesses, medical clinics, offices, and commercial facilities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {commercialServices.map((svc) => (
                <div
                  key={svc.slug}
                  className="bg-white rounded-2xl border border-pink-100/80 p-6 flex flex-col justify-between hover:shadow-md transition-shadow relative group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-bold text-pink-600 bg-pink-50 px-2.5 py-1 rounded-full">
                        {svc.priceNote}
                      </span>
                      {svc.badge && (
                        <span className="text-[11px] font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                          {svc.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-pink-600 transition-colors">
                      <Link href={`/${svc.slug}/`} className="hover:underline">
                        {svc.name}
                      </Link>
                    </h3>
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                      {svc.description}
                    </p>
                    <ul className="mt-4 space-y-1.5 text-xs text-gray-500 border-t border-gray-100 pt-3">
                      {svc.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-pink-500 font-bold">•</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-5 mt-4 border-t border-gray-100 flex items-center justify-between">
                    <Link
                      href={`/${svc.slug}/`}
                      className="text-xs font-bold text-pink-600 hover:text-pink-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                    >
                      View Details &rarr;
                    </Link>
                    <Link
                      href="/book-online/"
                      className="text-xs font-semibold text-gray-600 hover:text-pink-600"
                    >
                      Request Quote
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Category 3: Specialized Property Care */}
          <section id="specialized">
            <div className="border-b border-pink-100 pb-4 mb-8">
              <span className="text-xs font-bold text-pink-600 tracking-wider uppercase">Category 3</span>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-gray-900 mt-1">
                Specialized Property Care &amp; Vacation Rentals
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Tailored property support for vacation rental hosts, luxury estates, and absent homeowners.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {specializedServices.map((svc) => (
                <div
                  key={svc.slug}
                  className="bg-white rounded-2xl border border-pink-100/80 p-6 flex flex-col justify-between hover:shadow-md transition-shadow relative group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-bold text-pink-600 bg-pink-50 px-2.5 py-1 rounded-full">
                        {svc.priceNote}
                      </span>
                      {svc.badge && (
                        <span className="text-[11px] font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                          {svc.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-pink-600 transition-colors">
                      <Link href={`/${svc.slug}/`} className="hover:underline">
                        {svc.name}
                      </Link>
                    </h3>
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                      {svc.description}
                    </p>
                    <ul className="mt-4 space-y-1.5 text-xs text-gray-500 border-t border-gray-100 pt-3">
                      {svc.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-pink-500 font-bold">•</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-5 mt-4 border-t border-gray-100 flex items-center justify-between">
                    <Link
                      href={`/${svc.slug}/`}
                      className="text-xs font-bold text-pink-600 hover:text-pink-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                    >
                      View Details &rarr;
                    </Link>
                    <Link
                      href="/book-online/"
                      className="text-xs font-semibold text-gray-600 hover:text-pink-600"
                    >
                      Inquire
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Pricing Transparency Section */}
          <section className="bg-white rounded-2xl border border-pink-100 p-8 sm:p-10 shadow-sm">
            <div className="max-w-3xl">
              <span className="text-xs font-bold text-pink-600 tracking-wider uppercase">Fair &amp; Transparent</span>
              <h2 className="text-2xl font-bold font-serif text-gray-900 mt-1">
                Upfront Pricing Grounded in Reality
              </h2>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                We believe in straightforward pricing with no hidden charges. Every home and facility has unique needs, but here are our baseline starting prices for Florida clients:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              <div className="bg-pink-50/50 p-4 rounded-xl border border-pink-100">
                <div className="text-xs font-bold text-gray-500 uppercase">Standard House Clean</div>
                <div className="text-2xl font-extrabold text-pink-600 mt-1">$180 <span className="text-xs font-normal text-gray-500">starting from</span></div>
                <p className="text-xs text-gray-600 mt-1">General housekeeping for bedrooms, bathrooms, kitchen, and living areas.</p>
              </div>
              <div className="bg-pink-50/50 p-4 rounded-xl border border-pink-100">
                <div className="text-xs font-bold text-gray-500 uppercase">Deep Cleaning</div>
                <div className="text-2xl font-extrabold text-pink-600 mt-1">$250 <span className="text-xs font-normal text-gray-500">starting from</span></div>
                <p className="text-xs text-gray-600 mt-1">Intensive detail cleaning including hand-wiped baseboards and buildup scrubbing.</p>
              </div>
              <div className="bg-pink-50/50 p-4 rounded-xl border border-pink-100">
                <div className="text-xs font-bold text-gray-500 uppercase">Move-In / Move-Out Clean</div>
                <div className="text-2xl font-extrabold text-pink-600 mt-1">$350 <span className="text-xs font-normal text-gray-500">starting from</span></div>
                <p className="text-xs text-gray-600 mt-1">Complete vacancy scrub including inside appliances, cabinets, and drawers.</p>
              </div>
              <div className="bg-pink-50/50 p-4 rounded-xl border border-pink-100">
                <div className="text-xs font-bold text-gray-500 uppercase">Airbnb / Vacation Rental</div>
                <div className="text-2xl font-extrabold text-pink-600 mt-1">$250 <span className="text-xs font-normal text-gray-500">starting from</span></div>
                <p className="text-xs text-gray-600 mt-1">Rapid turnover cleaning, linen laundering, and guest amenity staging.</p>
              </div>
              <div className="bg-pink-50/50 p-4 rounded-xl border border-pink-100">
                <div className="text-xs font-bold text-gray-500 uppercase">Post-Construction</div>
                <div className="text-2xl font-extrabold text-pink-600 mt-1">$350 <span className="text-xs font-normal text-gray-500">starting from</span></div>
                <p className="text-xs text-gray-600 mt-1">Post-remodel dust mitigation, paint speck removal, and fixture detailing.</p>
              </div>
              <div className="bg-pink-50/50 p-4 rounded-xl border border-pink-100">
                <div className="text-xs font-bold text-gray-500 uppercase">Office / Commercial Space</div>
                <div className="text-2xl font-extrabold text-pink-600 mt-1">$200 <span className="text-xs font-normal text-gray-500">starting from</span></div>
                <p className="text-xs text-gray-600 mt-1">Regular workplace sanitizing, trash removal, and restroom maintenance.</p>
              </div>
            </div>
          </section>

          {/* Service Areas Callout */}
          <section className="bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-2xl p-8 sm:p-12 shadow-lg text-center space-y-5">
            <h2 className="text-2xl sm:text-3xl font-bold font-serif">
              Serving Communities Across Florida
            </h2>
            <p className="text-pink-100 text-sm sm:text-base max-w-2xl mx-auto">
              From our home base in Bradenton and Manatee County to Sarasota, Tampa Bay, Miami-Dade, and the Florida Keys, our teams deliver dependable family-owned cleaning care.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Link
                href="/locations/"
                className="bg-white text-pink-600 px-7 py-3 rounded-full font-bold text-sm shadow hover:bg-pink-50 transition-colors"
              >
                Explore All Service Areas &rarr;
              </Link>
              <Link
                href="/book-online/"
                className="bg-pink-700/60 border border-pink-300/40 text-white px-7 py-3 rounded-full font-bold text-sm hover:bg-pink-700/80 transition-colors"
              >
                Schedule Cleaning Online
              </Link>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-pink-100 py-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="flex items-center gap-3">
            <img src="/images/logo.png" alt="Sweet Maid" className="h-12 w-auto object-contain" />
            <div>
              <div className="font-serif font-bold text-gray-900">{BUSINESS_INFO.name}</div>
              <div className="text-xs text-gray-500">Family-Owned Florida Cleaning Team &bull; {BUSINESS_INFO.hours}</div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-xs font-semibold text-gray-600">
            <Link href="/" className="hover:text-pink-500 transition-colors">Home</Link>
            <Link href="/about/" className="hover:text-pink-500 transition-colors">About Us</Link>
            <Link href="/services/" className="hover:text-pink-500 transition-colors">Services</Link>
            <Link href="/locations/" className="hover:text-pink-500 transition-colors">Locations</Link>
            <Link href="/blog/" className="hover:text-pink-500 transition-colors">Blog</Link>
            <Link href="/gallery/" className="hover:text-pink-500 transition-colors">Gallery</Link>
            <Link href="/privacy-policy/" className="hover:text-pink-500 transition-colors">Privacy Policy</Link>
            <Link href="/terms-and-conditions/" className="hover:text-pink-500 transition-colors">Terms &amp; Conditions</Link>
          </div>
          <div className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} {BUSINESS_INFO.name}. All rights reserved. Phone: {BUSINESS_INFO.phone}
          </div>
        </div>
      </footer>
    </div>
  );
}
