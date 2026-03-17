import os
import json
import math
import re
import collections
import random
from ast import literal_eval

# Configuration
TEST_CITIES = ["Bradenton", "Sarasota", "Venice", "Tampa", "Miami"]
USE_TEST_MODE = False
ROOT_DIR = r"c:\Users\lucia\OneDrive\Desktop\SweetMaidsB"

# Dummy matrix of coordinates
GEO_MAP = {
    "Bradenton": {"lat": 27.4989, "lon": -82.5748},
    "Sarasota": {"lat": 27.3364, "lon": -82.5307},
    "Venice": {"lat": 27.0998, "lon": -82.4543},
    "Tampa": {"lat": 27.9506, "lon": -82.4572},
    "Miami": {"lat": 25.7617, "lon": -80.1918}
}

PAGES = ["index.html", "about/index.html", "blog/index.html", "gallery/index.html", "services/index.html", "areas-nearby/index.html"]

SERVICES_MAP = {
    "house-cleaning": "HouseCleaning",
    "deep-cleaning": "HouseCleaning",
    "move-in-out-cleaning": "HouseCleaning",
    "airbnb-cleaning": "HouseCleaning",
    "commercial-cleaning": "CommercialCleaning",
    "post-construction-cleaning": "CommercialCleaning",
    "carpet-cleaning": "CarpetCleaning",
    "pressure-washing": "PressureWashing",
    "window-cleaning": "WindowCleaning",
    "home-watch-services": "LocalBusiness",
    "office-janitorial-services": "CommercialCleaning",
    "janitorial-cleaning-services": "CommercialCleaning",
    "medical-dental-facility-cleaning": "CommercialCleaning",
    "industrial-warehouse-cleaning": "CommercialCleaning",
    "floor-stripping-waxing": "CommercialCleaning",
    "gym-fitness-center-cleaning": "CommercialCleaning",
    "school-daycare-cleaning": "CommercialCleaning",
    "church-worship-center-cleaning": "CommercialCleaning",
    "property-management-janitorial": "CommercialCleaning",
    "luxury-estate-cleaning": "HouseCleaning",
    "solar-panel-cleaning": "LocalBusiness",
    "gutter-cleaning": "LocalBusiness",
    "property-maintenance": "LocalBusiness",
    "airbnb-vacation-rental-management": "LocalBusiness",
    "luxury-estate-management": "LocalBusiness"
}

def load_cities():
    if USE_TEST_MODE:
        return TEST_CITIES
    
    # In full mode, we would load from json
    try:
        with open(os.path.join(ROOT_DIR, "florida_all_cities.json"), 'r', encoding='utf-8') as f:
            return json.load(f)
    except:
        return TEST_CITIES

def haversine(lat1, lon1, lat2, lon2):
    R = 6371 # km
    dLat = math.radians(lat2 - lat1)
    dLon = math.radians(lon2 - lon1)
    lat1 = math.radians(lat1)
    lat2 = math.radians(lat2)

    a = math.sin(dLat/2) * math.sin(dLat/2) + \
        math.sin(dLon/2) * math.sin(dLon/2) * math.cos(lat1) * math.cos(lat2) 
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a)) 
    return R * c

def get_closest_cities(target_city, all_cities, count=10):
    if target_city not in GEO_MAP:
        # Fallback if coordinates missing
        available = [c for c in all_cities if c != target_city]
        return random.sample(available, min(count, len(available)))
        
    target_geo = GEO_MAP[target_city]
    
    distances = []
    for city in all_cities:
        if city == target_city or city not in GEO_MAP:
            continue
        dist = haversine(target_geo['lat'], target_geo['lon'], GEO_MAP[city]['lat'], GEO_MAP[city]['lon'])
        distances.append((city, dist))
        
    distances.sort(key=lambda x: x[1])
    return [c[0] for c in distances[:count]]

def localize_html(html, city_name, slug_name, is_root=False):
    # 1. Silo Links (Update navigation to stay within Hub)
    # We replace global links like `href="/about/"` to `href="/{slug_name}/about/"`
    
    # General navigation parsing
    # First, let's fix absolute roots
    html = re.sub(r'href="/"', f'href="https://sweetmaidcleaning.com/{slug_name}/"', html)
    html = re.sub(r'href="/about/"', f'href="https://sweetmaidcleaning.com/{slug_name}/about/"', html)
    html = re.sub(r'href="/blog/"', f'href="https://sweetmaidcleaning.com/{slug_name}/blog/"', html)
    html = re.sub(r'href="/gallery/"', f'href="https://sweetmaidcleaning.com/{slug_name}/gallery/"', html)
    
    # Fix service links inside dropdowns
    for svc in SERVICES_MAP.keys():
        html = re.sub(rf'href="/{svc}/"', f'href="https://sweetmaidcleaning.com/{slug_name}/{svc}/"', html)
        
    # 2. Text Replacements
    html = re.sub(r'Bradenton’s', f"{city_name}'s", html, flags=re.IGNORECASE)
    html = re.sub(r'Bradenton\'s', f"{city_name}'s", html, flags=re.IGNORECASE)
    html = re.sub(r'Bradenton(\s+and\s+Southwest\s+Florida)?', f'{city_name}', html, flags=re.IGNORECASE)
    
    # 3. SEO Meta Data Generation
    page_title_mapping = {
        "home": f"Best Cleaning Service in {city_name}, FL | {city_name} Cleaners",
        "about": f"About Our {city_name} Cleaning Company | Top Rated Cleaners",
        "blog": f"Cleaning Tips & Tricks | {city_name} Maid Service Blog",
        "gallery": f"Cleaning Before & After Gallery | {city_name}, FL",
        "services": f"Expert Cleaning Services in {city_name}, FL | Sweet Maid",
        "areas-nearby": f"Areas We Serve Near {city_name}, FL | Local Cleaning"
    }
    
    html = re.sub(r'<title>.*?</title>', f'<title>{page_title_mapping.get("home", f"{city_name} Cleaning Service")}</title>', html, count=1, flags=re.IGNORECASE|re.DOTALL)
    
    return html

