export interface LocalReview {
  name: string;
  initial: string;
  avatarBg: string;
  date: string;
  text: string;
  badge: string;
  service: string;
}

/**
 * Generates dynamic, hyper-localized SEO reviews for each Florida city and service page.
 * Strictly guarantees:
 * - Every review explicitly targets ${cleanName}, FL
 * - Zero cross-city leakage (e.g. no mentions of Lakewood Ranch or Sarasota on Miami/Tampa/Orlando pages)
 * - Service-specific praise for specialized cleaning pages
 * - Matches the existing modern carousel UI with Google badges and verified customer tags
 */
export function generateLocalSeoReviewsHtml(
  cleanName: string,
  locSlug: string,
  currentService: string = 'house-cleaning',
  isSpecificService: boolean = false
): string {
  const serviceSlug = (currentService || 'house-cleaning').toLowerCase();

  const reviews: LocalReview[] = getReviewsForServiceAndLocation(cleanName, serviceSlug, isSpecificService);

  const cardsHtml = reviews.map((rev) => `
          <!-- Review Card -->
          <div class="min-w-[320px] md:min-w-[380px] max-w-[400px] bg-white rounded-2xl p-7 shadow-sm border border-pink-100/70 hover:shadow-md transition-shadow snap-start flex flex-col justify-between">
            <div>
              <div class="flex items-start gap-4 mb-4">
                <div class="w-12 h-12 rounded-full ${rev.avatarBg} flex items-center justify-center text-gray-800 font-bold text-lg flex-shrink-0 shadow-2xs">
                  ${rev.initial}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between gap-2 mb-1">
                    <h4 class="font-bold text-gray-900 truncate text-base">${rev.name}</h4>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" class="w-5 h-5 flex-shrink-0" decoding="async" width="20" height="20">
                  </div>
                  <div class="text-xs text-gray-500 mb-1.5 flex items-center gap-1.5">
                    <span>${rev.date}</span>
                    <span class="text-gray-300">•</span>
                    <span class="text-pink-600 font-semibold truncate">${cleanName}, FL</span>
                  </div>
                  <div class="flex text-yellow-400 gap-0.5" aria-label="5 out of 5 stars">
                    <i class="fa-solid fa-star text-xs"></i>
                    <i class="fa-solid fa-star text-xs"></i>
                    <i class="fa-solid fa-star text-xs"></i>
                    <i class="fa-solid fa-star text-xs"></i>
                    <i class="fa-solid fa-star text-xs"></i>
                    <i class="fa-solid fa-circle-check text-pink-300 text-[11px] ml-1" title="Verified Clean"></i>
                  </div>
                </div>
              </div>
              <p class="text-gray-700 leading-relaxed text-sm">
                "${rev.text}"
              </p>
            </div>
            <div class="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <span class="text-gray-500 font-medium flex items-center gap-1 truncate max-w-[200px]">
                <i class="fa-solid fa-location-dot text-pink-400"></i> ${cleanName} Resident
              </span>
              <span class="inline-flex items-center gap-1 text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full text-[11px]">
                <i class="fa-solid fa-shield-check"></i> Verified
              </span>
            </div>
          </div>
  `).join('\n');

  return `<!-- Reviews Carousel -->
      <div class="relative mt-16">
        <div class="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide" id="reviews-carousel">
${cardsHtml}
        </div>

        <!-- Navigation Arrows -->
        <button onclick="document.getElementById('reviews-carousel').scrollBy({left: -400, behavior: 'smooth'})"
          class="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg items-center justify-center hover:bg-gray-50 transition"
          aria-label="Previous Reviews">
          <i class="fa-solid fa-chevron-left text-gray-600"></i>
        </button>
        <button onclick="document.getElementById('reviews-carousel').scrollBy({left: 400, behavior: 'smooth'})"
          class="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg items-center justify-center hover:bg-gray-50 transition"
          aria-label="Next Reviews">
          <i class="fa-solid fa-chevron-right text-gray-600"></i>
        </button>
      </div>
      `;
}

