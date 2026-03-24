#!/usr/bin/env python3
"""
inject_nearby_locations.py
--------------------------
Updates the "Service Areas" card grid and nav hardcoded links in every
*-fl/index.html location page to show the geographically nearest cities
using the Haversine formula.

Usage:
    python scripts/inject_nearby_locations.py           # All pages
    python scripts/inject_nearby_locations.py --test bradenton-fl  # One page

Run from the SweetMaidsB root directory.
"""

import os
import re
import json
import math
import sys
import glob

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COORDS_FILE = os.path.join(BASE_DIR, 'js', 'city_coords.json')
NUM_NEARBY_BODY = 16  # How many cities in the body areas grid
NUM_NEARBY_NAV  = 8   # How many cities in the nav dropdown (also used as fallback)

# ---------------------------------------------------------------------------
# Load coordinates
# ---------------------------------------------------------------------------
with open(COORDS_FILE, 'r', encoding='utf-8') as f:
    CITY_COORDS = json.load(f)


def haversine(lat1, lng1, lat2, lng2):
    """Return distance in miles between two lat/lng points."""
    R = 3958.8
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlng / 2) ** 2)
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def get_nearest(slug, count):
    """Return list of {slug, name} dicts sorted by distance from given slug."""
    if slug not in CITY_COORDS:
        return []
    cur = CITY_COORDS[slug]
    distances = []
    for other_slug, city in CITY_COORDS.items():
        if other_slug == slug:
            continue
        dist = haversine(cur['lat'], cur['lng'], city['lat'], city['lng'])
        distances.append({'slug': other_slug, 'name': city['name'], 'dist': dist})
    distances.sort(key=lambda x: x['dist'])
    return distances[:count]


# ---------------------------------------------------------------------------
# HTML generation helpers
# ---------------------------------------------------------------------------
def build_body_grid_html(nearest):
    """Generate the location card grid HTML for the body areas section."""
    cards = []
    for city in nearest:
        card = (
            f'            <a href="/{city["slug"]}/"'
            f'\n              class="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-br from-pink-50 to-pink-50 '
            f'hover:from-pink-100 hover:to-pink-100 transition-all duration-300 border border-pink-100 hover:shadow-lg group">'
            f'\n              <i class="fa-solid fa-location-dot text-pink-300 text-sm group-hover:scale-110 transition-transform"></i>'
            f'\n              <span class="font-semibold text-gray-800 text-sm">{city["name"]}</span>'
            f'\n            </a>'
        )
        cards.append(card)
    return '\n'.join(cards)


def build_nav_links_html(nearest):
    """Generate the hardcoded fallback nav nearby links HTML (inside nearby-locations-list)."""
    lines = []
    for city in nearest:
        lines.append(
            f'<a href="https://sweetmaidcleaning.com/{city["slug"]}/" '
            f'class="block px-3 py-2 rounded-xl hover:bg-pink-50 text-gray-700 hover:text-pink-400 '
            f'font-medium text-sm transition">{city["name"]}</a>'
        )
    return '\n'.join(lines)


# ---------------------------------------------------------------------------
# Injection logic
# ---------------------------------------------------------------------------
# Regex to match the entire grid div inside the areas section
# The grid starts after the description paragraph inside the left column
BODY_GRID_PATTERN = re.compile(
    r'(<div class="grid grid-cols-2 md:grid-cols-4 gap-3">)'
    r'.*?'
    r'(</div>\s*</div>\s*\n?\s*<div [^>]*h-96)',
    re.DOTALL
)

# Regex to match the content inside nearby-locations-list div
NAV_LIST_PATTERN = re.compile(
    r'(<div id="nearby-locations-list"[^>]*>)'
    r'\s*.*?'
    r'(</div>)',
    re.DOTALL
)


def inject_page(slug, html_path):
    """Inject correct nearby locations into a single page."""
    with open(html_path, 'r', encoding='utf-8') as f:
        content = f.read()

    nearest_body = get_nearest(slug, NUM_NEARBY_BODY)
    nearest_nav  = get_nearest(slug, NUM_NEARBY_NAV)

    if not nearest_body:
        print(f"  [SKIP] No coordinates found for slug: {slug}")
        return False

    changed = False

    # ---- 1. Update the body service areas grid ----
    grid_html = build_body_grid_html(nearest_body)
    new_grid_block = (
        '<div class="grid grid-cols-2 md:grid-cols-4 gap-3">\n'
        + grid_html + '\n'
        + '          </div>'
    )

    def replace_body_grid(m):
        # Rebuild: keep the map div that follows
        return new_grid_block + '\n        </div>\n\n        <div ' + m.group(2).split('<div ', 1)[1]

    new_content, n = re.subn(BODY_GRID_PATTERN,
                              lambda m: new_grid_block + '\n        </div>\n\n        <div ' + m.group(2).split('<div ', 1)[1],
                              content, count=1)
    if n:
        content = new_content
        changed = True

    # ---- 2. Update nav nearby-locations-list (hardcoded fallback) ----
    nav_html = build_nav_links_html(nearest_nav)

    def replace_nav(m):
        return m.group(1) + '\n' + nav_html + '\n' + m.group(2)

    new_content, n = re.subn(NAV_LIST_PATTERN, replace_nav, content, count=1)
    if n:
        content = new_content
        changed = True

    if changed:
        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  [OK]   {slug}")
    else:
        print(f"  [WARN] No replaceable sections found in {slug}")

    return changed


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------
def main():
    test_slug = None
    if '--test' in sys.argv:
        idx = sys.argv.index('--test')
        if idx + 1 < len(sys.argv):
            test_slug = sys.argv[idx + 1]

    if test_slug:
        slugs = [test_slug]
    else:
        # Find all *-fl directories that contain an index.html
        pattern = os.path.join(BASE_DIR, '*-fl', 'index.html')
        slugs = [
            os.path.basename(os.path.dirname(p))
            for p in glob.glob(pattern)
        ]
        slugs.sort()

    print(f"Processing {len(slugs)} location page(s)...")
    ok = 0
    for slug in slugs:
        html_path = os.path.join(BASE_DIR, slug, 'index.html')
        if not os.path.exists(html_path):
            print(f"  [MISS] {html_path} not found")
            continue
        if inject_page(slug, html_path):
            ok += 1

    print(f"\nDone: {ok}/{len(slugs)} pages updated.")


if __name__ == '__main__':
    main()
