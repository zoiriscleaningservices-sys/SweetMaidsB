(function () {
    // Full city coordinate database — all location pages on the site
    const CITY_COORDS = {
      "anna-maria-fl": { "name": "Anna Maria", "lat": 27.5300, "lng": -82.7329 },
      "apollo-beach-fl": { "name": "Apollo Beach", "lat": 27.7731, "lng": -82.4019 },
      "aventura-fl": { "name": "Aventura", "lat": 25.9565, "lng": -80.1392 },
      "bal-harbour-fl": { "name": "Bal Harbour", "lat": 25.8993, "lng": -80.1268 },
      "belleair-beach-fl": { "name": "Belleair Beach", "lat": 27.9331, "lng": -82.8427 },
      "big-pine-key-fl": { "name": "Big Pine Key", "lat": 24.6677, "lng": -81.3562 },
      "bird-key-fl": { "name": "Bird Key", "lat": 27.3283, "lng": -82.5779 },
      "biscayne-park-fl": { "name": "Biscayne Park", "lat": 25.8738, "lng": -80.1753 },
      "boca-raton-fl": { "name": "Boca Raton", "lat": 26.3683, "lng": -80.1289 },
      "bonita-springs-fl": { "name": "Bonita Springs", "lat": 26.3398, "lng": -81.7787 },
      "boynton-beach-fl": { "name": "Boynton Beach", "lat": 26.5352, "lng": -80.0906 },
      "bradenton-fl": { "name": "Bradenton", "lat": 27.4989, "lng": -82.5748 },
      "brandon-fl": { "name": "Brandon", "lat": 27.9378, "lng": -82.2859 },
      "brickell-fl": { "name": "Brickell", "lat": 25.7617, "lng": -80.1918 },
      "cape-coral-fl": { "name": "Cape Coral", "lat": 26.5629, "lng": -81.9495 },
      "carrollwood-fl": { "name": "Carrollwood", "lat": 28.0570, "lng": -82.5145 },
      "cheval-fl": { "name": "Cheval", "lat": 28.1453, "lng": -82.5104 },
      "clearwater-fl": { "name": "Clearwater", "lat": 27.9659, "lng": -82.8001 },
      "coconut-creek-fl": { "name": "Coconut Creek", "lat": 26.2517, "lng": -80.1787 },
      "coconut-grove-fl": { "name": "Coconut Grove", "lat": 25.7272, "lng": -80.2380 },
      "coral-gables-fl": { "name": "Coral Gables", "lat": 25.7215, "lng": -80.2684 },
      "coral-ridge-fl": { "name": "Coral Ridge", "lat": 26.1484, "lng": -80.1081 },
      "coral-springs-fl": { "name": "Coral Springs", "lat": 26.2706, "lng": -80.2706 },
      "crystal-lake-fl": { "name": "Crystal Lake", "lat": 27.9659, "lng": -82.5301 },
      "dania-fl": { "name": "Dania", "lat": 26.0523, "lng": -80.1440 },
      "davis-islands-fl": { "name": "Davis Islands", "lat": 27.9180, "lng": -82.4528 },
      "delray-beach-fl": { "name": "Delray Beach", "lat": 26.4615, "lng": -80.0728 },
      "duck-key-fl": { "name": "Duck Key", "lat": 24.7773, "lng": -80.9106 },
      "east-tampa-fl": { "name": "East Tampa", "lat": 27.9597, "lng": -82.4096 },
      "ellenton-fl": { "name": "Ellenton", "lat": 27.5264, "lng": -82.5262 },
      "englewood-fl": { "name": "Englewood", "lat": 26.9626, "lng": -82.3549 },
      "estero-fl": { "name": "Estero", "lat": 26.4384, "lng": -81.8068 },
      "fort-lauderdale-fl": { "name": "Fort Lauderdale", "lat": 26.1224, "lng": -80.1373 },
      "fort-myers-fl": { "name": "Fort Myers", "lat": 26.6406, "lng": -81.8723 },
      "gibsonton-fl": { "name": "Gibsonton", "lat": 27.8378, "lng": -82.3744 },
      "golden-beach-fl": { "name": "Golden Beach", "lat": 25.9707, "lng": -80.1215 },
      "greenacres-fl": { "name": "Greenacres", "lat": 26.6262, "lng": -80.1337 },
      "hallandale-fl": { "name": "Hallandale", "lat": 25.9812, "lng": -80.1483 },
      "hialeah-fl": { "name": "Hialeah", "lat": 25.8576, "lng": -80.2781 },
      "hollywood-fl": { "name": "Hollywood", "lat": 26.0112, "lng": -80.1495 },
      "homestead-fl": { "name": "Homestead", "lat": 25.4687, "lng": -80.4776 },
      "hyde-park-fl": { "name": "Hyde Park", "lat": 27.9389, "lng": -82.4697 },
      "indian-rocks-beach-fl": { "name": "Indian Rocks Beach", "lat": 27.8884, "lng": -82.8471 },
      "islamorada-fl": { "name": "Islamorada", "lat": 24.9251, "lng": -80.6473 },
      "key-biscayne-fl": { "name": "Key Biscayne", "lat": 25.6908, "lng": -80.1623 },
      "key-largo-fl": { "name": "Key Largo", "lat": 25.0866, "lng": -80.4473 },
      "keystone-fl": { "name": "Keystone", "lat": 28.1278, "lng": -82.6049 },
      "lake-park-fl": { "name": "Lake Park", "lat": 26.8000, "lng": -80.0651 },
      "lake-worth-fl": { "name": "Lake Worth", "lat": 26.6195, "lng": -80.0589 },
      "lakeland-fl": { "name": "Lakeland", "lat": 28.0395, "lng": -81.9498 },
      "lakewood-ranch-fl": { "name": "Lakewood Ranch", "lat": 27.4260, "lng": -82.4137 },
      "land-o-lakes-fl": { "name": "Land O Lakes", "lat": 28.2122, "lng": -82.4596 },
      "largo-fl": { "name": "Largo", "lat": 27.9095, "lng": -82.7873 },
      "laurel-fl": { "name": "Laurel", "lat": 27.1456, "lng": -82.4621 },
      "lehigh-acres-fl": { "name": "Lehigh Acres", "lat": 26.6109, "lng": -81.7476 },
      "lido-key-fl": { "name": "Lido Key", "lat": 27.3199, "lng": -82.5599 },
      "longboat-key-fl": { "name": "Longboat Key", "lat": 27.3977, "lng": -82.6269 },
      "lutz-fl": { "name": "Lutz", "lat": 28.1553, "lng": -82.4596 },
      "marco-island-fl": { "name": "Marco Island", "lat": 25.9413, "lng": -81.7182 },
      "miami-beach-fl": { "name": "Miami Beach", "lat": 25.7907, "lng": -80.1300 },
      "miami-fl": { "name": "Miami", "lat": 25.7617, "lng": -80.1918 },
      "miami-shores-fl": { "name": "Miami Shores", "lat": 25.8643, "lng": -80.1873 },
      "miramar-fl": { "name": "Miramar", "lat": 25.9871, "lng": -80.2328 },
      "myakka-city-fl": { "name": "Myakka City", "lat": 27.3798, "lng": -82.1876 },
      "naples-fl": { "name": "Naples", "lat": 26.1420, "lng": -81.7948 },
      "nokomis-fl": { "name": "Nokomis", "lat": 27.1173, "lng": -82.4326 },
      "north-palm-beach-fl": { "name": "North Palm Beach", "lat": 26.8198, "lng": -80.0534 },
      "north-port-fl": { "name": "North Port", "lat": 27.0442, "lng": -82.2359 },
      "odessa-fl": { "name": "Odessa", "lat": 28.1803, "lng": -82.5832 },
      "osprey-fl": { "name": "Osprey", "lat": 27.1970, "lng": -82.4993 },
      "palm-beach-fl": { "name": "Palm Beach", "lat": 26.7057, "lng": -80.0365 },
      "palm-beach-gardens-fl": { "name": "Palm Beach Gardens", "lat": 26.8234, "lng": -80.1428 },
      "palm-harbor-fl": { "name": "Palm Harbor", "lat": 28.0784, "lng": -82.7618 },
      "palmer-ranch-fl": { "name": "Palmer Ranch", "lat": 27.2337, "lng": -82.4852 },
      "palmetto-bay-fl": { "name": "Palmetto Bay", "lat": 25.6196, "lng": -80.3260 },
      "palmetto-fl": { "name": "Palmetto", "lat": 27.5239, "lng": -82.5768 },
      "parrish-fl": { "name": "Parrish", "lat": 27.5845, "lng": -82.4360 },
      "pelican-bay-fl": { "name": "Pelican Bay", "lat": 26.2197, "lng": -81.8046 },
      "pembroke-pines-fl": { "name": "Pembroke Pines", "lat": 26.0070, "lng": -80.2962 },
      "pinecrest-fl": { "name": "Pinecrest", "lat": 25.6649, "lng": -80.3029 },
      "plantation-fl": { "name": "Plantation", "lat": 26.1276, "lng": -80.2331 },
      "pompano-beach-fl": { "name": "Pompano Beach", "lat": 26.2379, "lng": -80.1248 },
      "port-charlotte-fl": { "name": "Port Charlotte", "lat": 26.9787, "lng": -82.0906 },
      "port-richey-fl": { "name": "Port Richey", "lat": 28.2714, "lng": -82.7193 },
      "punta-gorda-fl": { "name": "Punta Gorda", "lat": 26.9276, "lng": -82.0454 },
      "riverview-fl": { "name": "Riverview", "lat": 27.8656, "lng": -82.3287 },
      "riviera-beach-fl": { "name": "Riviera Beach", "lat": 26.7751, "lng": -80.0584 },
      "ruskin-fl": { "name": "Ruskin", "lat": 27.7220, "lng": -82.4335 },
      "safety-harbor-fl": { "name": "Safety Harbor", "lat": 27.9908, "lng": -82.6929 },
      "saint-petersburg-fl": { "name": "St. Petersburg", "lat": 27.7731, "lng": -82.6397 },
      "sarasota-fl": { "name": "Sarasota", "lat": 27.3364, "lng": -82.5307 },
      "seminole-fl": { "name": "Seminole", "lat": 27.8395, "lng": -82.7787 },
      "siesta-key-fl": { "name": "Siesta Key", "lat": 27.2660, "lng": -82.5465 },
      "south-venice-fl": { "name": "South Venice", "lat": 27.0620, "lng": -82.4259 },
      "sun-city-center-fl": { "name": "Sun City Center", "lat": 27.7178, "lng": -82.3576 },
      "sunny-isles-beach-fl": { "name": "Sunny Isles Beach", "lat": 25.9382, "lng": -80.1226 },
      "surfside-fl": { "name": "Surfside", "lat": 25.8732, "lng": -80.1237 },
      "tampa-fl": { "name": "Tampa", "lat": 27.9506, "lng": -82.4572 },
      "tampa-palms-fl": { "name": "Tampa Palms", "lat": 28.1011, "lng": -82.3895 },
      "tarpon-springs-fl": { "name": "Tarpon Springs", "lat": 28.1456, "lng": -82.7565 },
      "tavernier-fl": { "name": "Tavernier", "lat": 25.0101, "lng": -80.5156 },
      "temple-terrace-fl": { "name": "Temple Terrace", "lat": 28.0345, "lng": -82.3830 },
      "treasure-island-fl": { "name": "Treasure Island", "lat": 27.7700, "lng": -82.7698 },
      "university-park-fl": { "name": "University Park", "lat": 27.3912, "lng": -82.4868 },
      "vamo-fl": { "name": "Vamo", "lat": 27.2393, "lng": -82.5046 },
      "venice-fl": { "name": "Venice", "lat": 27.0998, "lng": -82.4543 },
      "wellington-fl": { "name": "Wellington", "lat": 26.6590, "lng": -80.2684 },
      "west-palm-beach-fl": { "name": "West Palm Beach", "lat": 26.7153, "lng": -80.0534 },
      "westchase-fl": { "name": "Westchase", "lat": 28.0648, "lng": -82.5968 },
      "winter-haven-fl": { "name": "Winter Haven", "lat": 28.0220, "lng": -81.7329 },
      "wynwood-fl": { "name": "Wynwood", "lat": 25.7998, "lng": -80.1996 }
    };

    // Haversine formula — returns distance in miles between two lat/lng points
    function haversine(lat1, lng1, lat2, lng2) {
        const R = 3958.8;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    // Returns the N nearest cities to the given slug, excluding itself
    function getNearestCities(slug, count) {
        count = count || 8;
        var current = CITY_COORDS[slug];
        if (!current) {
            // Fallback: just return a regional default if slug is unknown
            return [
                { slug: 'bradenton-fl', name: 'Bradenton' },
                { slug: 'sarasota-fl', name: 'Sarasota' },
                { slug: 'tampa-fl', name: 'Tampa' },
                { slug: 'naples-fl', name: 'Naples' },
                { slug: 'miami-fl', name: 'Miami' }
            ];
        }
        var distances = [];
        Object.keys(CITY_COORDS).forEach(function (otherSlug) {
            if (otherSlug === slug) return;
            var city = CITY_COORDS[otherSlug];
            var dist = haversine(current.lat, current.lng, city.lat, city.lng);
            distances.push({ slug: otherSlug, name: city.name, dist: dist });
        });
        distances.sort(function (a, b) { return a.dist - b.dist; });
        return distances.slice(0, count);
    }

    function getContext() {
        var pathParts = window.location.pathname.split('/').filter(function (p) { return p; });
        if (pathParts.length === 0) {
            var saved = sessionStorage.getItem('sweetmaid_locationContext');
            return saved || 'bradenton-fl';
        }
        var firstPart = pathParts[0];
        if (firstPart.indexOf('-fl') !== -1) {
            sessionStorage.setItem('sweetmaid_locationContext', firstPart);
            return firstPart;
        }
        var saved = sessionStorage.getItem('sweetmaid_locationContext');
        return saved || 'bradenton-fl';
    }

    /**
     * Rewrites service/page links to stay inside the current location hub
     */
    function updateNavLinks(locationSlug) {
        if (!locationSlug) return;

        var allLinks = document.querySelectorAll('a');

        var SERVICES_AND_PAGES = [
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

        allLinks.forEach(function (link) {
            var href = link.getAttribute('href');
            if (!href) return;

            if (href.startsWith('http://sweetmaidcleaning.com') ||
                href.startsWith('https://sweetmaidcleaning.com') ||
                href.startsWith('http://www.sweetmaidcleaning.com') ||
                href.startsWith('https://www.sweetmaidcleaning.com')) {
                href = href.replace(/^https?:\/\/(www\.)?sweetmaidcleaning\.com/, '');
                if (href === '') href = '/';
            }

            if (href.startsWith('http') || href.startsWith('#') ||
                href.startsWith('tel:') || href.startsWith('mailto:') ||
                href.startsWith('javascript:')) return;

            var cleanHref = href.startsWith('/') ? href : '/' + href;

            if (cleanHref.includes('sitemap') || cleanHref.includes('robots') ||
                cleanHref.match(/\.(png|jpg|jpeg|gif|svg|webp|css|js|pdf)$/i)) return;

            var linkText = (link.textContent || '').trim().toLowerCase();
            if (cleanHref === '/' || cleanHref === '/index.html' ||
                cleanHref === '/home/' || linkText === 'home') {
                if (cleanHref !== '/' + locationSlug + '/') {
                    link.setAttribute('href', '/' + locationSlug + '/');
                }
                return;
            }

            for (var i = 0; i < SERVICES_AND_PAGES.length; i++) {
                var page = SERVICES_AND_PAGES[i];
                if (cleanHref === page || cleanHref === page.slice(0, -1)) {
                    link.setAttribute('href', '/' + locationSlug + page);
                    return;
                }
            }
        });
    }

    function populateLocationsDropdown(locationSlug) {
        if (!locationSlug) locationSlug = 'bradenton-fl';
        var desktopList = document.getElementById('nearby-locations-list');
        var mobileList = document.getElementById('mobile-nearby-list');

        if (!desktopList && !mobileList) return;

        // If already server-rendered with valid links, keep the server-rendered links
        if (desktopList && desktopList.querySelectorAll('a').length > 0) {
            return;
        }

        var nearest = getNearestCities(locationSlug, 8);

        if (desktopList) {
            desktopList.innerHTML = nearest.map(function (city) {
                return '<a href="/' + city.slug + '/" class="block px-3 py-2 rounded-xl hover:bg-pink-50 text-gray-700 hover:text-pink-400 font-medium text-sm transition-all flex items-center justify-between group">' +
                    city.name +
                    '<i class="fa-solid fa-chevron-right text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"></i>' +
                    '</a>';
            }).join('');
        }

        if (mobileList) {
            mobileList.innerHTML = nearest.map(function (city) {
                return '<a href="/' + city.slug + '/" class="flex items-center gap-3 p-3 rounded-xl hover:bg-white text-gray-700 font-medium transition-all">' +
                    '<i class="fa-solid fa-location-dot text-pink-300 w-5"></i> ' + city.name +
                    '</a>';
            }).join('');
        }
    }

    function init() {
        var location = getContext();
        if (location) {
            updateNavLinks(location);
        }
        populateLocationsDropdown(location);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
