import { is305Area } from './miami_broward_slugs';
import { isManateeCounty } from './manatee';
import { getNearestLocations, NearestCity } from './data';

export interface LocalAboutOptions {
  cleanName: string;
  slug: string;
}

/**
 * Generates an in-depth, keyword-rich, localized About section for each Florida community.
 * Highlights:
 * - Over 5,000 houses, offices, post-construction jobs, and move-out cleans completed
 * - Built on family-owned values focused on delivering the best cleaning to local communities
 * - Pride in craftsmanship and dedication to building long-term customer relationships
 * - Deep internal linking into local service pages and neighboring Florida cities
 */
export function generateLocalAboutContent(cleanName: string, slug: string): string {
  const is305 = is305Area(slug, cleanName);
  const isManatee = isManateeCounty(slug, cleanName) || slug === 'bradenton-fl';
  const phoneDisplay = is305 ? '(305) 851-6959' : '(941) 222-2080';
  const phoneHref = is305 ? 'tel:13058516959' : 'tel:19412222080';

  // Nearby cities for local contextual SEO interlinking
  let nearbyCities: { name: string; slug: string }[] = [];
  try {
    const nearby: NearestCity[] = getNearestLocations(slug, 6);
    if (nearby && nearby.length > 0) {
      nearbyCities = nearby.map((c: NearestCity) => ({ name: c.name, slug: c.slug }));
    }
  } catch (e) {
    // fallback gracefully
  }

  const nearbyLinksHtml = nearbyCities.length > 0
    ? nearbyCities.map(c => `
        <a href="/${c.slug}/about/" class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-pink-100 text-gray-700 hover:text-pink-600 hover:border-pink-300 text-xs font-semibold shadow-xs transition-all">
          <i class="fa-solid fa-location-dot text-pink-400"></i> ${c.name}, FL
        </a>
      `).join('')
    : `
        <a href="/sarasota-fl/about/" class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-pink-100 text-gray-700 hover:text-pink-600 hover:border-pink-300 text-xs font-semibold shadow-xs transition-all">
          <i class="fa-solid fa-location-dot text-pink-400"></i> Sarasota, FL
        </a>
        <a href="/lakewood-ranch-fl/about/" class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-pink-100 text-gray-700 hover:text-pink-600 hover:border-pink-300 text-xs font-semibold shadow-xs transition-all">
          <i class="fa-solid fa-location-dot text-pink-400"></i> Lakewood Ranch, FL
        </a>
        <a href="/tampa-fl/about/" class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-pink-100 text-gray-700 hover:text-pink-600 hover:border-pink-300 text-xs font-semibold shadow-xs transition-all">
          <i class="fa-solid fa-location-dot text-pink-400"></i> Tampa, FL
        </a>
      `;

  return `
  <!-- ============================================================
       LOCAL ABOUT AUTHORITY & FAMILY-OWNED HERITAGE: ${cleanName}, FL
       ============================================================ -->
  <article class="bg-white" id="about-authority-${slug}">
    
    <!-- Hero Banner with Local Authority Badge -->
    <header class="relative pt-32 pb-16 sm:pt-40 sm:pb-24 overflow-hidden bg-gradient-to-b from-pink-50/70 via-white to-white border-b border-pink-100">
      <div class="absolute inset-0 z-0 opacity-15 pointer-events-none">
        <div class="absolute inset-0 bg-[radial-gradient(#ec4899_1px,transparent_1px)] [background-size:20px_20px]"></div>
      </div>
      
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div class="inline-flex items-center gap-2 bg-pink-100 text-pink-800 text-xs sm:text-sm font-bold px-4 py-2 rounded-full mb-6 shadow-2xs">
          <i class="fa-solid fa-heart text-pink-500"></i>
          <span>Family-Owned & Community-Focused Cleaning in ${cleanName}, FL</span>
        </div>
        
        <h1 class="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-gray-900 font-playfair leading-tight mb-6">
          About Sweet Maid Cleaning in <span class="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">${cleanName}, FL</span>
        </h1>
        
        <p class="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed mb-10">
          Built on deep family-owned values and dedicated to delivering Florida's most dependable house cleaning, office janitorial, move-out, and post-construction cleaning services.
        </p>

        <!-- Proven Milestones Grid -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto text-left">
          
          <div class="p-5 sm:p-6 bg-white rounded-2xl border border-pink-100/80 shadow-lg shadow-pink-100/40 hover:shadow-xl hover:border-pink-200 transition-all">
            <div class="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center text-pink-500 mb-3 text-xl">
              <i class="fa-solid fa-house-chimney-check"></i>
            </div>
            <div class="text-3xl sm:text-4xl font-extrabold text-gray-900 font-playfair tracking-tight mb-1">5,000+</div>
            <div class="text-xs sm:text-sm font-bold text-pink-600 uppercase tracking-wider mb-1">Homes & Offices</div>
            <p class="text-xs text-gray-500 leading-snug">Cleaned with hospital-grade sanitization and precision detail.</p>
          </div>

          <div class="p-5 sm:p-6 bg-white rounded-2xl border border-pink-100/80 shadow-lg shadow-pink-100/40 hover:shadow-xl hover:border-pink-200 transition-all">
            <div class="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 mb-3 text-xl">
              <i class="fa-solid fa-trowel-bricks"></i>
            </div>
            <div class="text-3xl sm:text-4xl font-extrabold text-gray-900 font-playfair tracking-tight mb-1">1,200+</div>
            <div class="text-xs sm:text-sm font-bold text-rose-600 uppercase tracking-wider mb-1">Post-Construction & Move-Outs</div>
            <p class="text-xs text-gray-500 leading-snug">Expert drywall dust removal, vacancy resets, and deep turnovers.</p>
          </div>

          <div class="p-5 sm:p-6 bg-white rounded-2xl border border-pink-100/80 shadow-lg shadow-pink-100/40 hover:shadow-xl hover:border-pink-200 transition-all">
            <div class="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 mb-3 text-xl">
              <i class="fa-solid fa-people-roof"></i>
            </div>
            <div class="text-3xl sm:text-4xl font-extrabold text-gray-900 font-playfair tracking-tight mb-1">100%</div>
            <div class="text-xs sm:text-sm font-bold text-amber-600 uppercase tracking-wider mb-1">Family-Owned Values</div>
            <p class="text-xs text-gray-500 leading-snug">Locally operated with genuine integrity, care, and accountability.</p>
          </div>

          <div class="p-5 sm:p-6 bg-white rounded-2xl border border-pink-100/80 shadow-lg shadow-pink-100/40 hover:shadow-xl hover:border-pink-200 transition-all">
            <div class="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 mb-3 text-xl">
              <i class="fa-solid fa-star"></i>
            </div>
            <div class="text-3xl sm:text-4xl font-extrabold text-gray-900 font-playfair tracking-tight mb-1">5.0 ★</div>
            <div class="text-xs sm:text-sm font-bold text-emerald-600 uppercase tracking-wider mb-1">Top-Rated Cleaners</div>
            <p class="text-xs text-gray-500 leading-snug">Consistently recommended by happy homeowners in ${cleanName}.</p>
          </div>

        </div>

      </div>
    </header>

    <!-- Narrative Section: Family-Owned Values & Craftsmanship -->
    <section class="py-16 sm:py-24 bg-white">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          <!-- Story Text (7 Columns) -->
          <div class="lg:col-span-7 space-y-6 text-left">
            <div class="inline-flex items-center gap-2 text-pink-600 text-xs sm:text-sm font-bold tracking-widest uppercase">
              <i class="fa-solid fa-sparkles"></i> Our Story & Purpose in ${cleanName}
            </div>
            
            <h2 class="text-3xl sm:text-4xl font-bold font-playfair text-gray-900 tracking-tight leading-snug">
              Built on Family-Owned Values, Dedicated to Lasting Relationships
            </h2>
            
            <p class="text-gray-700 text-base sm:text-lg leading-relaxed">
              <strong>Sweet Maid Cleaning Service was built on family-owned values focused on delivering the best cleaning to our communities.</strong> We take immense personal pride in our craftsmanship and focus on building long-term relationships with our customers, rather than treating appointments as one-time transactional jobs.
            </p>

            <p class="text-gray-700 text-base sm:text-lg leading-relaxed">
              As a family-owned and operated cleaning company, we bring that genuine care and accountability to every home, corporate suite, and job site we enter across <strong>${cleanName}, FL</strong>. We treat every client’s property with the same reverence, discretion, and meticulous attention to detail that we bring to our own family spaces.
            </p>

            <div class="p-5 rounded-2xl bg-pink-50/60 border border-pink-100 text-gray-800 space-y-2">
              <div class="font-bold flex items-center gap-2 text-pink-700">
                <i class="fa-solid fa-handshake-angle text-pink-500"></i> Building Long-Term Relationships with ${cleanName} Homeowners
              </div>
              <p class="text-sm text-gray-600 leading-relaxed">
                Rather than rotating through temporary sub-contractors, we focus on developing long-term, multi-year partnerships. Our recurring clients in ${cleanName} enjoy consistent cleaning teams who understand their distinct preferences, pet routines, surface requirements, and scheduling needs.
              </p>
            </div>

            <p class="text-gray-700 text-base sm:text-lg leading-relaxed">
              Over the years, our dedicated teams have successfully completed <strong>over 5,000 houses and office cleanings</strong>, along with <strong>more than 1,200 intensive post-construction renovation cleanups and move-out transformations</strong>. From coastal single-family homes to thriving commercial offices in ${cleanName}, we bring proven techniques, HEPA-filtered sanitizing equipment, and non-toxic, pet-safe supplies to every appointment.
            </p>
          </div>

          <!-- Feature Cards / Visual Pillar (5 Columns) -->
          <div class="lg:col-span-5 space-y-4">
            
            <div class="p-6 bg-gradient-to-br from-slate-900 to-gray-800 text-white rounded-3xl shadow-xl relative overflow-hidden text-left">
              <div class="absolute -right-8 -bottom-8 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl pointer-events-none"></div>
              <span class="inline-block bg-pink-500/30 text-pink-200 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">The Sweet Maid Standard</span>
              <h3 class="text-xl font-bold font-playfair mb-3">Why ${cleanName} Chooses Sweet Maid</h3>
              
              <ul class="space-y-3.5 text-sm text-gray-200">
                <li class="flex items-start gap-2.5">
                  <i class="fa-solid fa-circle-check text-pink-400 mt-1"></i>
                  <span><strong>100% Family-Owned & Vetted:</strong> Fully licensed, bonded, and multi-million dollar insured cleaning specialists.</span>
                </li>
                <li class="flex items-start gap-2.5">
                  <i class="fa-solid fa-circle-check text-pink-400 mt-1"></i>
                  <span><strong>5,000+ Completed Projects:</strong> Proven experience across residential estates, commercial facilities, and complex turnovers.</span>
                </li>
                <li class="flex items-start gap-2.5">
                  <i class="fa-solid fa-circle-check text-pink-400 mt-1"></i>
                  <span><strong>Eco-Friendly & Pet Safe:</strong> Hypoallergenic, non-toxic sanitizers that keep children and furry family members safe.</span>
                </li>
                <li class="flex items-start gap-2.5">
                  <i class="fa-solid fa-circle-check text-pink-400 mt-1"></i>
                  <span><strong>100% Sparkle Guarantee:</strong> If any detail falls short, we return within 24 hours to re-clean it free of charge.</span>
                </li>
              </ul>

              <div class="mt-6 pt-5 border-t border-gray-700/60 flex items-center justify-between">
                <div>
                  <div class="text-xs text-gray-400">Direct Local Dispatch</div>
                  <div class="text-sm font-bold text-pink-300">${phoneDisplay}</div>
                </div>
                <a href="${phoneHref}" class="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs px-4 py-2 rounded-full transition-all shadow-md">
                  <i class="fa-solid fa-phone"></i> Call Now
                </a>
              </div>
            </div>

            <!-- Client Trust Card -->
            <div class="p-6 bg-pink-50/50 rounded-3xl border border-pink-100 text-left">
              <div class="flex items-center gap-1 text-amber-400 text-sm mb-2">
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <span class="text-gray-500 text-xs ml-1 font-semibold">5.0 Star Local Reputation</span>
              </div>
              <p class="text-sm text-gray-700 italic leading-relaxed mb-3">
                "Sweet Maid treats our home like family. We've used their recurring service for over two years in the area and their attention to baseboards, bathrooms, and hardwood floors is unmatched!"
              </p>
              <div class="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                <i class="fa-solid fa-shield-heart text-pink-500"></i> Verified ${cleanName}, FL Client
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>

    <!-- Local Service Authority & Interlinking Grid for ${cleanName}, FL -->
    <section class="py-16 sm:py-20 bg-slate-50 border-t border-pink-100/60 text-left">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="text-center max-w-3xl mx-auto mb-12">
          <span class="text-pink-600 font-bold text-xs uppercase tracking-widest">Complete Local Service Spectrum</span>
          <h2 class="text-3xl sm:text-4xl font-bold font-playfair text-gray-900 mt-2 mb-4">
            Professional Cleaning Services in ${cleanName}, FL
          </h2>
          <p class="text-gray-600 text-base">
            Explore our specialized residential and commercial cleaning solutions tailored specifically for homes, vacation rentals, and business properties in ${cleanName}.
          </p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <!-- Card 1: House Cleaning -->
          <a href="/${slug}/house-cleaning/" class="group p-6 bg-white rounded-2xl border border-gray-200/80 hover:border-pink-300 shadow-sm hover:shadow-xl transition-all duration-300">
            <div class="w-12 h-12 rounded-xl bg-pink-50 group-hover:bg-pink-500 group-hover:text-white text-pink-500 flex items-center justify-center text-xl transition-colors mb-4">
              <i class="fa-solid fa-house-chimney"></i>
            </div>
            <h3 class="text-lg font-bold text-gray-900 group-hover:text-pink-600 transition-colors mb-2">
              House Cleaning in ${cleanName}
            </h3>
            <p class="text-sm text-gray-600 leading-relaxed mb-4">
              Scheduled weekly, bi-weekly, or monthly maid service maintaining spotless kitchens, sanitized bathrooms, and pristine floors.
            </p>
            <span class="inline-flex items-center gap-1 text-xs font-bold text-pink-500 group-hover:gap-2 transition-all">
              Explore House Cleaning <i class="fa-solid fa-arrow-right text-[11px]"></i>
            </span>
          </a>

          <!-- Card 2: Deep Cleaning -->
          <a href="/${slug}/deep-cleaning/" class="group p-6 bg-white rounded-2xl border border-gray-200/80 hover:border-pink-300 shadow-sm hover:shadow-xl transition-all duration-300">
            <div class="w-12 h-12 rounded-xl bg-rose-50 group-hover:bg-rose-500 group-hover:text-white text-rose-500 flex items-center justify-center text-xl transition-colors mb-4">
              <i class="fa-solid fa-sparkles"></i>
            </div>
            <h3 class="text-lg font-bold text-gray-900 group-hover:text-pink-600 transition-colors mb-2">
              Deep Cleaning in ${cleanName}
            </h3>
            <p class="text-sm text-gray-600 leading-relaxed mb-4">
              Comprehensive top-to-bottom reset hand-scrubbing baseboards, detailing interior appliances, and removing accumulated grime.
            </p>
            <span class="inline-flex items-center gap-1 text-xs font-bold text-pink-500 group-hover:gap-2 transition-all">
              Explore Deep Cleaning <i class="fa-solid fa-arrow-right text-[11px]"></i>
            </span>
          </a>

          <!-- Card 3: Move In / Move Out -->
          <a href="/${slug}/move-in-out-cleaning/" class="group p-6 bg-white rounded-2xl border border-gray-200/80 hover:border-pink-300 shadow-sm hover:shadow-xl transition-all duration-300">
            <div class="w-12 h-12 rounded-xl bg-purple-50 group-hover:bg-purple-500 group-hover:text-white text-purple-500 flex items-center justify-center text-xl transition-colors mb-4">
              <i class="fa-solid fa-truck-ramp-box"></i>
            </div>
            <h3 class="text-lg font-bold text-gray-900 group-hover:text-pink-600 transition-colors mb-2">
              Move In / Out Cleaning in ${cleanName}
            </h3>
            <p class="text-sm text-gray-600 leading-relaxed mb-4">
              Guaranteed security deposit recovery and move-in ready sanitization for landlords, buyers, realtors, and relocating tenants.
            </p>
            <span class="inline-flex items-center gap-1 text-xs font-bold text-pink-500 group-hover:gap-2 transition-all">
              Explore Move-In/Out Care <i class="fa-solid fa-arrow-right text-[11px]"></i>
            </span>
          </a>

          <!-- Card 4: Post-Construction -->
          <a href="/${slug}/post-construction-cleaning/" class="group p-6 bg-white rounded-2xl border border-gray-200/80 hover:border-pink-300 shadow-sm hover:shadow-xl transition-all duration-300">
            <div class="w-12 h-12 rounded-xl bg-amber-50 group-hover:bg-amber-500 group-hover:text-white text-amber-500 flex items-center justify-center text-xl transition-colors mb-4">
              <i class="fa-solid fa-trowel-bricks"></i>
            </div>
            <h3 class="text-lg font-bold text-gray-900 group-hover:text-pink-600 transition-colors mb-2">
              Post-Construction Cleanup in ${cleanName}
            </h3>
            <p class="text-sm text-gray-600 leading-relaxed mb-4">
              Phase 1 rough cleans and final white-glove detailing extracting stubborn drywall dust, adhesive residue, and fine construction debris.
            </p>
            <span class="inline-flex items-center gap-1 text-xs font-bold text-pink-500 group-hover:gap-2 transition-all">
              Explore Post-Construction <i class="fa-solid fa-arrow-right text-[11px]"></i>
            </span>
          </a>

          <!-- Card 5: Commercial Cleaning -->
          <a href="/${slug}/commercial-cleaning/" class="group p-6 bg-white rounded-2xl border border-gray-200/80 hover:border-pink-300 shadow-sm hover:shadow-xl transition-all duration-300">
            <div class="w-12 h-12 rounded-xl bg-blue-50 group-hover:bg-blue-500 group-hover:text-white text-blue-500 flex items-center justify-center text-xl transition-colors mb-4">
              <i class="fa-solid fa-building"></i>
            </div>
            <h3 class="text-lg font-bold text-gray-900 group-hover:text-pink-600 transition-colors mb-2">
              Commercial Cleaning in ${cleanName}
            </h3>
            <p class="text-sm text-gray-600 leading-relaxed mb-4">
              Professional office janitorial, corporate suite sanitization, and retail upkeep creating a pristine, healthy workplace environment.
            </p>
            <span class="inline-flex items-center gap-1 text-xs font-bold text-pink-500 group-hover:gap-2 transition-all">
              Explore Commercial Services <i class="fa-solid fa-arrow-right text-[11px]"></i>
            </span>
          </a>

          <!-- Card 6: Recurring Maid Service -->
          <a href="/${slug}/recurring-maid-service/" class="group p-6 bg-white rounded-2xl border border-gray-200/80 hover:border-pink-300 shadow-sm hover:shadow-xl transition-all duration-300">
            <div class="w-12 h-12 rounded-xl bg-teal-50 group-hover:bg-teal-500 group-hover:text-white text-teal-500 flex items-center justify-center text-xl transition-colors mb-4">
              <i class="fa-solid fa-calendar-check"></i>
            </div>
            <h3 class="text-lg font-bold text-gray-900 group-hover:text-pink-600 transition-colors mb-2">
              Recurring Maid Service in ${cleanName}
            </h3>
            <p class="text-sm text-gray-600 leading-relaxed mb-4">
              Tailored recurring cleaning schedules with priority scheduling, dedicated cleaning specialists, and recurring client discounts.
            </p>
            <span class="inline-flex items-center gap-1 text-xs font-bold text-pink-500 group-hover:gap-2 transition-all">
              Explore Recurring Plans <i class="fa-solid fa-arrow-right text-[11px]"></i>
            </span>
          </a>

        </div>

        <!-- Contextual Nearby Florida Communities -->
        <div class="mt-14 pt-10 border-t border-gray-200/70 text-center">
          <div class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
            Serving ${cleanName} and Neighboring Communities
          </div>
          <div class="flex flex-wrap justify-center items-center gap-2">
            ${nearbyLinksHtml}
            <a href="/${slug}/blog/" class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-pink-50 text-pink-700 hover:bg-pink-100 text-xs font-bold transition-all">
              <i class="fa-solid fa-newspaper text-pink-400"></i> ${cleanName} Cleaning Guides
            </a>
          </div>
        </div>

      </div>
    </section>

  </article>
  `;
}
