#!/usr/bin/env python3
"""
SEO Bulk Fix Script — Sweet Maid Cleaning
Fixes ALL 152 index.html files:
1. Canonical URL → correct page URL
2. og:url → correct page URL
3. Schema "url" field → correct page URL
4. FAQ Question 1 name → fill in city/page name
5. Emoji encoding corruption → clean UTF-8
6. og:title → clean values (remove "House's" etc.)
"""

import os
import re
import sys

BASE_DIR = r"c:\Users\lucia\OneDrive\Desktop\SweetMaidsB"
BASE_URL = "https://sweetmaidcleaning.com"

# Map folder names to human-readable city/service names
FOLDER_TO_NAME = {
    "house-cleaning": "Florida",
    "deep-cleaning": "Florida",
    "airbnb-cleaning": "Florida",
    "move-in-out-cleaning": "Florida",
    "commercial-cleaning": "Florida",
    "post-construction-cleaning": "Florida",
    "luxury-estate-cleaning": "Florida",
    "luxury-estate-management": "Florida",
    "carpet-cleaning": "Florida",
    "pressure-washing": "Florida",
    "window-cleaning": "Florida",
    "airbnb-vacation-rental-management": "Florida",
    "home-watch-services": "Florida",
    "office-janitorial-services": "Florida",
    "janitorial-cleaning-services": "Florida",
    "floor-stripping-waxing": "Florida",
    "solar-panel-cleaning": "Florida",
    "gutter-cleaning": "Florida",
    "property-maintenance": "Florida",
    "gym-fitness-center-cleaning": "Florida",
    "school-daycare-cleaning": "Florida",
    "church-worship-center-cleaning": "Florida",
    "industrial-warehouse-cleaning": "Florida",
    "property-management-janitorial": "Florida",
    # Location pages
    "bradenton-fl": "Bradenton",
    "sarasota-fl": "Sarasota",
    "venice-fl": "Venice",
    "palmetto-fl": "Palmetto",
    "parrish-fl": "Parrish",
    "ellenton-fl": "Ellenton",
    "north-port-fl": "North Port",
    "lakewood-ranch-fl": "Lakewood Ranch",
    "siesta-key-fl": "Siesta Key",
    "longboat-key-fl": "Longboat Key",
    "anna-maria-fl": "Anna Maria",
    "university-park-fl": "University Park",
    "palmer-ranch-fl": "Palmer Ranch",
    "bird-key-fl": "Bird Key",
    "lido-key-fl": "Lido Key",
    "osprey-fl": "Osprey",
    "nokomis-fl": "Nokomis",
    "laurel-fl": "Laurel",
    "vamo-fl": "Vamo",
    "south-venice-fl": "South Venice",
    "myakka-city-fl": "Myakka City",
    "port-charlotte-fl": "Port Charlotte",
    "punta-gorda-fl": "Punta Gorda",
    "englewood-fl": "Englewood",
    "fort-myers-fl": "Fort Myers",
    "cape-coral-fl": "Cape Coral",
    "estero-fl": "Estero",
    "naples-fl": "Naples",
    "marco-island-fl": "Marco Island",
    "bonita-springs-fl": "Bonita Springs",
    "pelican-bay-fl": "Pelican Bay",
    "lehigh-acres-fl": "Lehigh Acres",
    "miami-fl": "Miami",
    "miami-beach-fl": "Miami Beach",
    "fort-lauderdale-fl": "Fort Lauderdale",
    "boca-raton-fl": "Boca Raton",
    "west-palm-beach-fl": "West Palm Beach",
    "tampa-fl": "Tampa",
    "clearwater-fl": "Clearwater",
    "saint-petersburg-fl": "St. Petersburg",
    "brandon-fl": "Brandon",
    "riverview-fl": "Riverview",
    "ruskin-fl": "Ruskin",
    "sun-city-center-fl": "Sun City Center",
    "apollo-beach-fl": "Apollo Beach",
    "gibsonton-fl": "Gibsonton",
    "east-tampa-fl": "East Tampa",
    "carrollwood-fl": "Carrollwood",
    "cheval-fl": "Cheval",
    "westchase-fl": "Westchase",
    "odessa-fl": "Odessa",
    "lutz-fl": "Lutz",
    "land-o-lakes-fl": "Land O Lakes",
    "keystone-fl": "Keystone",
    "safety-harbor-fl": "Safety Harbor",
    "palm-harbor-fl": "Palm Harbor",
    "largo-fl": "Largo",
    "tarpon-springs-fl": "Tarpon Springs",
    "indian-rocks-beach-fl": "Indian Rocks Beach",
    "seminole-fl": "Seminole",
    "key-biscayne-fl": "Key Biscayne",
    "key-largo-fl": "Key Largo",
    "islamorada-fl": "Islamorada",
    "tavernier-fl": "Tavernier",
    "marathon-fl": "Marathon",
    "big-pine-key-fl": "Big Pine Key",
    "duck-key-fl": "Duck Key",
    "coral-gables-fl": "Coral Gables",
    "coconut-grove-fl": "Coconut Grove",
    "pinecrest-fl": "Pinecrest",
    "brickell-fl": "Brickell",
    "wynwood-fl": "Wynwood",
    "aventura-fl": "Aventura",
    "bal-harbour-fl": "Bal Harbour",
    "sunny-isles-beach-fl": "Sunny Isles Beach",
    "golden-beach-fl": "Golden Beach",
    "biscayne-park-fl": "Biscayne Park",
    "miami-shores-fl": "Miami Shores",
    "surfside-fl": "Surfside",
    "dania-fl": "Dania",
    "hallandale-fl": "Hallandale",
    "hollywood-fl": "Hollywood",
    "pembroke-pines-fl": "Pembroke Pines",
    "miramar-fl": "Miramar",
    "plantation-fl": "Plantation",
    "coral-springs-fl": "Coral Springs",
    "coral-ridge-fl": "Coral Ridge",
    "pompano-beach-fl": "Pompano Beach",
    "coconut-creek-fl": "Coconut Creek",
    "delray-beach-fl": "Delray Beach",
    "boynton-beach-fl": "Boynton Beach",
    "lake-worth-fl": "Lake Worth",
    "lake-park-fl": "Lake Park",
    "riviera-beach-fl": "Riviera Beach",
    "palm-beach-fl": "Palm Beach",
    "north-palm-beach-fl": "North Palm Beach",
    "palm-beach-gardens-fl": "Palm Beach Gardens",
    "wellington-fl": "Wellington",
    "greenacres-fl": "Greenacres",
    "davis-islands-fl": "Davis Islands",
    "hyde-park-fl": "Hyde Park",
    "temple-terrace-fl": "Temple Terrace",
    "tampa-palms-fl": "Tampa Palms",
    "crystal-lake-fl": "Crystal Lake",
    "port-richey-fl": "Port Richey",
    "palmetto-bay-fl": "Palmetto Bay",
    "winter-haven-fl": "Winter Haven",
    "lakeland-fl": "Lakeland",
    "treasure-island-fl": "Treasure Island",
    "belleair-beach-fl": "Belleair Beach",
    # Cleaning hub pages
    "bradenton-cleaning": "Bradenton",
    "sarasota-cleaning": "Sarasota",
    "miami-cleaning": "Miami",
    "lakewood-ranch-cleaning": "Lakewood Ranch",
    "siesta-key-cleaning": "Siesta Key",
    "longboat-key-cleaning": "Longboat Key",
    "anna-maria-cleaning": "Anna Maria",
    "university-park-cleaning": "University Park",
    "palmer-ranch-cleaning": "Palmer Ranch",
    "bird-key-cleaning": "Bird Key",
    "lido-key-cleaning": "Lido Key",
    "osprey-cleaning": "Osprey",
    "nokomis-cleaning": "Nokomis",
    "laurel-cleaning": "Laurel",
    "vamo-cleaning": "Vamo",
    "south-venice-cleaning": "South Venice",
    "venice-cleaning": "Venice",
    "north-port-cleaning": "North Port",
    "palmetto-cleaning": "Palmetto",
    "parrish-cleaning": "Parrish",
    "ellenton-cleaning": "Ellenton",
    "port-charlotte-cleaning": "Port Charlotte",
    "englewood-cleaning": "Englewood",
    "apollo-beach-cleaning": "Apollo Beach",
    "ruskin-cleaning": "Ruskin",
    "sun-city-center-cleaning": "Sun City Center",
}


