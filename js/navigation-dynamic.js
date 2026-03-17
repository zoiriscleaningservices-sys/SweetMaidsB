(function () {
    // Top-tier location clusters for "Geographically Relevant" suggestions
    const CLUSTERS = {
        'sarasota-bradenton': [
            { name: 'Bradenton', slug: 'bradenton-fl' },
            { name: 'Sarasota', slug: 'sarasota-fl' },
            { name: 'Lakewood Ranch', slug: 'lakewood-ranch-fl' },
            { name: 'Venice', slug: 'venice-fl' },
            { name: 'Palmetto', slug: 'palmetto-fl' },
            { name: 'Parrish', slug: 'parrish-fl' },
            { name: 'Anna Maria', slug: 'anna-maria-fl' }
        ],
        'tampa-bay': [
            { name: 'Tampa', slug: 'tampa-fl' },
            { name: 'St. Petersburg', slug: 'saint-petersburg-fl' },
            { name: 'Clearwater', slug: 'clearwater-fl' },
            { name: 'Brandon', slug: 'brandon-fl' },
            { name: 'Riverview', slug: 'riverview-fl' },
            { name: 'Lutz', slug: 'lutz-fl' },
            { name: 'Palm Harbor', slug: 'palm-harbor-fl' }
        ],
        'south-florida': [
            { name: 'Miami', slug: 'miami-fl' },
            { name: 'Fort Lauderdale', slug: 'fort-lauderdale-fl' },
            { name: 'Boca Raton', slug: 'boca-raton-fl' },
            { name: 'West Palm Beach', slug: 'west-palm-beach-fl' },
            { name: 'Hollywood', slug: 'hollywood-fl' },
            { name: 'Pompano Beach', slug: 'pompano-beach-fl' },
            { name: 'Miami Beach', slug: 'miami-beach-fl' }
        ],
        'central-florida': [
            { name: 'Orlando', slug: 'orlando-fl' },
            { name: 'Winter Park', slug: 'winter-park-fl' },
            { name: 'Kissimmee', slug: 'kissimmee-fl' },
            { name: 'Sanford', slug: 'sanford-fl' },
            { name: 'Clermont', slug: 'clermont-fl' },
            { name: 'Apopka', slug: 'apopka-fl' },
            { name: 'Winter Garden', slug: 'winter-garden-fl' }
        ],
        'first-coast': [
            { name: 'Jacksonville', slug: 'jacksonville-fl' },
            { name: 'St. Augustine', slug: 'saint-augustine-fl' },
            { name: 'Orange Park', slug: 'orange-park-fl' },
            { name: 'Jacksonville Beach', slug: 'jacksonville-beach-fl' },
            { name: 'Ponte Vedra', slug: 'ponte-vedra-beach-fl' }
        ],
        'southwest-florida': [
            { name: 'Fort Myers', slug: 'fort-myers-fl' },
            { name: 'Naples', slug: 'naples-fl' },
            { name: 'Cape Coral', slug: 'cape-coral-fl' },
            { name: 'Bonita Springs', slug: 'bonita-springs-fl' },
            { name: 'Estero', slug: 'estero-fl' },
            { name: 'Marco Island', slug: 'marco-island-fl' }
        ]
    };

    function getClusterForSlug(slug) {
        for (const key in CLUSTERS) {
            if (CLUSTERS[key].some(city => city.slug === slug)) {
                return CLUSTERS[key];
            }
        }
        return [
            { name: 'Bradenton', slug: 'bradenton-fl' },
            { name: 'Tampa', slug: 'tampa-fl' },
            { name: 'Miami', slug: 'miami-fl' },
            { name: 'Orlando', slug: 'orlando-fl' },
            { name: 'Jacksonville', slug: 'jacksonville-fl' }
        ];
    }

    function getContext() {
        const pathParts = window.location.pathname.split('/').filter(p => p);
        if (pathParts.length === 0) {
            // Homepage: If they hit from another city, restore it. Otherwise fallback to bradenton-fl.
            let saved = sessionStorage.getItem('sweetmaid_locationContext');
            return saved || 'bradenton-fl';
        }

        const firstPart = pathParts[0];

        // Is it a location hub (e.g. miami-fl)?
        if (firstPart.includes('-fl')) {
            sessionStorage.setItem('sweetmaid_locationContext', firstPart);
            return firstPart;
        }

        // Otherwise (it's a global root service or global page like /about/ or /house-cleaning/)
        let saved = sessionStorage.getItem('sweetmaid_locationContext');
        return saved || 'bradenton-fl';
    }

    /**
     * rewrites ALL links to ensure they stay within the current location hub
     */
    function updateNavLinks(locationSlug) {
        if (!locationSlug) return;

        const allLinks = document.querySelectorAll('a');

        // List of pages/patterns that we should ALWAYS prepend with the location slug
        // if they are linked as global URLs.
        const SERVICES_AND_PAGES = [
            '/house-cleaning/', '/deep-cleaning/', '/move-in-out-cleaning/', '/airbnb-cleaning/',
            '/commercial-cleaning/', '/post-construction-cleaning/', '/carpet-cleaning/',
            '/pressure-washing/', '/window-cleaning/', '/home-watch-services/',
            '/office-janitorial-services/', '/janitorial-cleaning-services/',
            '/medical-dental-facility-cleaning/', '/industrial-warehouse-cleaning/',
            '/floor-stripping-waxing/', '/gym-fitness-center-cleaning/',
            '/school-daycare-cleaning/', '/church-worship-center-cleaning/',
            '/property-management-janitorial/', '/luxury-estate-cleaning/',
            '/solar-panel-cleaning/', '/gutter-cleaning/', '/property-maintenance/',
            '/airbnb-vacation-rental-management/', '/luxury-estate-management/',
            '/about/', '/gallery/', '/blog/'
        ];

        allLinks.forEach(link => {
            let href = link.getAttribute('href');
            if (!href) return;

            // Convert internal absolute URLs to relative so they can be securely processed
            if (href.startsWith('http://sweetmaidcleaning.com') ||
                href.startsWith('https://sweetmaidcleaning.com') ||
                href.startsWith('http://www.sweetmaidcleaning.com') ||
                href.startsWith('https://www.sweetmaidcleaning.com')) {
                href = href.replace(/^https?:\/\/(www\.)?sweetmaidcleaning\.com/, '');
                if (href === '') href = '/';
            }

            if (href.startsWith('http') ||
                href.startsWith('#') ||
                href.startsWith('tel:') ||
                href.startsWith('mailto:') ||
                href.startsWith('javascript:')) return;

            // Normalize
            let cleanHref = href.startsWith('/') ? href : '/' + href;

            // Skip sitemaps, system files, or assets
            if (cleanHref.includes('sitemap') || cleanHref.includes('robots') || cleanHref.match(/\.(png|jpg|jpeg|gif|svg|webp|css|js|pdf)$/i)) return;

            // 1. Special case for root logo or explicit Home link navigating to Global root.
            const linkText = (link.textContent || '').trim().toLowerCase();
            if (cleanHref === '/' || cleanHref === '/index.html' || cleanHref === '/home/' || linkText === 'home') {
                if (cleanHref !== `/${locationSlug}/`) {
                    link.setAttribute('href', `/${locationSlug}/`);
                }
                return;
            }

            // 2. If the link is a base root service without a location, inject the hub.
            for (let page of SERVICES_AND_PAGES) {
                // We check if it matches EXACTLY the root version to avoid double prepending `/miami-fl/miami-fl/about/`
                if (cleanHref === page || cleanHref === page.slice(0, -1)) {
                    link.setAttribute('href', `/${locationSlug}${page}`);
                    return;
                }
            }
        });
    }

    function populateLocationsDropdown(locationSlug) {
        if (!locationSlug) locationSlug = 'bradenton-fl';
        const desktopList = document.getElementById('nearby-locations-list');
        const mobileList = document.getElementById('mobile-nearby-list');

        if (!desktopList && !mobileList) return;

        const cluster = getClusterForSlug(locationSlug);
        const suggestions = cluster.filter(city => city.slug !== locationSlug).slice(0, 8);

        const generateHtml = (city) => `
            <a href="/${city.slug}/" class="block px-3 py-2 rounded-xl hover:bg-pink-50 text-gray-700 hover:text-pink-400 font-medium text-sm transition-all flex items-center justify-between group">
                ${city.name}
                <i class="fa-solid fa-chevron-right text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"></i>
            </a>
        `;

        if (desktopList) {
            desktopList.innerHTML = suggestions.map(generateHtml).join('');
        }

        if (mobileList) {
            mobileList.innerHTML = suggestions.map(city => `
                <a href="/${city.slug}/" class="flex items-center gap-3 p-3 rounded-xl hover:bg-white text-gray-700 font-medium transition-all">
                    <i class="fa-solid fa-location-dot text-pink-300 w-5"></i> ${city.name}
                </a>
            `).join('');
        }
    }

    function init() {
        const location = getContext();
        if (location) {
            updateNavLinks(location);
            console.log("Isolated Hub active for:", location);
        }
        populateLocationsDropdown(location);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
