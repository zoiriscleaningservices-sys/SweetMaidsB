#!/usr/bin/env python3
"""
inject_nearby_locations.py
--------------------------
Updates the "Service Areas" card grid and nav hardcoded links in every
location page to show the geographically nearest cities using Haversine.

Handles ALL page types:
  - *-fl/index.html         (uses slug as-is)
  - *-cleaning/index.html   (strips -cleaning suffix, maps to *-fl slug)
  - *-miami-fl/index.html   (e.g. miami-cleaning -> miami-fl)

Usage:
    python scripts/inject_nearby_locations.py              # All pages
    python scripts/inject_nearby_locations.py --test bradenton-fl
    python scripts/inject_nearby_locations.py --test bradenton-cleaning

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
NUM_NEARBY_BODY = 16
NUM_NEARBY_NAV  = 8

# ---------------------------------------------------------------------------
# Load coordinates
# ---------------------------------------------------------------------------
with open(COORDS_FILE, 'r', encoding='utf-8') as f:
    CITY_COORDS = json.load(f)

# Build a "name -> slug" reverse lookup for convenience
NAME_TO_SLUG = {v['name'].lower(): k for k, v in CITY_COORDS.items()}


def resolve_slug(folder_name):
    """
    Given a folder name, return the matching city slug in CITY_COORDS.
    
    Examples:
      'bradenton-fl'      -> 'bradenton-fl'
      'bradenton-cleaning'-> 'bradenton-fl'
      'miami-cleaning'    -> 'miami-fl'
      'sarasota-cleaning' -> 'sarasota-fl'
    """
    # Direct match
    if folder_name in CITY_COORDS:
        return folder_name

    # Try stripping -cleaning and appending -fl
    if folder_name.endswith('-cleaning'):
        base = folder_name[:-len('-cleaning')]
        candidate = base + '-fl'
        if candidate in CITY_COORDS:
            return candidate

    # Try any other suffix patterns — look for first word(s) matching a slug
    for slug in CITY_COORDS:
        city_base = slug.replace('-fl', '')
        folder_base = re.sub(r'-(cleaning|fl|services)$', '', folder_name)
        if city_base == folder_base:
            return slug

    return None


def haversine(lat1, lng1, lat2, lng2):
    R = 3958.8
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlng / 2) ** 2)
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def get_nearest(slug, count):
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
BODY_GRID_PATTERN = re.compile(
    r'(<div class="grid grid-cols-2 md:grid-cols-4 gap-3">)'
    r'.*?'
    r'(</div>\s*</div>\s*\n?\s*<div [^>]*h-96)',
    re.DOTALL
)

NAV_LIST_PATTERN = re.compile(
    r'(<div id="nearby-locations-list"[^>]*>)'
    r'\s*.*?'
    r'(</div>)',
    re.DOTALL
)


def inject_page(folder_name, html_path):
    slug = resolve_slug(folder_name)
    if not slug:
        print(f'  [SKIP] Cannot resolve city slug for: {folder_name}')
        return False

    with open(html_path, 'r', encoding='utf-8') as f:
        content = f.read()

    nearest_body = get_nearest(slug, NUM_NEARBY_BODY)
    nearest_nav  = get_nearest(slug, NUM_NEARBY_NAV)

    if not nearest_body:
        print(f'  [SKIP] No coordinates found for slug: {slug} (from {folder_name})')
        return False

    changed = False

    # ---- 1. Update body service areas grid ----
    grid_html = build_body_grid_html(nearest_body)
    new_grid_block = (
        '<div class="grid grid-cols-2 md:grid-cols-4 gap-3">\n'
        + grid_html + '\n'
        + '          </div>'
    )

    new_content, n = re.subn(
        BODY_GRID_PATTERN,
        lambda m: new_grid_block + '\n        </div>\n\n        <div ' + m.group(2).split('<div ', 1)[1],
        content, count=1
    )
    if n:
        content = new_content
        changed = True

    # ---- 2. Update nav nearby-locations-list (only if hardcoded links exist) ----
    nav_html = build_nav_links_html(nearest_nav)
    new_content, n = re.subn(
        NAV_LIST_PATTERN,
        lambda m: m.group(1) + '\n' + nav_html + '\n' + m.group(2),
        content, count=1
    )
    if n:
        content = new_content
        changed = True

    if changed:
        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'  [OK]   {folder_name} -> {slug}')
    else:
        print(f'  [WARN] No replaceable sections in {folder_name}')

    return changed


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------
def main():
    test_folder = None
    if '--test' in sys.argv:
        idx = sys.argv.index('--test')
        if idx + 1 < len(sys.argv):
            test_folder = sys.argv[idx + 1]

    if test_folder:
        folders = [test_folder]
    else:
        # Collect all folders that have an index.html (excluding service-only folders)
        all_index = glob.glob(os.path.join(BASE_DIR, '*/index.html'))
        # Filter to location-type folders: ends with -fl or -cleaning
        folders = []
        for path in all_index:
            folder = os.path.basename(os.path.dirname(path))
            if folder.endswith('-fl') or folder.endswith('-cleaning'):
                folders.append(folder)
        folders.sort()

    print(f'Processing {len(folders)} location page(s)...')
    ok = 0
    for folder in folders:
        html_path = os.path.join(BASE_DIR, folder, 'index.html')
        if not os.path.exists(html_path):
            print(f'  [MISS] {html_path} not found')
            continue
        if inject_page(folder, html_path):
            ok += 1

    print(f'\nDone: {ok}/{len(folders)} pages updated.')


if __name__ == '__main__':
    main()
