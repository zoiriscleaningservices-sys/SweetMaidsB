import { is305Area } from './miami_broward_slugs';
import { isManateeCounty } from './manatee';
import { generateLocalMapUrl, getGoogleMapsUrl } from './map_engine';

export interface LocalBlogOptions {
  cleanName: string;
  slug: string;
}

/**
 * Generates an in-depth, localized, keyword-rich blog article,
 * internal local SEO service links, visual photography, and a dedicated local Google Map embed.
 */
export function generateLocalBlogContent(cleanName: string, slug: string): string {
  const is305 = is305Area(slug, cleanName);
  const isManatee = isManateeCounty(slug, cleanName) || slug === 'bradenton-fl';
  const phoneDisplay = is305 ? '(305) 851-6959' : '(941) 222-2080';
  const phoneHref = is305 ? 'tel:13058516959' : 'tel:19412222080';

  // Map URL
  const mapUrl = generateLocalMapUrl(slug, cleanName, isManatee);
  const gmapsLink = getGoogleMapsUrl(slug, cleanName, isManatee);

  return `
  <!-- ============================================================
       LOCAL BLOG ARTICLE & DIRECT SERVICE AUTHORITY: ${cleanName}, FL
       ============================================================ -->
  <article class="pt-32 pb-16 sm:pt-40 sm:pb-20 bg-white border-b border-pink-100" id="local-guide-${slug}" style="padding-top: clamp(120px, 14vh, 160px);">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Article Header & Breadcrumb Meta -->
      <header class="mb-10 text-left">
        <div class="inline-flex items-center gap-2 bg-pink-100 text-pink-800 text-xs font-bold px-3.5 py-1.5 rounded-full mb-4 shadow-2xs">
          <i class="fa-solid fa-location-dot text-pink-500"></i>
          <span>${cleanName}, FL Local Living & Cleaning Guide</span>
        </div>
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-gray-900 leading-tight mb-5 tracking-tight">
          The Essential Homeowner's Guide to Pristine House Cleaning in ${cleanName}, FL
        </h1>
        
        <div class="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 pb-6 border-b border-gray-100">
          <span class="flex items-center gap-1.5 font-medium text-gray-800">
            <i class="fa-solid fa-shield-halved text-pink-500"></i> By Sweet Maid Cleaning Experts
          </span>
          <span class="text-gray-300">•</span>
          <span class="text-yellow-500 font-bold flex items-center gap-1">
            <i class="fa-solid fa-star"></i> 5.0 5-Star Rated
          </span>
          <span class="text-gray-300">•</span>
          <span class="flex items-center gap-1.5">
            <i class="fa-regular fa-calendar-check text-pink-400"></i> Updated for 2026
          </span>
          <span class="text-gray-300">•</span>
          <span class="flex items-center gap-1.5">
            <i class="fa-regular fa-clock text-pink-400"></i> 8 Min Read
          </span>
          <span class="text-gray-300">•</span>
          <span class="bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-0.5 rounded-full text-xs flex items-center gap-1">
            <i class="fa-solid fa-circle-check text-emerald-500"></i> Verified Local Guide
          </span>
        </div>
      </header>

      <!-- Featured Hero Photography -->
      <div class="relative w-full h-64 sm:h-80 md:h-[400px] rounded-3xl overflow-hidden shadow-xl mb-12 border border-pink-100/80 group">
        <img
          src="/images/whatsapp-image-2026-02-10-at-11.18.08-pm-1.webp"
          alt="Spotless luxury interior house cleaning in ${cleanName}, FL"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          decoding="async"
          width="1200"
          height="800"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-900/30 to-transparent"></div>
        <div class="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 right-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-white">
          <div class="flex flex-wrap items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
            <span class="bg-pink-500 text-white font-bold px-2.5 py-0.5 rounded-full text-xs shadow-md">Featured Local Guide</span>
            <span class="text-xs sm:text-sm font-semibold text-white drop-shadow">Pristine Living Across ${cleanName}, FL</span>
          </div>
          <a href="#quote" class="inline-flex items-center gap-1.5 bg-pink-500 hover:bg-pink-600 text-white font-bold px-5 py-2.5 rounded-full text-xs shadow-lg transition hover:scale-105 border border-pink-300/40">
            <i class="fa-solid fa-sparkles"></i> Book in ${cleanName}
          </a>
        </div>
      </div>

      <!-- Trust Metrics Bar -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-12">
        <div class="bg-pink-50/60 p-4 rounded-2xl border border-pink-100/80 text-center">
          <div class="text-xl sm:text-2xl font-bold text-pink-600">5.0 ★★★★★</div>
          <div class="text-xs text-gray-700 font-semibold mt-0.5">Top 5-Star Rated Cleaners</div>
        </div>
        <div class="bg-pink-50/60 p-4 rounded-2xl border border-pink-100/80 text-center">
          <div class="text-xl sm:text-2xl font-bold text-gray-900">100%</div>
          <div class="text-xs text-gray-600 mt-0.5">Sparkle Guarantee</div>
        </div>
        <div class="bg-pink-50/60 p-4 rounded-2xl border border-pink-100/80 text-center">
          <div class="text-xl sm:text-2xl font-bold text-gray-900">HEPA 99.9%</div>
          <div class="text-xs text-gray-600 mt-0.5">Micro-Allergen Defense</div>
        </div>
        <div class="bg-pink-50/60 p-4 rounded-2xl border border-pink-100/80 text-center">
          <div class="text-xl sm:text-2xl font-bold text-gray-900">Bonded</div>
          <div class="text-xs text-gray-600 mt-0.5">& Fully Insured Team</div>
        </div>
      </div>

      <!-- Local Service Quick-Jump Hub -->
      <div class="bg-gradient-to-r from-pink-50/80 via-white to-pink-50/50 p-6 sm:p-8 rounded-3xl border border-pink-200/70 mb-14 shadow-xs">
        <h2 class="text-xs sm:text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
          <i class="fa-solid fa-bolt text-pink-500"></i> Explore Dedicated Services for ${cleanName} Homes:
        </h2>
        <div class="flex flex-wrap gap-2 sm:gap-2.5">
          <a href="/${slug}/house-cleaning/" class="px-3.5 py-2 rounded-xl bg-white hover:bg-pink-500 text-gray-700 hover:text-white font-semibold text-xs sm:text-sm border border-pink-200 transition-all shadow-2xs hover:scale-105">
            🧹 House Cleaning
          </a>
          <a href="/${slug}/deep-cleaning/" class="px-3.5 py-2 rounded-xl bg-white hover:bg-pink-500 text-gray-700 hover:text-white font-semibold text-xs sm:text-sm border border-pink-200 transition-all shadow-2xs hover:scale-105">
            ✨ Deep Cleaning
          </a>
          <a href="/${slug}/move-in-out-cleaning/" class="px-3.5 py-2 rounded-xl bg-white hover:bg-pink-500 text-gray-700 hover:text-white font-semibold text-xs sm:text-sm border border-pink-200 transition-all shadow-2xs hover:scale-105">
            📦 Move-In & Move-Out
          </a>
          <a href="/${slug}/airbnb-cleaning/" class="px-3.5 py-2 rounded-xl bg-white hover:bg-pink-500 text-gray-700 hover:text-white font-semibold text-xs sm:text-sm border border-pink-200 transition-all shadow-2xs hover:scale-105">
            🏖️ Airbnb Turnover
          </a>
          <a href="/${slug}/recurring-maid-service/" class="px-3.5 py-2 rounded-xl bg-white hover:bg-pink-500 text-gray-700 hover:text-white font-semibold text-xs sm:text-sm border border-pink-200 transition-all shadow-2xs hover:scale-105">
            🔄 Recurring Maid Service
          </a>
          <a href="/${slug}/commercial-cleaning/" class="px-3.5 py-2 rounded-xl bg-white hover:bg-pink-500 text-gray-700 hover:text-white font-semibold text-xs sm:text-sm border border-pink-200 transition-all shadow-2xs hover:scale-105">
            🏢 Commercial Cleaning
          </a>
          <a href="/${slug}/carpet-cleaning/" class="px-3.5 py-2 rounded-xl bg-white hover:bg-pink-500 text-gray-700 hover:text-white font-semibold text-xs sm:text-sm border border-pink-200 transition-all shadow-2xs hover:scale-105">
            🧼 Carpet & Steam Cleaning
          </a>
          <a href="/${slug}/window-cleaning/" class="px-3.5 py-2 rounded-xl bg-white hover:bg-pink-500 text-gray-700 hover:text-white font-semibold text-xs sm:text-sm border border-pink-200 transition-all shadow-2xs hover:scale-105">
            🪟 Window Washing
          </a>
        </div>
      </div>

      <!-- Written Blog Content Body -->
      <div class="space-y-12 text-gray-700 leading-relaxed text-base sm:text-lg">
        
        <!-- Section 1: Subtropical Climate & Air Quality -->
        <section>
          <h2 class="text-2xl sm:text-3xl font-bold font-serif text-gray-900 mb-4 tracking-tight">
            1. Conquering ${cleanName}'s Unique Climate, Humidity & Airborne Particulates
          </h2>
          <p class="mb-4">
            Living in <strong>${cleanName}, Florida</strong> offers incredible sunshine and year-round outdoor living, but it also presents distinctive housekeeping challenges that homeowners up north never encounter. With sustained summer relative humidity frequently exceeding 75%, microscopic mildew spores, fine quartz dust, and seasonal pollen can quickly compromise indoor air quality and degrade interior finishes.
          </p>
          <p class="mb-4">
            When windows and sliding patio doors are opened during cooler mornings, airborne particulates settle onto furniture, baseboards, and ceiling fan blades. Without systematic extraction using multi-stage HEPA filtration, standard feather dusters simply redistribute allergens back into the air. Our <a href="/${slug}/house-cleaning/" class="text-pink-600 font-bold underline hover:text-pink-700">professional house cleaning in ${cleanName}</a> utilizes hospital-grade electrostatic microfiber and sealed commercial vacuums to capture 99.97% of airborne irritants down to 0.3 microns.
          </p>
          <div class="bg-pink-50/70 p-6 rounded-2xl border-l-4 border-pink-400 my-6 text-sm sm:text-base shadow-2xs">
            <p class="font-bold text-gray-900 mb-1.5 flex items-center gap-2">
              <i class="fa-solid fa-lightbulb text-pink-500"></i> Pro-Tip for ${cleanName} Residents:
            </p>
            <p class="text-gray-700">
              Inspect your HVAC return grilles and drip pans every 30 days. High Florida humidity encourages condensation buildup where dust collects, producing musty odors. A monthly wipe-down with an EPA-certified botanical sanitizer keeps your air smelling fresh and prevents spore proliferation.
            </p>
          </div>
        </section>

        <!-- Section 2: Deep Cleaning vs Routine Upkeep -->
        <section>
          <h2 class="text-2xl sm:text-3xl font-bold font-serif text-gray-900 mb-4 tracking-tight">
            2. Routine Maid Service vs. Intensive Deep Cleaning: What Does Your ${cleanName} Home Need?
          </h2>
          <p class="mb-4">
            A frequent question among local residents is whether they require a routine maintenance clean or an intensive deep scrub. While both maintain cleanliness, their scope and execution differ significantly:
          </p>
          <div class="grid sm:grid-cols-2 gap-6 my-6">
            <div class="bg-gray-50 p-6 rounded-2xl border border-gray-200 flex flex-col justify-between">
              <div>
                <div class="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center font-bold mb-4">
                  <i class="fa-solid fa-calendar-days"></i>
                </div>
                <h3 class="text-lg font-bold text-gray-900 mb-2">Recurring Maid Visits</h3>
                <p class="text-sm text-gray-600 leading-relaxed mb-4">
                  Ideal on a weekly or bi-weekly cadence. Focuses on high-traffic areas, kitchen countertops, bathroom sanitization, hard surface mopping, and vacuuming to keep your home continuously guest-ready.
                </p>
              </div>
              <a href="/${slug}/recurring-maid-service/" class="text-pink-600 font-bold text-sm hover:underline flex items-center gap-1.5">
                Explore Recurring Cleaning <i class="fa-solid fa-arrow-right text-xs"></i>
              </a>
            </div>

            <div class="bg-gray-50 p-6 rounded-2xl border border-gray-200 flex flex-col justify-between">
              <div>
                <div class="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center font-bold mb-4">
                  <i class="fa-solid fa-sparkles"></i>
                </div>
                <h3 class="text-lg font-bold text-gray-900 mb-2">Intensive Deep Cleaning</h3>
                <p class="text-sm text-gray-600 leading-relaxed mb-4">
                  Recommended twice annually or before seasonal arrivals. Covers hand-scrubbing baseboards, door frames, deep tile grout restoration, behind heavy appliances, and interior cabinet detailing.
                </p>
              </div>
              <a href="/${slug}/deep-cleaning/" class="text-pink-600 font-bold text-sm hover:underline flex items-center gap-1.5">
                Schedule Deep Cleaning <i class="fa-solid fa-arrow-right text-xs"></i>
              </a>
            </div>
          </div>
        </section>

        <!-- Section 3: Room-by-Room Blueprint with Visual Thumbnails & Local Service Links -->
        <section>
          <h2 class="text-2xl sm:text-3xl font-bold font-serif text-gray-900 mb-4 tracking-tight">
            3. Room-by-Room Cleaning Blueprint Tailored for ${cleanName} Properties
          </h2>
          <p class="mb-6">
            To achieve a hotel-grade shine, follow our field-tested room sequencing with specialized treatments for Florida finishes:
          </p>
          <div class="grid sm:grid-cols-2 gap-6 my-6">
            
            <div class="bg-white p-6 rounded-3xl border border-pink-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <a href="/${slug}/deep-cleaning/" class="block h-44 rounded-2xl overflow-hidden mb-4 relative group/img border border-pink-100/60 shadow-inner">
                  <img src="/images/whatsapp-image-2026-02-10-at-11.18.08-pm.webp" alt="Kitchen cleaning in ${cleanName}, FL" class="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500" decoding="async" width="600" height="400" />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <span class="absolute bottom-2.5 left-3 bg-black/75 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5">
                    <i class="fa-solid fa-utensils text-pink-400"></i> Kitchen Detail
                  </span>
                </a>
                <div class="mb-2">
                  <a href="/${slug}/deep-cleaning/" class="text-xs font-bold text-pink-600 hover:text-pink-700 flex items-center gap-1.5 transition-colors">
                    <span>Deep Cleaning in ${cleanName}, FL</span> <i class="fa-solid fa-arrow-right text-[10px]"></i>
                  </a>
                </div>
                <h3 class="font-bold text-gray-900 text-lg mb-2 flex items-center gap-2">
                  The Chef's Kitchen
                </h3>
                <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Degrease range hoods, hand-wipe appliance exteriors along the stainless grain, scrub sinks, and sanitize quartz countertops with neutral pH formulas.
                </p>
              </div>
            </div>

            <div class="bg-white p-6 rounded-3xl border border-pink-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <a href="/${slug}/house-cleaning/" class="block h-44 rounded-2xl overflow-hidden mb-4 relative group/img border border-pink-100/60 shadow-inner">
                  <img src="/images/whatsapp-image-2026-02-10-at-11.18.07-pm-1.webp" alt="Bathroom sanitation in ${cleanName}, FL" class="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500" decoding="async" width="600" height="400" />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <span class="absolute bottom-2.5 left-3 bg-black/75 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5">
                    <i class="fa-solid fa-shower text-pink-400"></i> Bathroom Sanitization
                  </span>
                </a>
                <div class="mb-2">
                  <a href="/${slug}/house-cleaning/" class="text-xs font-bold text-pink-600 hover:text-pink-700 flex items-center gap-1.5 transition-colors">
                    <span>House Cleaning in ${cleanName}, FL</span> <i class="fa-solid fa-arrow-right text-[10px]"></i>
                  </a>
                </div>
                <h3 class="font-bold text-gray-900 text-lg mb-2 flex items-center gap-2">
                  Spa-Level Bathrooms
                </h3>
                <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Dissolve Florida hard water mineral scale from frameless glass shower doors, hand-scrub grout lines, and sanitize fixtures for spotless reflection.
                </p>
              </div>
            </div>

            <div class="bg-white p-6 rounded-3xl border border-pink-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <a href="/${slug}/carpet-cleaning/" class="block h-44 rounded-2xl overflow-hidden mb-4 relative group/img border border-pink-100/60 shadow-inner">
                  <img src="/images/whatsapp-image-2026-02-10-at-11.18.08-pm-1.webp" alt="Bedroom cleaning in ${cleanName}, FL" class="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500" decoding="async" width="600" height="400" />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <span class="absolute bottom-2.5 left-3 bg-black/75 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5">
                    <i class="fa-solid fa-bed text-pink-400"></i> Bedroom Haven
                  </span>
                </a>
                <div class="mb-2">
                  <a href="/${slug}/carpet-cleaning/" class="text-xs font-bold text-pink-600 hover:text-pink-700 flex items-center gap-1.5 transition-colors">
                    <span>Carpet & Floor Care in ${cleanName}, FL</span> <i class="fa-solid fa-arrow-right text-[10px]"></i>
                  </a>
                </div>
                <h3 class="font-bold text-gray-900 text-lg mb-2 flex items-center gap-2">
                  Restful Bedrooms
                </h3>
                <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Vacuum under bed frames with low-profile nozzles, damp-dust plantation shutters, freshen linens, and treat rugs with <a href="/${slug}/carpet-cleaning/" class="text-pink-600 underline font-medium">carpet steam cleaning</a>.
                </p>
              </div>
            </div>

            <div class="bg-white p-6 rounded-3xl border border-pink-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <a href="/${slug}/window-cleaning/" class="block h-44 rounded-2xl overflow-hidden mb-4 relative group/img border border-pink-100/60 shadow-inner">
                  <img src="/images/whatsapp-image-2026-02-10-at-11.17.58-pm.webp" alt="Patio and window cleaning in ${cleanName}, FL" class="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500" decoding="async" width="600" height="400" />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <span class="absolute bottom-2.5 left-3 bg-black/75 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5">
                    <i class="fa-solid fa-sun text-pink-400"></i> Lanai & Glass
                  </span>
                </a>
                <div class="mb-2">
                  <a href="/${slug}/window-cleaning/" class="text-xs font-bold text-pink-600 hover:text-pink-700 flex items-center gap-1.5 transition-colors">
                    <span>Window Washing in ${cleanName}, FL</span> <i class="fa-solid fa-arrow-right text-[10px]"></i>
                  </a>
                </div>
                <h3 class="font-bold text-gray-900 text-lg mb-2 flex items-center gap-2">
                  Lanai & Sliding Doors
                </h3>
                <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Vacuum sliding door track channels to prevent grit from grinding rollers, remove salt film with <a href="/${slug}/window-cleaning/" class="text-pink-600 underline font-medium">window washing</a>, and sweep covered patio tile.
                </p>
              </div>
            </div>

          </div>
        </section>

        <!-- Section 4: Vacation Rental Turnovers & Relocation -->
        <section>
          <h2 class="text-2xl sm:text-3xl font-bold font-serif text-gray-900 mb-4 tracking-tight">
            4. Vacation Rental Turnovers & Relocation Services in ${cleanName}
          </h2>
          <p class="mb-4">
            ${cleanName} is a premiere destination for vacationers and new Florida residents alike. If you operate an Airbnb, VRBO, or executive rental, 5-star reviews depend on consistent, spotless turnovers between guests. Our dedicated <a href="/${slug}/airbnb-cleaning/" class="text-pink-600 font-bold underline hover:text-pink-700">Airbnb cleaning service in ${cleanName}</a> offers scheduled linen sanitization, guest amenities replenishment, and damage inspection reporting.
          </p>
          <p class="mb-4">
            Moving to a new home or preparing your lease for handover? Our guaranteed <a href="/${slug}/move-in-out-cleaning/" class="text-pink-600 font-bold underline hover:text-pink-700">move-in and move-out cleaning in ${cleanName}</a> ensures inside cabinets, closets, ovens, and refrigerators are meticulously detailed so you secure your complete security deposit or welcome your family into an immaculate space.
          </p>
        </section>

        <!-- Section 5: Seasonal Checklist -->
        <section>
          <h2 class="text-2xl sm:text-3xl font-bold font-serif text-gray-900 mb-4 tracking-tight">
            5. The ${cleanName}, FL Seasonal Cleaning Calendar
          </h2>
          <div class="space-y-4">
            <div class="border border-pink-100 rounded-2xl p-5 bg-white shadow-2xs">
              <span class="font-bold text-pink-600 text-sm flex items-center gap-2">
                <i class="fa-solid fa-seedling"></i> Spring (March – May): Pollen & Pre-Summer Defense
              </span>
              <p class="text-sm text-gray-600 mt-2">Replace HVAC air filters with MERV-11 rated filters, wash exterior window screens, and deep clean lanai furnishings before summer heat peaks.</p>
            </div>
            <div class="border border-pink-100 rounded-2xl p-5 bg-white shadow-2xs">
              <span class="font-bold text-pink-600 text-sm flex items-center gap-2">
                <i class="fa-solid fa-cloud-sun-rain"></i> Summer (June – August): High Humidity & Dehumidification
              </span>
              <p class="text-sm text-gray-600 mt-2">Pour white distilled vinegar into your AC condensate drain line every 30 days to prevent algae blockages, and run exhaust fans 20 minutes after showers to halt mildew.</p>
            </div>
            <div class="border border-pink-100 rounded-2xl p-5 bg-white shadow-2xs">
              <span class="font-bold text-pink-600 text-sm flex items-center gap-2">
                <i class="fa-solid fa-snowflake"></i> Fall & Winter (September – February): Seasonal Opening & Holiday Prep
              </span>
              <p class="text-sm text-gray-600 mt-2">Perform a complete seasonal refresh after properties have remained closed during humid months. Air out guest suites and schedule your pre-holiday <a href="/${slug}/deep-cleaning/" class="text-pink-600 underline font-semibold">deep clean</a>.</p>
            </div>
          </div>
        </section>

      </div>

      <!-- Local Map & Contact Area Section -->
      <section class="mt-16 pt-12 border-t border-pink-100" id="local-map-section">
        <div class="text-center mb-8">
          <div class="inline-flex items-center gap-2 bg-pink-100 text-pink-700 text-xs font-bold px-3.5 py-1.5 rounded-full mb-3 shadow-2xs">
            <i class="fa-solid fa-map-location-dot"></i>
            <span>Interactive Local Service Map</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold font-serif text-gray-900 tracking-tight">
            Sweet Maid Service Area in ${cleanName}, FL
          </h2>
          <p class="text-gray-600 text-sm sm:text-base mt-2 max-w-2xl mx-auto">
            Our background-checked, insured cleaning specialists proudly serve residential and commercial properties throughout ${cleanName} and nearby communities.
          </p>
        </div>

        <!-- Embedded Local Service Area Map Frame with Clean Mobile-Friendly Badge -->
        <div class="relative w-full h-80 sm:h-96 md:h-[450px] rounded-3xl overflow-hidden shadow-lg border border-pink-100">
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
          <div class="absolute bottom-3 left-3 right-3 sm:right-auto sm:bottom-4 sm:left-4 bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl shadow-lg border border-pink-100 flex flex-col sm:flex-row items-center gap-3 z-10">
            <div class="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-lg flex-shrink-0">
              <i class="fa-solid fa-location-dot"></i>
            </div>
            <div class="text-center sm:text-left">
              <p class="font-bold text-gray-900 text-xs sm:text-sm">Serving ${cleanName}, FL &amp; Surrounding Neighborhoods</p>
              <p class="text-[11px] sm:text-xs text-gray-500">${isManatee ? '14651 Westbrook Cir Apt 312, Bradenton, FL' : 'Licensed & Insured Local Maid Crews'}</p>
            </div>
            <div class="flex items-center gap-2">
              <a href="${gmapsLink}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-3.5 py-2 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-full text-xs shadow-sm transition hover:scale-105">
                <span>Google Maps</span>
                <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
              </a>
              <a href="${phoneHref}" class="inline-flex items-center gap-1.5 bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white font-bold px-3.5 py-2 rounded-full text-xs shadow-sm transition hover:scale-105">
                <i class="fa-solid fa-phone text-xs"></i>
                <span>${phoneDisplay}</span>
              </a>
            </div>
          </div>
        </div>

        <!-- Call to Action Banner -->
        <div class="mt-8 bg-gradient-to-r from-pink-500 via-pink-600 to-pink-500 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h3 class="text-xl sm:text-2xl font-bold font-serif mb-1.5 tracking-tight">
              Ready for a Spotless Home in ${cleanName}, FL?
            </h3>
            <p class="text-pink-100 text-xs sm:text-sm max-w-xl">
              Get an instant, transparent quote online in under 60 seconds with our 100% Sparkle Satisfaction Guarantee.
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