def fix_emoji_encoding(content):
    """Fix common UTF-8 mis-encoding artifacts."""
    fixes = {
        "Ã¢Å\u201câ€¦": "\u2705",   # checkmark emoji
        "Ã¢Å¡Ã¯": "\u26a1",         # lightning bolt
        "Ã¢Å¡â€ ": "\u26a1",        # lightning alt
        "â€¦": "\u2026",             # ellipsis
        "Ã¢â\u20ac\u201c": "\u2014", # em dash
        "Ã¢â\u20ac\u2122": "\u2019", # right single quote
        "â€™": "\u2019",
        "â€œ": "\u201C",
        "â€": "\u201D",
        # The actual broken strings we see in file
        "Ã¢Å\u201c": "\u2705",
    }
    for broken, correct in fixes.items():
        content = content.replace(broken, correct)
    return content


def fix_canonical(content, page_url):
    """Fix canonical href to point to actual page URL."""
    # Replace any canonical href value
    content = re.sub(
        r'(<link rel="canonical" href=")[^"]*(")',
        rf'\g<1>{page_url}\g<2>',
        content
    )
    return content


def fix_og_url(content, page_url):
    """Fix og:url content to point to actual page URL."""
    content = re.sub(
        r'(<meta property="og:url" content=")[^"]*(")',
        rf'\g<1>{page_url}\g<2>',
        content
    )
    return content