function getReviewsForServiceAndLocation(
  cleanName: string,
  serviceSlug: string,
  isSpecificService: boolean
): LocalReview[] {
  // 1. Deep Cleaning
  if (serviceSlug.includes('deep-cleaning')) {
    return [
      {
        name: 'Amanda Richardson',
        initial: 'A',
        avatarBg: 'bg-pink-200',
        date: '2026-08-14',
        text: `Booked Sweet Maid for an intensive deep clean of our home in ${cleanName} and the results were breathtaking! They hand-scrubbed the baseboards, cleaned behind appliances, detailed the grout, and left every room spotless. Best deep cleaning company in ${cleanName}!`,
        badge: 'Homeowner',
        service: 'Deep Cleaning'
      },
      {
        name: 'Carlos M. Mendez',
        initial: 'C',
        avatarBg: 'bg-blue-200',
        date: '2026-07-29',
        text: `We hired Sweet Maid for a seasonal deep house clean in ${cleanName}. They arrived on time with commercial HEPA vacuums and detailed every corner from ceiling fan blades to bathroom tiles. Exceptional attention to detail in ${cleanName}, FL!`,
        badge: 'Resident',
        service: 'Deep Cleaning'
      },
      {
        name: 'Elena Rostova',
        initial: 'E',
        avatarBg: 'bg-rose-200',
        date: '2026-07-03',
        text: `Our ${cleanName} house needed serious deep cleaning before family arrived for summer vacation. The Sweet Maid crew worked diligently for 4 hours and transformed our kitchen and bathrooms completely. Worth every penny!`,
        badge: 'Verified Client',
        service: 'Deep Cleaning'
      },
      {
        name: 'Marcus Vance',
        initial: 'M',
        avatarBg: 'bg-amber-200',
        date: '2026-06-18',
        text: `I had never hired professional deep cleaners in ${cleanName} before, but Sweet Maid set the gold standard. Non-toxic cleaning products, spotless oven detailing, and immaculate wood floors. 10/10 recommend!`,
        badge: 'Verified Homeowner',
        service: 'Deep Cleaning'
      },
      {
        name: 'Stephanie Brooks',
        initial: 'S',
        avatarBg: 'bg-purple-200',
        date: '2026-05-24',
        text: `Sweet Maid's deep cleaning service in ${cleanName} tackled years of accumulated grime on baseboards and kitchen cabinets. Professional, friendly cleaners who take genuine pride in their work.`,
        badge: 'Homeowner',
        service: 'Deep Cleaning'
      }
    ];
  }

  // 2. Move-In / Move-Out Cleaning
  if (serviceSlug.includes('move-in') || serviceSlug.includes('move-out') || serviceSlug.includes('eviction')) {
    return [
      {
        name: 'Brianna Collins',
        initial: 'B',
        avatarBg: 'bg-purple-200',
        date: '2026-08-08',
        text: `Needed a move-out clean in ${cleanName} on short notice and Sweet Maid came through! Our landlord performed the walk-through inspection and returned 100% of our security deposit on the spot. Highly recommend their move out service in ${cleanName}, FL!`,
        badge: 'Tenant',
        service: 'Move-Out Cleaning'
      },
      {
        name: 'David & Laura Chen',
        initial: 'D',
        avatarBg: 'bg-emerald-200',
        date: '2026-07-22',
        text: `Before moving into our new home in ${cleanName}, we booked Sweet Maid for a complete move-in sanitization. They sanitized all cabinet interiors, drawers, bathrooms, and closets so we felt 100% comfortable unpacking. Outstanding service in ${cleanName}!`,
        badge: 'New Homeowner',
        service: 'Move-In Cleaning'
      },
      {
        name: 'Kevin O\'Connor',
        initial: 'K',
        avatarBg: 'bg-blue-200',
        date: '2026-06-15',
        text: `As a property manager in ${cleanName}, fast and thorough turnover cleaning is essential between tenants. Sweet Maid is our go-to partner—reliable scheduling, fair pricing, and immaculate results every single time.`,
        badge: 'Property Manager',
        service: 'Turnover Cleaning'
      },
      {
        name: 'Jessica M. Taylor',
        initial: 'J',
        avatarBg: 'bg-pink-200',
        date: '2026-05-30',
        text: `Relocating across Florida was stressful, but Sweet Maid made our ${cleanName} move-out cleaning completely seamless. The oven, fridge, and baseboards were cleaner than when we first moved in!`,
        badge: 'Relocated Resident',
        service: 'Move-Out Cleaning'
      },
      {
        name: 'Gabriel Morales',
        initial: 'G',
        avatarBg: 'bg-amber-200',
        date: '2026-05-11',
        text: `Top-notch move-in cleaning in ${cleanName}, FL! Arrived right on schedule, brought their own premium supplies, and left our newly purchased home smelling fresh and looking spotless.`,
        badge: 'Homeowner',
        service: 'Move-In Cleaning'
      }
    ];
  }

  // 3. Airbnb & Vacation Rental Cleaning
  if (serviceSlug.includes('airbnb') || serviceSlug.includes('vacation-rental')) {
    return [
      {
        name: 'Rachel Zimmerman',
        initial: 'R',
        avatarBg: 'bg-rose-200',
        date: '2026-08-11',
        text: `Sweet Maid manages turnovers for our vacation rental properties in ${cleanName}. Since partnering with them, our Airbnb guest cleanliness rating has stayed at a perfect 5.0 stars! Fast same-day resets, fresh linens, and reliable restocks.`,
        badge: 'Superhost',
        service: 'Airbnb Cleaning'
      },
      {
        name: 'Tyler Henderson',
        initial: 'T',
        avatarBg: 'bg-indigo-200',
        date: '2026-07-25',
        text: `Managing a short-term rental in ${cleanName} from out of state was stressful until I hired Sweet Maid. They send post-clean photos, alert me if anything is damaged, and guarantee every guest walks into a spotless home.`,
        badge: 'Vacation Rental Owner',
        service: 'Turnover Cleaning'
      },
      {
        name: 'Sofia Alvarez',
        initial: 'S',
        avatarBg: 'bg-pink-200',
        date: '2026-06-29',
        text: `Hands down the most reliable turnover team in ${cleanName}, FL! Even during peak weekend back-to-back guest check-ins, they never miss a beat. Sweet Maid is an essential partner for our rental business.`,
        badge: 'Co-Host',
        service: 'Short-Term Rental'
      },
      {
        name: 'Markus Vance',
        initial: 'M',
        avatarBg: 'bg-amber-200',
        date: '2026-06-04',
        text: `Superb cleaning service in ${cleanName}. They stage the towels, refill toiletries, and ensure the patio and living spaces are pristine. Guests frequently mention the cleanliness in their public reviews!`,
        badge: 'Rental Owner',
        service: 'Airbnb Turnover'
      },
      {
        name: 'Danielle Cooper',
        initial: 'D',
        avatarBg: 'bg-teal-200',
        date: '2026-05-18',
        text: `Sweet Maid is the secret weapon for our ${cleanName} Airbnb portfolio. Never had a single cleanliness complaint. Punctual, responsive, and always five-star quality.`,
        badge: 'Premier Host',
        service: 'Vacation Rental'
      }
    ];
  }

  // 4. Commercial & Janitorial Cleaning
  if (serviceSlug.includes('commercial') || serviceSlug.includes('janitorial') || serviceSlug.includes('office') || serviceSlug.includes('medical') || serviceSlug.includes('bank') || serviceSlug.includes('law-firm')) {
    return [
      {
        name: 'Marcus Lieberman',
        initial: 'M',
        avatarBg: 'bg-slate-200',
        date: '2026-08-04',
        text: `Sweet Maid provides weekly commercial cleaning for our corporate offices in ${cleanName}. They sanitize workstations, detail the conference rooms, restock restrooms, and keep our lobby pristine. Dependable, vetted, and trustworthy in ${cleanName}, FL!`,
        badge: 'Operations Director',
        service: 'Commercial Cleaning'
      },
      {
        name: 'Dr. Evelyn Walsh',
        initial: 'E',
        avatarBg: 'bg-blue-200',
        date: '2026-07-19',
        text: `We hired Sweet Maid for medical facility cleaning in ${cleanName} and their sanitization protocols are top-tier. Hospital-grade disinfectants, meticulous floor sanitization, and dependable night crew. Highly recommended!`,
        badge: 'Clinic Manager',
        service: 'Facility Cleaning'
      },
      {
        name: 'Arthur Sterling',
        initial: 'A',
        avatarBg: 'bg-emerald-200',
        date: '2026-06-23',
        text: `Our law firm in ${cleanName} requires confidentiality and immaculate cleanliness. Sweet Maid's uniformed cleaning specialists are professional, thorough, and consistent. Excellent commercial service.`,
        badge: 'Managing Partner',
        service: 'Office Janitorial'
      },
      {
        name: 'Patricia Gomez',
        initial: 'P',
        avatarBg: 'bg-purple-200',
        date: '2026-05-28',
        text: `Running a busy retail space in ${cleanName} means high foot traffic and dusty floors. Sweet Maid keeps our storefront sparkling clean every week. Our staff and customers appreciate the spotless environment!`,
        badge: 'Store Owner',
        service: 'Retail Cleaning'
      },
      {
        name: 'Brian Thorne',
        initial: 'B',
        avatarBg: 'bg-amber-200',
        date: '2026-05-09',
        text: `Dependable, licensed, and insured commercial cleaners in ${cleanName}, FL. Sweet Maid handles our multi-tenant commercial building with zero complaints. The best janitorial team in town.`,
        badge: 'Facility Manager',
        service: 'Commercial Janitorial'
      }
    ];
  }

  // 5. Post-Construction & Renovation Cleaning
  if (serviceSlug.includes('post-construction') || serviceSlug.includes('post-renovation')) {
    return [
      {
        name: 'Jason Bradley',
        initial: 'J',
        avatarBg: 'bg-amber-200',
        date: '2026-08-07',
        text: `As a general contractor in ${cleanName}, finding a cleaning crew that actually removes fine drywall dust is tough. Sweet Maid did a phenomenal job on our new home build in ${cleanName}—every window, sill, cabinet, and floor was spotless for final inspection!`,
        badge: 'General Contractor',
        service: 'Post-Construction'
      },
      {
        name: 'Hannah & Craig Miller',
        initial: 'H',
        avatarBg: 'bg-rose-200',
        date: '2026-07-16',
        text: `Following a major kitchen remodel in our ${cleanName} home, white construction dust was everywhere. Sweet Maid's team spent the day extracting every speck of dust and detailing our appliances. It looked better than new!`,
        badge: 'Homeowner',
        service: 'Renovation Clean'
      },
      {
        name: 'Derek Sullivan',
        initial: 'D',
        avatarBg: 'bg-blue-200',
        date: '2026-06-21',
        text: `Hired Sweet Maid for post-construction white-glove clean in ${cleanName}, FL. They removed paint overspray from glass, cleaned HVAC vents, and detailed hardwood floors without scratching. 5-star craftsmanship!`,
        badge: 'Builder',
        service: 'Construction Cleanup'
      },
      {
        name: 'Melanie Vance',
        initial: 'M',
        avatarBg: 'bg-emerald-200',
        date: '2026-05-27',
        text: `We remodeled our master bath and living area in ${cleanName}. Sweet Maid sent a skilled crew with industrial HEPA gear who cleared all drywall dust and residue in just one visit. Highly impressed!`,
        badge: 'Resident',
        service: 'Post-Renovation'
      },
      {
        name: 'Ricardo Silva',
        initial: 'R',
        avatarBg: 'bg-purple-200',
        date: '2026-05-02',
        text: `Outstanding post-construction cleaning service in ${cleanName}. Thorough, fast, and very professional team. Will definitely use them on all our future development projects.`,
        badge: 'Real Estate Developer',
        service: 'Construction Cleaning'
      }
    ];
  }

  // 6. Default: General House Cleaning, Recurring Maid Service, City Home & About Pages
  return [
    {
      name: 'Amanda Richardson',
      initial: 'A',
      avatarBg: 'bg-pink-200',
      date: '2026-08-16',
      text: `We have been using Sweet Maid for our recurring house cleaning in ${cleanName} for over six months now. The cleaning team is always on time, extremely thorough with the kitchen and bathrooms, and our home smells fresh without any harsh chemical odors. Absolutely 5-star service in ${cleanName}, FL!`,
      badge: 'Homeowner',
      service: 'Recurring House Cleaning'
    },
    {
      name: 'Carlos M. Mendez',
      initial: 'C',
      avatarBg: 'bg-blue-200',
      date: '2026-08-02',
      text: `Booked their deep cleaning service for our home in ${cleanName} before hosting guests for the weekend. They detailed the baseboards, inside the oven, windows, and tile grout until everything looked brand new. Highly recommend Sweet Maid to anyone in the ${cleanName} area!`,
      badge: 'Verified Resident',
      service: 'Deep Cleaning'
    },
    {
      name: 'Stephanie Brooks',
      initial: 'S',
      avatarBg: 'bg-purple-200',
      date: '2026-07-24',
      text: `Needed a dependable maid service in ${cleanName} after having a baby and Sweet Maid has been an absolute lifesaver. Trustworthy, friendly cleaners who respect our home and leave our floors and bathrooms sparkling clean every visit.`,
      badge: 'Homeowner',
      service: 'Weekly Maid Service'
    },
    {
      name: 'David & Jennifer Vance',
      initial: 'D',
      avatarBg: 'bg-emerald-200',
      date: '2026-07-10',
      text: `Hands down the best cleaning company in ${cleanName}. As working parents with two dogs, keeping up with hardwood floors and pet hair felt impossible. The Sweet Maid team leaves our house sparkling every single time!`,
      badge: 'Recurring Client',
      service: 'Bi-Weekly Cleaning'
    },
    {
      name: 'Elena Rostova',
      initial: 'E',
      avatarBg: 'bg-amber-200',
      date: '2026-06-25',
      text: `I tried two other cleaning services in ${cleanName} before discovering Sweet Maid. The difference in quality, consistency, and customer care is night and day. They listen to special requests and treat our home like family.`,
      badge: 'Verified Customer',
      service: 'Residential Cleaning'
    },
    {
      name: 'Marcus Lieberman',
      initial: 'M',
      avatarBg: 'bg-slate-200',
      date: '2026-06-08',
      text: `Sweet Maid provides cleaning for our residential estate in ${cleanName}, FL. Consistently reliable, thorough, and detail-oriented. Having a dependable local cleaning team you can trust with keys is priceless!`,
      badge: 'Verified Resident',
      service: 'House Cleaning'
    }
  ];
}
