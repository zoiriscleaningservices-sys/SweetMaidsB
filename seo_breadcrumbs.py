#!/usr/bin/env python3
"""
Adds BreadcrumbList JSON-LD schema to all location and service pages.
Inject after the closing </script> of the last existing ld+json block.
"""
import os, re

BASE_DIR = r"c:\Users\lucia\OneDrive\Desktop\SweetMaidsB"
BASE_URL = "https://sweetmaidcleaning.com"

SKIP_FOLDERS = {'images', 'js', 'scripts', 'templates', 'login', 'blog', 'gallery', 'about'}

def make_breadcrumb(folder_name, city_name=None):
    page_url = f"{BASE_URL}/{folder_name}/"
    if city_name:
        label = f"Cleaning Services in {city_name}"
    else:
        svc = folder_name.replace('-', ' ').title()
        label = svc
    return f"""
  <script type="application/ld+json">
  {{
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {{
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "{BASE_URL}/"
      }},
      {{
        "@type": "ListItem",
        "position": 2,
        "name": "{label}",
        "item": "{page_url}"
      }}
    ]
  }}
  </script>"""

CITY_NAMES = {
    "bradenton-fl": "Bradenton", "sarasota-fl": "Sarasota",
    "venice-fl": "Venice", "palmetto-fl": "Palmetto", "parrish-fl": "Parrish",
    "ellenton-fl": "Ellenton", "north-port-fl": "North Port",
    "lakewood-ranch-fl": "Lakewood Ranch", "siesta-key-fl": "Siesta Key",
    "longboat-key-fl": "Longboat Key", "anna-maria-fl": "Anna Maria Island",
    "university-park-fl": "University Park", "palmer-ranch-fl": "Palmer Ranch",
    "bird-key-fl": "Bird Key", "lido-key-fl": "Lido Key",
    "osprey-fl": "Osprey", "nokomis-fl": "Nokomis", "vamo-fl": "Vamo",
    "south-venice-fl": "South Venice", "myakka-city-fl": "Myakka City",
    "port-charlotte-fl": "Port Charlotte", "punta-gorda-fl": "Punta Gorda",
    "englewood-fl": "Englewood", "fort-myers-fl": "Fort Myers",
    "cape-coral-fl": "Cape Coral", "estero-fl": "Estero",
    "naples-fl": "Naples", "marco-island-fl": "Marco Island",
    "bonita-springs-fl": "Bonita Springs", "pelican-bay-fl": "Pelican Bay",
    "lehigh-acres-fl": "Lehigh Acres", "laurel-fl": "Laurel",
    "sun-city-center-fl": "Sun City Center", "apollo-beach-fl": "Apollo Beach",
    "ruskin-fl": "Ruskin", "tampa-fl": "Tampa", "clearwater-fl": "Clearwater",
    "saint-petersburg-fl": "St. Petersburg", "brandon-fl": "Brandon",
    "riverview-fl": "Riverview", "miami-fl": "Miami",
    "miami-beach-fl": "Miami Beach", "fort-lauderdale-fl": "Fort Lauderdale",
    "boca-raton-fl": "Boca Raton", "west-palm-beach-fl": "West Palm Beach",
}

def main():
    fixed = 0
    skipped = 0
    for item in sorted(os.listdir(BASE_DIR)):
        if item in SKIP_FOLDERS or item.startswith('.'):
            continue
        folder_path = os.path.join(BASE_DIR, item)
        if not os.path.isdir(folder_path):
            continue
        index_file = os.path.join(folder_path, 'index.html')
        if not os.path.exists(index_file):
            continue

        with open(index_file, 'r', encoding='utf-8', errors='replace') as f:
            content = f.read()

        # Skip if breadcrumb already present
        if 'BreadcrumbList' in content:
            skipped += 1
            continue

        city_name = CITY_NAMES.get(item)
        breadcrumb_script = make_breadcrumb(item, city_name)

        # Inject before </head>
        if '</head>' in content:
            content = content.replace('</head>', breadcrumb_script + '\n</head>', 1)
            with open(index_file, 'w', encoding='utf-8') as f:
                f.write(content)
            fixed += 1
            print(f"ADDED breadcrumb: {item}")
        else:
            print(f"  WARN: no </head> found in {item}")

    print(f"\nDone! BreadcrumbList added to {fixed} pages. {skipped} already had it.")

if __name__ == "__main__":
    main()