def fix_schema_url(content, page_url):
    """Fix schema.org 'url' field to point to actual page URL."""
    # Match "url": "https://..." in JSON-LD script blocks
    content = re.sub(
        r'("url":\s*")(https://sweetmaidcleaning\.com[^"]*?)(")',
        rf'\g<1>{page_url}\g<3>',
        content
    )
    return content


def fix_empty_faq_question(content, city_name):
    """Fix empty FAQ question name: 'in ' → 'in [City], FL?'"""
    content = content.replace(
        '"name": "What is the best House Cleaning service in "',
        f'"name": "What is the best House Cleaning service in {city_name}, FL?"'
    )
    return content


def fix_address_locality_service_pages(content, folder_name, city_name):
    """For root service pages, fix the addressLocality which was set to the service name."""
    # These root service pages have wrong addressLocality (e.g., "House", "Deep", etc.)
    # We want to set them to "Bradenton" (HQ city) for service pages
    service_folders = {
        "house-cleaning", "deep-cleaning", "airbnb-cleaning", "move-in-out-cleaning",
        "commercial-cleaning", "post-construction-cleaning", "luxury-estate-cleaning",
        "luxury-estate-management", "carpet-cleaning", "pressure-washing",
        "window-cleaning", "airbnb-vacation-rental-management", "home-watch-services",
        "office-janitorial-services", "janitorial-cleaning-services", "floor-stripping-waxing",
        "solar-panel-cleaning", "gutter-cleaning", "property-maintenance",
        "gym-fitness-center-cleaning", "school-daycare-cleaning", "church-worship-center-cleaning",
        "industrial-warehouse-cleaning", "property-management-janitorial"
    }
    if folder_name in service_folders:
        # Fix addressLocality - it should be Bradenton (our HQ)
        content = re.sub(
            r'("addressLocality":\s*")[^"]*(")',
            r'\g<1>Bradenton\g<2>',
            content
        )
        # Fix areaServed name
        content = re.sub(
            r'("name":\s*")[^"]+,\s*FL(")',
            r'\g<1>Florida\g<2>',
            content
        )
    return content