def inject_nearby_cities(html, slug_name, closest_cities):
    # The template has:
    # <div id="nearby-locations-list" class="space-y-1">
    #   <div class="px-3 py-2 text-gray-400 text-xs italic">Detecting your location...</div>
    # </div>
    # We replace this block with static links generated on the fly.
    
    links_html = "\n".join([f'<a href="https://sweetmaidcleaning.com/{city.lower().replace(" ", "-")}-fl/" class="block px-3 py-2 rounded-xl hover:bg-pink-50 text-gray-700 hover:text-pink-400 font-medium text-sm transition">{city}</a>' for city in closest_cities])
    
    pattern = r'(<div id="(?:mobile-)?nearby-locations-list"[^>]*>).*?(</div>)'
    html = re.sub(pattern, rf'\g<1>\n{links_html}\n\g<2>', html, flags=re.IGNORECASE|re.DOTALL)
    return html

def build_hub(city, all_cities):
    slug = f"{city.lower().replace(' ', '-')}-fl"
    dest_dir = os.path.join(ROOT_DIR, slug)
    
    # Create directories
    os.makedirs(dest_dir, exist_ok=True)
    os.makedirs(os.path.join(dest_dir, "about"), exist_ok=True)
    os.makedirs(os.path.join(dest_dir, "blog"), exist_ok=True)
    os.makedirs(os.path.join(dest_dir, "gallery"), exist_ok=True)
    os.makedirs(os.path.join(dest_dir, "services"), exist_ok=True)
    os.makedirs(os.path.join(dest_dir, "areas-nearby"), exist_ok=True)
    
    closest_cities = get_closest_cities(city, all_cities, 10)
    
    for page in PAGES:
        # Template Path logic
        if page == "index.html":
            src = os.path.join(ROOT_DIR, "templates", "home", "index.html")
            is_root = True
        else:
            src = os.path.join(ROOT_DIR, "templates", page)
            is_root = False
            
        with open(src, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Customize Hero for duplicated pages
        if page == "services/index.html":
            content = re.sub(r'Our Story of Sparkle', f'{city} Cleaning Services Overview', content)
            content = re.sub(r'Trusted by 1000\+ Families.*?</p>', f'Professional, fully-vetted cleaners serving the {city} area.</p>', content, flags=re.DOTALL)
            content = re.sub(r'<span class="text-pink-300.*?Who We Are</span>', '<span class="text-pink-300 font-bold tracking-wide uppercase text-sm">Services</span>', content)
            content = re.sub(r'<h2 class="text-4xl.*?More Than Just a Cleaning Service</h2>', f'<h2 class="text-4xl lg:text-5xl font-bold mt-3 mb-6 font-playfair text-gray-900">Comprehensive Cleaning in {city}</h2>', content)
        elif page == "areas-nearby/index.html":
            content = re.sub(r'Our Story of Sparkle', f'Areas We Serve Near {city}', content)
            content = re.sub(r'Trusted by 1000\+ Families.*?</p>', f'Providing 5-star cleaning to {city} and surrounding neighborhoods.</p>', content, flags=re.DOTALL)
            content = re.sub(r'<span class="text-pink-300.*?Who We Are</span>', '<span class="text-pink-300 font-bold tracking-wide uppercase text-sm">Service Area</span>', content)
            content = re.sub(r'<h2 class="text-4xl.*?More Than Just a Cleaning Service</h2>', f'<h2 class="text-4xl lg:text-5xl font-bold mt-3 mb-6 font-playfair text-gray-900">Neighborhoods Around {city}</h2>', content)

        content = localize_html(content, city, slug, is_root)
        content = inject_nearby_cities(content, slug, closest_cities)
        
        # Write to hub
        dest = os.path.join(dest_dir, page)
        with open(dest, 'w', encoding='utf-8') as f:
            f.write(content)
            
    # Sub-services (hyper-local generation logic)
    for svc in SERVICES_MAP.keys():
        src_svc = os.path.join(ROOT_DIR, "templates", "services_source", svc, "index.html")
        dest_svc_dir = os.path.join(dest_dir, svc)
        os.makedirs(dest_svc_dir, exist_ok=True)
        dest_svc = os.path.join(dest_svc_dir, "index.html")
        
        if os.path.exists(src_svc):
            with open(src_svc, 'r', encoding='utf-8') as f:
                content = f.read()
                
            content = localize_html(content, city, slug, False)
            content = inject_nearby_cities(content, slug, closest_cities)
            
            # Need to adjust Canonical in these specific pages if they had hardcoded ones
            content = re.sub(r'<link rel="canonical" href=".*?">', f'<link rel="canonical" href="https://sweetmaidcleaning.com/{slug}/{svc}/" />', content)
            
            with open(dest_svc, 'w', encoding='utf-8') as f:
                f.write(content)

    print(f"[{city}] Hub successfully generated ({len(SERVICES_MAP)} service pages + {len(PAGES)} core pages).")

if __name__ == "__main__":
    cities = load_cities()
    print(f"Beginning Hub Generation for {len(cities)} cities...")
    
    for city in cities:
        build_hub(city, cities)

    print("Generation Test Complete.")
