import { is305Area } from './miami_broward_slugs';
import { isManateeCounty } from './manatee';

export interface LocalBlogOptions {
  cleanName: string;
  slug: string;
}

/**
 * Generates an in-depth, localized, keyword-rich blog article,
 * internal local SEO service links, and a dedicated local Google Map embed.
 */
export function generateLocalBlogContent(cleanName: string, slug: string): string {
  const is305 = is305Area(slug, cleanName);
  const isManatee = isManateeCounty(slug, cleanName) || slug === 'bradenton-fl';
  const phoneDisplay = is305 ? '(305) 851-6959' : '(941) 222-2080';
  const phoneHref = is305 ? 'tel:13058516959' : 'tel:19412222080';

  // Map URL
  const mapUrl = isManatee && slug === 'bradenton-fl'
    ? 'https://maps.google.com/maps?width=100%25&height=450&hl=en&q=Sweet%20Maid%20Cleaning%20Service%2C%2014651%20Westbrook%20Cir%20Apt%20312%2C%20Bradenton%2C%20FL%2034211&t=&z=14&ie=UTF8&iwloc=B&output=embed'
    : `https://maps.google.com/maps?width=100%25&height=450&hl=en&q=${encodeURIComponent(cleanName + ', Florida')}+()&t=&z=13&ie=UTF8&iwloc=B&output=embed`;

  return `
  <!-- ============================================================
       LOCAL BLOG ARTICLE & DIRECT SERVICE AUTHORITY: ${cleanName}, FL
       ============================================================ -->
  <article class="py-16 bg-white border-b border-pink-100" id="local-guide-${slug}">
    <div class="max-w-4xl mx-auto px-6 lg:px-8">
      
      <!-- Article Header & Meta -->
      <header class="mb-12">
        <div class="inline-flex items-center gap-2 bg-pink-100/90 text-pink-700 text-xs font-bold px-3.5 py-1.5 rounded-full mb-4">
          <i class="fa-solid fa-location-dot text-pink-500"></i>
          <span>${cleanName}, FL Local Living & Cleaning Guide</span>
        </div>
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-gray-900 leading-tight mb-5">
          The Essential Homeowner's Guide to Pristine House Cleaning in ${cleanName}, FL
        </h1>
        <div class="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-500 pb-6 border-b border-gray-100">
          <span class="flex items-center gap-1.5 font-medium text-gray-700">
            <i class="fa-solid fa-user-shield text-pink-500"></i> By Sweet Maid Cleaning Experts
          </span>
          <span>•</span>
          <span class="flex items-center gap-1.5">
            <i class="fa-regular fa-calendar text-pink-400"></i> Updated for 2026
          </span>
          <span>•</span>
          <span class="flex items-center gap-1.5">
            <i class="fa-regular fa-clock text-pink-400"></i> 8 Min Read
          </span>
          <span>•</span>
          <span class="bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-0.5 rounded-full text-xs">
            <i class="fa-solid fa-check"></i> Verified Local Guide
          </span>
        </div>
      </header>

      <!-- Local Service Quick-Jump Hub -->
      <div class="bg-gradient-to-r from-pink-50/70 via-white to-pink-50/50 p-6 sm:p-8 rounded-3xl border border-pink-100 mb-12 shadow-xs">
        <h2 class="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
          <i class="fa-solid fa-bolt text-pink-500"></i> Quick Access to ${cleanName} Cleaning Services:
        </h2>
        <div class="flex flex-wrap gap-2.5">
          <a href="/${slug}/house-cleaning/" class="px-3.5 py-1.5 rounded-full bg-white hover:bg-pink-500 text-gray-700 hover:text-white font-medium text-xs sm:text-sm border border-pink-200 transition-all shadow-2xs">
            🧹 House Cleaning in ${cleanName}
          </a>
          <a href="/${slug}/deep-cleaning/" class="px-3.5 py-1.5 rounded-full bg-white hover:bg-pink-500 text-gray-700 hover:text-white font-medium text-xs sm:text-sm border border-pink-200 transition-all shadow-2xs">
            ✨ Deep Cleaning Services
          </a>
          <a href="/${slug}/move-in-out-cleaning/" class="px-3.5 py-1.5 rounded-full bg-white hover:bg-pink-500 text-gray-700 hover:text-white font-medium text-xs sm:text-sm border border-pink-200 transition-all shadow-2xs">
            📦 Move-In & Move-Out Cleaning
          </a>
          <a href="/${slug}/airbnb-cleaning/" class="px-3.5 py-1.5 rounded-full bg-white hover:bg-pink-500 text-gray-700 hover:text-white font-medium text-xs sm:text-sm border border-pink-200 transition-all shadow-2xs">
            🏖️ Airbnb Turnover Service
          </a>
          <a href="/${slug}/recurring-maid-service/" class="px-3.5 py-1.5 rounded-full bg-white hover:bg-pink-500 text-gray-700 hover:text-white font-medium text-xs sm:text-sm border border-pink-200 transition-all shadow-2xs">
            🔄 Recurring Maid Service
          </a>
          <a href="/${slug}/commercial-cleaning/" class="px-3.5 py-1.5 rounded-full bg-white hover:bg-pink-500 text-gray-700 hover:text-white font-medium text-xs sm:text-sm border border-pink-200 transition-all shadow-2xs">
            🏢 Commercial Cleaning
          </a>
          <a href="/${slug}/carpet-cleaning/" class="px-3.5 py-1.5 rounded-full bg-white hover:bg-pink-500 text-gray-700 hover:text-white font-medium text-xs sm:text-sm border border-pink-200 transition-all shadow-2xs">
            🧼 Carpet & Steam Cleaning
          </a>
          <a href="/${slug}/window-cleaning/" class="px-3.5 py-1.5 rounded-full bg-white hover:bg-pink-500 text-gray-700 hover:text-white font-medium text-xs sm:text-sm border border-pink-200 transition-all shadow-2xs">
            🪟 Window Washing
          </a>
        </div>
      </div>

      <!-- Written Blog Content Body -->
      <div class="space-y-10 text-gray-700 leading-relaxed text-base sm:text-lg">
        
        <!-- Section 1: Subtropical Climate & Air Quality -->
        <section>
          <h2 class="text-2xl sm:text-3xl font-bold font-serif text-gray-900 mb-4">
            1. Conquering ${cleanName}'s Unique Climate, Humidity & Airborne Particulates
          </h2>
          <p class="mb-4">
            Living in <strong>${cleanName}, Florida</strong> offers incredible sunshine and year-round outdoor living, but it also presents distinctive housekeeping challenges that homeowners up north never encounter. With sustained summer relative humidity frequently exceeding 75%, microscopic mildew spores, fine quartz dust, and seasonal pollen can quickly compromise indoor air quality and degrade interior finishes.
          </p>
          <p class="mb-4">
            When windows and sliding patio doors are opened during cooler mornings, airborne particulates settle onto furniture, baseboards, and ceiling fan blades. Without systematic extraction using multi-stage HEPA filtration, standard feather dusters simply redistribute allergens back into the air. Our <a href="/${slug}/house-cleaning/" class="text-pink-600 font-semibold underline hover:text-pink-700">professional house cleaning in ${cleanName}</a> utilizes hospital-grade electrostatic microfiber and sealed commercial vacuums to capture 99.97% of airborne irritants down to 0.3 microns.
          </p>
          <div class="bg-pink-50/70 p-5 rounded-2xl border-l-4 border-pink-400 my-6 text-sm sm:text-base">
            <p class="font-semibold text-gray-900 mb-1">💡 Pro-Tip for ${cleanName} Residents:</p>
            <p class="text-gray-700">
              Inspect your HVAC return grilles and drip pans every 30 days. High Florida humidity encourages condensation buildup where dust collects, producing musty odors. A monthly wipe-down with an EPA-certified botanical sanitizer keeps your air smelling clean.
            </p>
          </div>
        </section>

        <!-- Section 2: Deep Cleaning vs Routine Upkeep -->
        <section>
          <h2 class="text-2xl sm:text-3xl font-bold font-serif text-gray-900 mb-4">
            2. Routine Maid Service vs. Intensive Deep Cleaning: What Does Your ${cleanName} Home Need?
          </h2>
          <p class="mb-4">
            A frequent question among local residents is whether they require a routine maintenance clean or an intensive deep scrub. While both maintain cleanliness, their scope and execution differ significantly:
          </p>
          <ul class="space-y-3 mb-6 list-none pl-0">
            <li class="flex items-start gap-3">
              <span class="w-6 h-6 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center flex-shrink-0 text-xs mt-1"><i class="fa-solid fa-check"></i></span>
              <div>
                <strong class="text-gray-900">Routine Maid Visits:</strong> Ideal on a weekly or bi-weekly schedule to maintain high-traffic areas, sanitize kitchen countertops, polish bathroom fixtures, vacuum rugs, mop hard-surface flooring, and empty wastebaskets. Learn more about our <a href="/${slug}/recurring-maid-service/" class="text-pink-600 font-semibold underline hover:text-pink-700">recurring maid service in ${cleanName}</a>.
              </div>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-6 h-6 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center flex-shrink-0 text-xs mt-1"><i class="fa-solid fa-check"></i></span>
              <div>
                <strong class="text-gray-900">Intensive Deep Cleaning:</strong> Recommended at least twice annually or before the holiday and snowbird season. It covers hand-scrubbing baseboards, detailing door frames, removing calcified hard water deposits from glass shower surrounds, wiping cabinet exteriors, and sanitizing behind large appliances. Schedule our comprehensive <a href="/${slug}/deep-cleaning/" class="text-pink-600 font-semibold underline hover:text-pink-700">deep cleaning services in ${cleanName}, FL</a> for total peace of mind.
              </div>
            </li>
          </ul>
        </section>

        <!-- Section 3: Room-by-Room Blueprint -->
        <section>
          <h2 class="text-2xl sm:text-3xl font-bold font-serif text-gray-900 mb-4">
            3. Room-by-Room Cleaning Blueprint Tailored for ${cleanName} Properties
          </h2>
          <p class="mb-4">
            To achieve a hotel-grade shine, follow our field-tested step-by-step room sequencing:
          </p>
          <div class="grid sm:grid-cols-2 gap-4 my-6">
            <div class="bg-gray-50 p-5 rounded-2xl border border-gray-200/80">
              <h3 class="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <i class="fa-solid fa-utensils text-pink-500"></i> The Chef's Kitchen
              </h3>
              <p class="text-sm text-gray-600 leading-relaxed">
                Degrease stove hoods, hand-wipe microwave interiors, polish stainless steel along the grain, and scrub sink drains with baking soda and citrus extract to eliminate organic odor.
              </p>
            </div>
            <div class="bg-gray-50 p-5 rounded-2xl border border-gray-200/80">
              <h3 class="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <i class="fa-solid fa-shower text-pink-500"></i> Spa-Level Bathrooms
              </h3>
              <p class="text-sm text-gray-600 leading-relaxed">
                Dissolve hard Florida water scale with eco-friendly acidic solutions, detail grout lines, sanitize toilet bases, and squeegee glass enclosures streak-free.
              </p>
            </div>
            <div class="bg-gray-50 p-5 rounded-2xl border border-gray-200/80">
              <h3 class="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <i class="fa-solid fa-bed text-pink-500"></i> Restful Bedrooms
              </h3>
              <p class="text-sm text-gray-600 leading-relaxed">
                Vacuum beneath beds with low-profile wands, damp-dust wooden plantation shutters, rotate mattresses, and treat high-traffic carpets with our <a href="/${slug}/carpet-cleaning/" class="text-pink-600 underline font-medium">carpet steam cleaning</a>.
              </p>
            </div>
            <div class="bg-gray-50 p-5 rounded-2xl border border-gray-200/80">
              <h3 class="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <i class="fa-solid fa-sun text-pink-500"></i> Lanai & Patio Sliders
              </h3>
              <p class="text-sm text-gray-600 leading-relaxed">
                Vacuum sliding track grooves to eliminate grit that jams rollers, clean sliding glass panels with <a href="/${slug}/window-cleaning/" class="text-pink-600 underline font-medium">window washing solutions</a>, and sweep screen enclosure ledges.
              </p>
            </div>
          </div>
        </section>

        <!-- Section 4: Vacation Rental Turnovers & Relocation -->
        <section>
          <h2 class="text-2xl sm:text-3xl font-bold font-serif text-gray-900 mb-4">
            4. Vacation Rental Turnovers & Moving Solutions in ${cleanName}
          </h2>
          <p class="mb-4">
            ${cleanName} is a top destination for vacationers and new Florida residents alike. If you operate an Airbnb, VRBO, or executive rental, 5-star reviews depend on consistent, spotless turnovers between guests. Our dedicated <a href="/${slug}/airbnb-cleaning/" class="text-pink-600 font-semibold underline hover:text-pink-700">Airbnb cleaning in ${cleanName}</a> offers scheduled linen sanitization, guest amenities replenishment, and damage inspection reporting.
          </p>
          <p class="mb-4">
            Moving to a new neighborhood or preparing your lease for handover? Our guaranteed <a href="/${slug}/move-in-out-cleaning/" class="text-pink-600 font-semibold underline hover:text-pink-700">move-in and move-out cleaning in ${cleanName}</a> ensures inside cabinets, closets, ovens, and refrigerators are meticulously detailed so you secure your complete security deposit or welcome your family into an immaculate space.
          </p>
        </section>

        <!-- Section 5: Seasonal Checklist -->
        <section>
          <h2 class="text-2xl sm:text-3xl font-bold font-serif text-gray-900 mb-4">
            5. The ${cleanName}, FL Seasonal Cleaning Calendar
          </h2>
          <div class="space-y-4">
            <div class="border border-pink-100 rounded-2xl p-4 bg-white shadow-2xs">
              <span class="font-bold text-pink-600 text-sm">🌸 Spring (March – May): Pollen & Pre-Summer Defense</span>
              <p class="text-sm text-gray-600 mt-1">Replace HVAC air filters with MERV-11 rated filters, wash exterior window screens, and deep clean lanai furnishings before summer heat peaks.</p>
            </div>
            <div class="border border-pink-100 rounded-2xl p-4 bg-white shadow-2xs">
              <span class="font-bold text-pink-600 text-sm">☀️ Summer (June – August): High Humidity & Dehumidification</span>
              <p class="text-sm text-gray-600 mt-1">Pour white distilled vinegar into your AC condensate drain line every 30 days to prevent algae blockages, and run exhaust fans 20 minutes after showers to halt mildew.</p>
            </div>
            <div class="border border-pink-100 rounded-2xl p-4 bg-white shadow-2xs">
              <span class="font-bold text-pink-600 text-sm">🍂 Fall & Winter (September – February): Seasonal Opening & Holiday Prep</span>
              <p class="text-sm text-gray-600 mt-1">Perform a complete seasonal refresh after properties have remained closed during humid months. Air out guest suites and schedule your pre-holiday <a href="/${slug}/deep-cleaning/" class="text-pink-600 underline font-medium">deep clean</a>.</p>
            </div>
          </div>
        </section>

      </div>

      <!-- Local Map & Contact Area Section -->
      <section class="mt-16 pt-12 border-t border-pink-100" id="local-map-section">
        <div class="text-center mb-8">
          <div class="inline-flex items-center gap-2 bg-pink-100 text-pink-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
            <i class="fa-solid fa-map-location-dot"></i>
            <span>Interactive Local Service Map</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold font-serif text-gray-900">
            Sweet Maid Service Area in ${cleanName}, FL
          </h2>
          <p class="text-gray-600 text-sm sm:text-base mt-2 max-w-2xl mx-auto">
            Our background-checked, insured cleaning specialists proudly serve residential and commercial properties throughout ${cleanName} and nearby communities.
          </p>
        </div>

        <!-- Embedded Google Map Frame -->
        <div class="relative w-full h-80 sm:h-96 md:h-[420px] rounded-3xl overflow-hidden shadow-lg border border-pink-100">
          <iframe
            src="${mapUrl}"
            width="100%"
            height="100%"
            style="border:0;"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            title="Sweet Maid Cleaning Service Area Map in ${cleanName}, FL">
          </iframe>
          <!-- Floating Map Details Badge -->
          <div class="absolute bottom-4 left-4 right-4 sm:right-auto bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-md border border-pink-100 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <div class="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-lg flex-shrink-0">
              <i class="fa-solid fa-location-dot"></i>
            </div>
            <div class="text-center sm:text-left">
              <p class="font-bold text-gray-900 text-sm">Serving ${cleanName}, FL & Nearby Neighborhoods</p>
              <p class="text-xs text-gray-500">Call for Same-Day or Scheduled Maid Availability</p>
            </div>
            <a href="${phoneHref}" class="inline-flex items-center gap-1.5 bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white font-bold px-4 py-2 rounded-full text-xs shadow-sm transition hover:scale-105">
              <i class="fa-solid fa-phone text-xs"></i>
              <span>${phoneDisplay}</span>
            </a>
          </div>
        </div>

        <!-- Call to Action Banner -->
        <div class="mt-8 bg-gradient-to-r from-pink-500 to-pink-600 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h3 class="text-xl sm:text-2xl font-bold font-serif mb-1">
              Ready for a Spotless Home in ${cleanName}, FL?
            </h3>
            <p class="text-pink-100 text-sm">
              Get an instant, transparent quote online in under 60 seconds with 100% satisfaction guaranteed.
            </p>
          </div>
          <div class="flex items-center gap-3 flex-shrink-0 w-full sm:w-auto">
            <a href="#quote" class="w-full sm:w-auto text-center bg-white hover:bg-pink-50 text-pink-600 font-bold px-6 py-3 rounded-full text-sm shadow-md transition hover:scale-105">
              Get Your Free ${cleanName} Quote
            </a>
          </div>
        </div>
      </section>

    </div>
  </article>
  <!-- ============================================================
       END LOCAL BLOG ARTICLE: ${cleanName}, FL
       ============================================================ -->
  `;
}
