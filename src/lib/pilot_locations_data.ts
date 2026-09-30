export interface PilotLocationProfile {
  slug: string;
  name: string;
  county: string;
  region: string;
  phone: string;
  title: string;
  h1: string;
  metaDescription: string;
  heroSub: string;
  badge: string;
  whyChooseTitle: string;
  whyChoosePoints: { title: string; desc: string; icon: string }[];
  climateTitle: string;
  climateBody: string;
  neighborhoodsTitle: string;
  neighborhoodsBody: string;
  neighborhoodsList: string[];
  zipCodes: string[];
  faqs: { q: string; a: string }[];
}

export const PILOT_LOCATIONS_DATA: Record<string, PilotLocationProfile> = {
  'bradenton-fl': {
    slug: 'bradenton-fl',
    name: 'Bradenton',
    county: 'Manatee County',
    region: 'Manatee County (Bradenton Base)',
    phone: '(941) 222-2080',
    title: 'Cleaning Services in Bradenton, FL | Sweet Maid',
    h1: 'Cleaning Services in Bradenton, FL',
    metaDescription: 'Professional cleaning services in Bradenton, FL. Family-owned recurring maid visits, deep house cleanings, and move-out turnovers. Get your free quote today.',
    heroSub: 'Sweet Maid was founded in Bradenton, delivering dependable residential and commercial cleaning from Palma Sola to Lakewood Ranch. As a family-owned local company, we provide transparent flat-rate pricing, dedicated cleaning teams, and consistent care for every home.',
    badge: '📍 Sweet Maid Home Base • Serving Bradenton & Manatee County',
    whyChooseTitle: 'Why Bradenton Residents Choose Sweet Maid',
    whyChoosePoints: [
      {
        title: 'Local Bradenton Base',
        desc: 'Founded right here in Manatee County with direct owner accountability and prompt dispatch across all Bradenton neighborhoods.',
        icon: 'fa-house-flag'
      },
      {
        title: 'River & Bay Moisture Care',
        desc: 'Specialized cleaning routines targeting damp river air residue and humidity along Palma Sola Bay and the Manatee River.',
        icon: 'fa-water'
      },
      {
        title: 'Consistent Dedicated Crews',
        desc: 'Enjoy the peace of mind of seeing familiar, vetted cleaning professionals who understand your home\'s exact layout.',
        icon: 'fa-users'
      },
      {
        title: 'Transparent Flat-Rate Pricing',
        desc: 'Upfront estimates based on your home size with zero hidden travel surcharges, contracts, or unexpected fees.',
        icon: 'fa-tag'
      }
    ],
    climateTitle: 'Protecting Bradenton Homes from River Moisture, Sand & Oak Pollen',
    climateBody: 'Bradenton\'s coastal geography—bordered by the Manatee River, Palma Sola Bay, and the Gulf—exposes homes to continuous humidity, fine lawn grit, and heavy spring live oak pollen. Older ranch-style homes in West Bradenton feature extensive tile and grout lines that trap soil, while modern residences in East Bradenton and Tara require delicate care for luxury vinyl plank and open-concept lanais. Our systematic routines include high-efficiency HEPA vacuuming, damp microfiber register detailing, and targeted grout cleaning.',
    neighborhoodsTitle: 'Serving Communities Across Bradenton & Manatee County',
    neighborhoodsBody: 'Our Bradenton cleaning teams regularly service homes and businesses throughout Palma Sola, West Bradenton, the historic River District, Village of the Arts, Bayshore Gardens, Whitfield, Tara Preserve, Heritage Harbour, and the Manatee side of Lakewood Ranch.',
    neighborhoodsList: [
      'Palma Sola', 'West Bradenton', 'River District', 'Village of the Arts',
      'Bayshore Gardens', 'Whitfield', 'Tara Preserve', 'Heritage Harbour'
    ],
    zipCodes: ['34205', '34208', '34209', '34212'],
    faqs: [
      {
        q: 'How does Sweet Maid handle security gates and community access in Bradenton?',
        a: 'Many of our Bradenton clients reside in gated enclaves like Tara or River Strand. You can simply provide a temporary gate code, add Sweet Maid to your community visitor list, or leave a lockbox key. Our dispatch team confirms arrival and ensures your home is locked securely.'
      },
      {
        q: 'How often should I schedule house cleaning for my Bradenton home?',
        a: 'Most households in Bradenton opt for bi-weekly recurring cleaning to keep ahead of seasonal humidity, tracked-in lawn soil, and pet dander. Weekly visits are popular for larger families, while monthly deep maintenance serves seasonal winter residents.'
      },
      {
        q: 'How much do cleaning services cost in Bradenton, FL?',
        a: 'Standard recurring cleaning in Bradenton starts from $180, while intensive deep cleanings start from $250. Final rates depend on total square footage, number of bedrooms and bathrooms, and home condition. Request a free quote online for an instant estimate.'
      },
      {
        q: 'Do I need to be home when your Bradenton cleaning team arrives?',
        a: 'No, you do not need to be home. The majority of our Bradenton clients are at work or enjoying the day. We access your home via lockbox, keypad code, or front desk clearance and secure all entrances before leaving.'
      },
      {
        q: 'What is the difference between regular housekeeping and a deep clean in Bradenton?',
        a: 'Regular housekeeping focuses on upkeep: wiping countertops, vacuuming, mopping, bathroom sanitizing, and dusting. A deep clean adds intensive hand-wiping of baseboards, interior window sills, door frames, AC return vents, and scrubbing bathroom grout.'
      }
    ]
  },

  'sarasota-fl': {
    slug: 'sarasota-fl',
    name: 'Sarasota',
    county: 'Sarasota County',
    region: 'Sarasota County',
    phone: '(941) 222-2080',
    title: 'Cleaning Services in Sarasota, FL | Sweet Maid',
    h1: 'Cleaning Services in Sarasota, FL',
    metaDescription: 'Trusted cleaning services in Sarasota, FL. Family-owned home care, natural stone detailing, seasonal deep cleans, and condo turnovers. Request a free quote.',
    heroSub: 'Sweet Maid provides detail-oriented cleaning services in Sarasota, FL, caring for bayfront homes, historic bungalows, and modern condos. Our family-owned team delivers transparent flat-rate pricing, dedicated cleaners, and dependable scheduling.',
    badge: '📍 Serving Sarasota, Palmer Ranch & Nearby Barrier Islands',
    whyChooseTitle: 'Why Sarasota Residents Choose Sweet Maid',
    whyChoosePoints: [
      {
        title: 'Artisanal Stone Care',
        desc: 'Experienced handling of delicate Italian marble, travertine, and quartz surfaces common in upscale Sarasota residences.',
        icon: 'fa-gem'
      },
      {
        title: 'Gulf Coast Salt Defense',
        desc: 'Dedicated cleaning of exterior sliding glass pockets and window sills facing Sarasota Bay and coastal breezes.',
        icon: 'fa-wind'
      },
      {
        title: 'Flexible Recurring Plans',
        desc: 'Tailored housekeeping cadences for busy downtown professionals, growing families, and seasonal winter residents.',
        icon: 'fa-calendar-days'
      },
      {
        title: 'Honest Flat Rates',
        desc: 'Transparent quotes based strictly on square footage and service needs, with no contracts or hidden surprises.',
        icon: 'fa-file-invoice-dollar'
      }
    ],
    climateTitle: 'Managing Coastal Salt Air, Fine Sand & Subtropical Humidity in Sarasota',
    climateBody: 'Sarasota properties—from mainland neighborhoods like Southside Village and Palmer Ranch to bayfront enclaves—face constant exposure to coastal salt aerosols, tracked-in beach quartz sand from Siesta Key, and heavy indoor AC condensation. Salt particles bond to glass surfaces and corrode fixtures, while fine sand acts like sandpaper on polished hardwood and terrazzo floors. Our teams utilize soft-roller HEPA vacuums, microfiber dusting systems, and pH-neutral cleansers that protect expensive flooring finishes.',
    neighborhoodsTitle: 'Serving Neighborhoods Throughout Sarasota, FL',
    neighborhoodsBody: 'We proudly serve homeowners and businesses across Southside Village, Palmer Ranch, Gulf Gate, McClellan Park, Indian Beach-Sapphire Shores, Downtown Sarasota, Arlington Park, and Bee Ridge.',
    neighborhoodsList: [
      'Southside Village', 'Palmer Ranch', 'Gulf Gate', 'McClellan Park',
      'Indian Beach-Sapphire Shores', 'Downtown Sarasota', 'Arlington Park', 'Bee Ridge'
    ],
    zipCodes: ['34231', '34236', '34238', '34239', '34241'],
    faqs: [
      {
        q: 'How do your cleaners protect natural marble and travertine floors in Sarasota homes?',
        a: 'Many Sarasota residences feature travertine, polished marble, or terrazzo. We strictly use pH-neutral stone cleaners and fresh microfiber flat mops to prevent etching, dulling, or chemical discoloration.'
      },
      {
        q: 'Do you offer cleaning services for seasonal Sarasota residents and snowbirds?',
        a: 'Yes. We provide pre-arrival opening deep cleans to eliminate stale odors and dust, recurring maid care during your winter stay, and comprehensive closing cleanouts when departing for the summer.'
      },
      {
        q: 'What are your cleaning rates in Sarasota, FL?',
        a: 'Pricing in Sarasota starts from $180 for standard recurring cleaning, $250 for comprehensive deep cleaning, and $350 for move-in or move-out resets. Rates are flat-rate based on home size and condition.'
      },
      {
        q: 'Can your team clean condo units in Downtown Sarasota with building access rules?',
        a: 'Yes. We routinely coordinate with condo concierge desks, service elevator booking schedules, and security check-ins for high-rise residential buildings throughout Downtown Sarasota.'
      },
      {
        q: 'How do you handle fine Siesta Key quartz sand tracked into our living areas?',
        a: 'High-quartz sand scratches protective polyurethane floor finishes if swept with rough brooms. We use dual-stage commercial HEPA vacuums with soft microfiber roller heads that lift quartz granules without abrasion.'
      }
    ]
  },

  'miami-fl': {
    slug: 'miami-fl',
    name: 'Miami',
    county: 'Miami-Dade County',
    region: 'Miami-Dade County',
    phone: '(305) 851-6959',
    title: 'Cleaning Services in Miami, FL | Sweet Maid Cleaning Service',
    h1: 'Cleaning Services in Miami, FL',
    metaDescription: 'Bespoke cleaning services in Miami, FL. High-rise condo sanitization, luxury residence deep cleans, and dependable recurring maid care. Get a free quote.',
    heroSub: 'Sweet Maid delivers professional cleaning services in Miami, FL, serving luxury condos, modern penthouses, and suburban estates. Our family-owned team brings transparent flat-rate pricing, punctuality, and white-glove care to every home.',
    badge: '📍 Serving Miami, Brickell, Coral Gables & Miami-Dade County',
    whyChooseTitle: 'Why Miami Residents Choose Sweet Maid',
    whyChoosePoints: [
      {
        title: 'High-Rise Protocol Mastery',
        desc: 'Flawless coordination with front desk concierges, freight elevator reservations, and building access security.',
        icon: 'fa-building'
      },
      {
        title: 'Subtropical Humidity Defense',
        desc: 'Proactive sanitation of air return grilles to prevent dark mildew accumulation from continuous air conditioning.',
        icon: 'fa-fan'
      },
      {
        title: 'Dedicated South FL Team',
        desc: 'Direct regional communication and responsive scheduling via our dedicated South Florida dispatch line at (305) 851-6959.',
        icon: 'fa-phone-volume'
      },
      {
        title: 'Upfront Flat-Rate Estimates',
        desc: 'Transparent pricing with no hidden parking surcharges, travel fees, or cancellation traps.',
        icon: 'fa-receipt'
      }
    ],
    climateTitle: 'Combating Urban Dust, Marine Salt Fog & Tropical Humidity in Miami',
    climateBody: 'Miami homes—from high-rises in Brickell and Edgewater to sprawling estates in Coral Gables and Pinecrest—endure unique atmospheric pressures. Ocean breezes carry salt spray that clouds balcony glass, while intense urban traffic introduces fine exhaust particulate into apartments. Coupled with year-round 80%+ humidity that creates mildew around AC supply registers, homes demand detail-focused upkeep. We utilize commercial air-purified HEPA systems, electrostatic dusting, and non-toxic sanitizing solutions.',
    neighborhoodsTitle: 'Serving Neighborhoods Across Miami & Miami-Dade',
    neighborhoodsBody: 'Our South Florida crews provide recurring and deep cleaning across Brickell, Coconut Grove, Coral Gables, Downtown Miami, Wynwood, Edgewater, Pinecrest, South Miami, and Doral.',
    neighborhoodsList: [
      'Brickell', 'Coconut Grove', 'Coral Gables', 'Downtown Miami',
      'Wynwood', 'Edgewater', 'Pinecrest', 'South Miami', 'Doral'
    ],
    zipCodes: ['33129', '33130', '33131', '33133', '33137', '33146', '33156'],
    faqs: [
      {
        q: 'How do you coordinate cleaning visits for high-rise condos in Brickell and Downtown Miami?',
        a: 'We regularly coordinate with residential concierge desks and building management. We comply with building insurance requirements, sign in at security, and utilize freight elevators according to building guidelines.'
      },
      {
        q: 'How can I reach the local Miami customer support team?',
        a: 'You can reach our dedicated South Florida dispatch team directly at (305) 851-6959 or book your cleaning instantly online with transparent flat rates.'
      },
      {
        q: 'How much does home cleaning cost in Miami, Florida?',
        a: 'Standard recurring cleaning starts from $180, deep resets start from $250, and move-out turnovers start from $350. Rates are transparent and based on square footage, layout, and property condition.'
      },
      {
        q: 'Do you clean balcony floors and sliding glass doors in Miami condos?',
        a: 'Yes. Balcony glass and exterior sliding tracks frequently accumulate salt fog and urban dust. We clean interior glass, wipe tracks, and sweep balcony tile upon request.'
      },
      {
        q: 'Can I book bi-weekly recurring maid services for my Coral Gables or Pinecrest home?',
        a: 'Yes. Bi-weekly service is our most popular recurring plan across Miami-Dade single-family homes, offering consistent cleanliness and scheduled visits that fit your family routine.'
      }
    ]
  },

  'lakewood-ranch-fl': {
    slug: 'lakewood-ranch-fl',
    name: 'Lakewood Ranch',
    county: 'Manatee / Sarasota County',
    region: 'Manatee County (Bradenton Base)',
    phone: '(941) 222-2080',
    title: 'Cleaning Services in Lakewood Ranch, FL | Sweet Maid',
    h1: 'Cleaning Services in Lakewood Ranch, FL',
    metaDescription: 'Reliable cleaning services in Lakewood Ranch, FL. Detailed home upkeep, lanai slider care, high-ceiling dusting, and deep resets. Request a free quote today.',
    heroSub: 'Sweet Maid provides dependable cleaning services in Lakewood Ranch, FL, tailored to active families and country club residences. Enjoy family-owned accountability, honest flat-rate pricing, and thorough care for modern open-concept homes.',
    badge: '📍 Serving Lakewood Ranch Villages & Country Club Enclaves',
    whyChooseTitle: 'Why Lakewood Ranch Residents Choose Sweet Maid',
    whyChoosePoints: [
      {
        title: 'High-Ceiling & Fan Care',
        desc: 'Specialized equipment to safely clean high cathedral fan blades, recessed lighting, and expansive screened lanai sliders.',
        icon: 'fa-arrows-up-to-line'
      },
      {
        title: 'HOA-Compliant & Family-Focused',
        desc: 'Clean, quiet, and respectful visits designed around active family schedules, remote work, and community guidelines.',
        icon: 'fa-shield-heart'
      },
      {
        title: 'Gated Village Access Protocol',
        desc: 'Seamless coordination with community gate transponders, visitor QR codes, or digital lockboxes.',
        icon: 'fa-key'
      },
      {
        title: 'Transparent Pricing Structure',
        desc: 'Clear flat rates based on home square footage with no surprise add-ons or hidden extras.',
        icon: 'fa-handshake'
      }
    ],
    climateTitle: 'Addressing High Ceiling Dust, Lanai Grime & Builder Dust in Lakewood Ranch',
    climateBody: 'Homes in Lakewood Ranch feature open floor plans, cathedral ceilings, modern composite flooring, and extensive outdoor living spaces. Continuous ceiling fan operation in high-ceiling living rooms causes black grease-dust ribbons to form on blade edges, while outdoor summer kitchens gather pollen and grease. In newer villages like Waterside and Lorraine Lakes, lingering construction dust requires deep HEPA filtration. Our crews use extendable microfiber dusting sleeves, neutral stone washes, and thorough lint-free wiping.',
    neighborhoodsTitle: 'Serving All Villages Across Lakewood Ranch, FL',
    neighborhoodsBody: 'Our cleaning crews operate daily throughout Lakewood Ranch Country Club, Waterside, Greenbrook, Central Park, Esplanade, Country Club East, Bridgewater, Riverwalk, and Lorraine Lakes.',
    neighborhoodsList: [
      'Country Club', 'Waterside', 'Greenbrook', 'Central Park',
      'Esplanade', 'Country Club East', 'Bridgewater', 'Riverwalk', 'Lorraine Lakes'
    ],
    zipCodes: ['34202'],
    faqs: [
      {
        q: 'How does your team handle gate security in Lakewood Ranch villages?',
        a: 'You can register Sweet Maid with your village guardhouse (such as Country Club or Esplanade) or provide a visitor gate code. Our teams arrive in uniform at your scheduled appointment time.'
      },
      {
        q: 'Can you clean high ceiling fans and tall architectural ledges in Lakewood Ranch homes?',
        a: 'Yes. We use extendable microfiber dusting systems that capture dust from high ceiling fans and ledges without scattering particles across your living room furniture below.'
      },
      {
        q: 'What are the cleaning prices for homes in Lakewood Ranch?',
        a: 'House cleaning in Lakewood Ranch starts from $180 for recurring maintenance, $250 for deep seasonal resets, and $350 for move-in/move-out cleanings, with clear flat-rate pricing based on square footage.'
      },
      {
        q: 'Are your cleaning products safe for children and household pets?',
        a: 'Absolutely. We prioritize eco-conscious, biodegradable cleaning solutions and color-coded microfiber towels that sanitize surfaces without leaving harsh chemical fumes.'
      },
      {
        q: 'Do you offer recurring housekeeping around busy school and sports schedules?',
        a: 'Yes. We offer predictable recurring appointments on weekly, bi-weekly, or monthly intervals so your home stays immaculate without interrupting your family\'s routine.'
      }
    ]
  },

  'key-largo-fl': {
    slug: 'key-largo-fl',
    name: 'Key Largo',
    county: 'Monroe County',
    region: 'Florida Keys & Monroe County',
    phone: '(941) 222-2080',
    title: 'Cleaning Services in Key Largo, FL | Sweet Maid',
    h1: 'Cleaning Services in Key Largo, FL',
    metaDescription: 'Specialized cleaning services in Key Largo, FL. Canal home care, vacation rental turnovers, marine salt mist wiping, and deep cleans. Get a free quote today.',
    heroSub: 'Sweet Maid provides specialized cleaning services in Key Largo, FL, caring for canal-front stilt homes, oceanfront retreats, and vacation rentals. Experience reliable island scheduling, honest flat-rate pricing, and family-owned dedication.',
    badge: '📍 Serving Key Largo & Upper Keys Island Communities',
    whyChooseTitle: 'Why Key Largo Residents Choose Sweet Maid',
    whyChoosePoints: [
      {
        title: 'Marine Salt Mist Defense',
        desc: 'Specialized care targeting aggressive marine salt mist, coral dust, and moisture on coastal finishes.',
        icon: 'fa-anchor'
      },
      {
        title: 'Vacation Rental Expertise',
        desc: 'Rapid, spotless changeovers with meticulous towel staging, amenity restocking, and linen turnover protocols.',
        icon: 'fa-suitcase-rolling'
      },
      {
        title: 'Canal-Front Living Care',
        desc: 'Effective extraction of tracked-in dock grime, sandy footwear grit, and damp tackle-room residues.',
        icon: 'fa-ship'
      },
      {
        title: 'Honest Island Flat Rates',
        desc: 'Reliable island pricing with zero hidden ferry or long-distance travel markups.',
        icon: 'fa-calculator'
      }
    ],
    climateTitle: 'Defending Upper Keys Properties Against Marine Salt Corrosion & Coral Dust',
    climateBody: 'Surrounded by Florida Bay and the Atlantic Ocean, Key Largo homes face one of the most demanding coastal environments in the country. Salt spray bakes onto sliding glass doors, corroding aluminum frames and clouding views. Ground-level storage rooms and canal-side lanais face intense tropical humidity, while tracked-in crushed coral rock scratches interior tile and vinyl flooring. Our island cleaning teams use demineralized squeegee washes, silicone-lubricated track care, and multi-stage HEPA vacuums that capture coral silt safely.',
    neighborhoodsTitle: 'Serving Communities Throughout Key Largo, FL',
    neighborhoodsBody: 'Our Keys cleaning crews regularly service properties across Port Largo, Key Largo Ocean Resorts, Cross Key Waterways, Rock Harbor, Key Largo Park, Stillwright Point, and the Upper Keys corridor.',
    neighborhoodsList: [
      'Port Largo', 'Key Largo Ocean Resorts', 'Cross Key Waterways',
      'Rock Harbor', 'Key Largo Park', 'Stillwright Point'
    ],
    zipCodes: ['33037'],
    faqs: [
      {
        q: 'How do you handle vacation rental turnovers and changeovers in Key Largo?',
        a: 'We specialize in same-day turnovers between guest checkout (typically 10 AM) and arrival (4 PM). We sanitize kitchens and bathrooms, launder and stage linens, restock supplies, and log any property damage.'
      },
      {
        q: 'How do you protect exterior glass and sliding door tracks from island salt mist?',
        a: 'We thoroughly vacuum crushed coral dust from sliding door tracks, apply dry silicone lubricant to roller mechanisms, and clean glass surfaces to remove salt film without scratching.'
      },
      {
        q: 'How much does house cleaning cost in Key Largo, Florida?',
        a: 'Pricing for standard cleaning in Key Largo starts from $180, comprehensive deep cleanings start from $250, and vacation rental turnovers start from $250. Estimates are transparent and flat-rate.'
      },
      {
        q: 'Do you service elevated stilt homes and canal-front properties?',
        a: 'Yes. We clean single-family elevated homes, ground-level living quarters, and waterfront estates throughout Key Largo and surrounding waterways.'
      },
      {
        q: 'Do I need to be present during the cleaning in Key Largo?',
        a: 'No. Many Key Largo property owners are out on the water or manage properties remotely. We coordinate access through lockboxes, smart keypad locks, or local property managers.'
      }
    ]
  }
};