def fix_service_page_title_topbar(content, folder_name, city_name):
    """Fix the top bar and schema name for broken service pages that used a template that filled in the service name as city."""
    service_map = {
        "house-cleaning": ("House Cleaning Services in Florida", "Sweet Maid Cleaning — House Cleaning Services Florida", "Sweet Maid Cleaning — Best House Cleaning Service in Florida | Sweet Maid"),
        "deep-cleaning": ("Deep Cleaning Services in Florida", "Sweet Maid Cleaning — Deep Cleaning Services Florida", "Sweet Maid Cleaning — Best Deep Cleaning Service in Florida | Sweet Maid"),
        "airbnb-cleaning": ("Airbnb Cleaning Services in Florida", "Sweet Maid Cleaning — Airbnb Cleaning Florida", "Sweet Maid Cleaning — Best Airbnb Cleaning Service in Florida | Sweet Maid"),
        "move-in-out-cleaning": ("Move In/Out Cleaning in Florida", "Sweet Maid — Move In/Out Cleaning Florida", "Sweet Maid — Best Move In/Out Cleaning Service in Florida | Sweet Maid"),
        "commercial-cleaning": ("Commercial Cleaning Services in Florida", "Sweet Maid — Commercial Cleaning Florida", "Sweet Maid — Best Commercial Cleaning Service in Florida | Sweet Maid"),
        "post-construction-cleaning": ("Post-Construction Cleaning in Florida", "Sweet Maid — Post-Construction Cleaning Florida", "Sweet Maid — Best Post-Construction Cleaning in Florida | Sweet Maid"),
        "luxury-estate-cleaning": ("Luxury Estate Cleaning in Florida", "Sweet Maid — Luxury Estate Cleaning Florida", "Sweet Maid — Best Luxury Estate Cleaning in Florida | Sweet Maid"),
        "luxury-estate-management": ("Luxury Estate Management in Florida", "Sweet Maid — Luxury Estate Management Florida", "Sweet Maid — Best Luxury Estate Management in Florida | Sweet Maid"),
        "carpet-cleaning": ("Carpet Cleaning Services in Florida", "Sweet Maid — Carpet Cleaning Florida", "Sweet Maid — Best Carpet Cleaning in Florida | Sweet Maid"),
        "pressure-washing": ("Pressure Washing Services in Florida", "Sweet Maid — Pressure Washing Florida", "Sweet Maid — Best Pressure Washing in Florida | Sweet Maid"),
        "window-cleaning": ("Window Cleaning Services in Florida", "Sweet Maid — Window Cleaning Florida", "Sweet Maid — Best Window Cleaning in Florida | Sweet Maid"),
        "airbnb-vacation-rental-management": ("Airbnb & Vacation Rental Management Florida", "Sweet Maid — Vacation Rental Management Florida", "Sweet Maid — Best Vacation Rental Management in Florida | Sweet Maid"),
        "home-watch-services": ("Home Watch Services in Florida", "Sweet Maid — Home Watch Services Florida", "Sweet Maid — Best Home Watch Services in Florida | Sweet Maid"),
        "office-janitorial-services": ("Office Janitorial Services in Florida", "Sweet Maid — Office Janitorial Florida", "Sweet Maid — Best Office Janitorial Services in Florida | Sweet Maid"),
        "janitorial-cleaning-services": ("Janitorial Cleaning Services in Florida", "Sweet Maid — Janitorial Cleaning Florida", "Sweet Maid — Best Janitorial Cleaning Services in Florida | Sweet Maid"),
    }
    # Fix top bar text (only for service pages that have the broken pattern)
    if folder_name in service_map:
        topbar_text, schema_name, _ = service_map[folder_name]
        # Replace broken "#1 Rated Cleaning Service in House/Deep/Airbnb..." in top bar
        broken_patterns = [
            f"#1 Rated Cleaning Service in\n          {city_name.title()}",
            f"#1 Rated Cleaning Service in {city_name.title()}",
        ]
        for pat in broken_patterns:
            if pat in content:
                content = content.replace(pat, f"#1 Rated Cleaning Service in Florida")
        # More general fix
        content = re.sub(
            r'#1 Rated Cleaning Service in\s*\n\s+(?:House|Deep|Airbnb|Move|Commercial|Post|Luxury|Carpet|Pressure|Window|Home|Office|Janitorial|Screen|Floor|Solar|Gutter|Property|Gym|School|Church|Industrial)(?:\s+[A-Za-z]+)*',
            '#1 Rated Cleaning Service in Florida',
            content
        )
    return content


def process_file(filepath, folder_name):
    """Process a single index.html file."""
    with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
        content = f.read()

    city_name = FOLDER_TO_NAME.get(folder_name, folder_name.replace('-fl', '').replace('-', ' ').title())
    page_url = f"{BASE_URL}/{folder_name}/"

    original = content

    # Apply all fixes
    content = fix_emoji_encoding(content)
    content = fix_canonical(content, page_url)
    content = fix_og_url(content, page_url)
    content = fix_schema_url(content, page_url)
    content = fix_empty_faq_question(content, city_name)
    content = fix_address_locality_service_pages(content, folder_name, city_name)
    content = fix_service_page_title_topbar(content, folder_name, city_name)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False


def main():
    fixed = 0
    skipped = 0
    errors = 0

    for item in sorted(os.listdir(BASE_DIR)):
        folder_path = os.path.join(BASE_DIR, item)
        if not os.path.isdir(folder_path):
            continue
        # Skip non-page folders
        if item.startswith('.') or item in ('images', 'js', 'scripts', 'templates', 'login'):
            continue

        index_file = os.path.join(folder_path, 'index.html')
        if not os.path.exists(index_file):
            continue

        try:
            changed = process_file(index_file, item)
            if changed:
                fixed += 1
                print(f"FIXED: {item}/index.html")
            else:
                skipped += 1
                print(f"  OK: {item}/index.html (no changes needed)")
        except Exception as e:
            errors += 1
            print(f"ERROR: {item}/index.html — {e}")

    print(f"\n{'='*60}")
    print(f"Done! Fixed: {fixed} | Already OK: {skipped} | Errors: {errors}")


if __name__ == "__main__":
    main()
