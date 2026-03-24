#!/usr/bin/env python3
"""
repair_layout.py
----------------
Fixes the layout corruption introduced by inject_nearby_locations.py.

The bug: the BODY_GRID_PATTERN regex consumed the closing </div> tags 
after the grid AND the opening of the map div. The replacement lambda 
re-added them but split incorrectly, causing extra/missing </div> tags.

Fix: Replace the broken injection with a cleaner, safer approach that:
1. Finds the grid div precisely
2. Replaces only its contents (the <a> cards inside it)
3. Leaves all surrounding divs untouched

Run from the SweetMaidsB root directory:
    python scripts/repair_layout.py
"""

import os
import re
import json
import math
import glob

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COORDS_FILE = os.path.join(BASE_DIR, 'js', 'city_coords.json')
NUM_NEARBY_BODY = 16
NUM_NEARBY_NAV  = 8

with open(COORDS_FILE, 'r', encoding='utf-8') as f:
    CITY_COORDS = json.load(f)


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


def resolve_slug(folder_name):
    if folder_name in CITY_COORDS:
        return folder_name
    if folder_name.endswith('-cleaning'):
        candidate = folder_name[:-len('-cleaning')] + '-fl'
        if candidate in CITY_COORDS:
            return candidate
    for slug in CITY_COORDS:
        city_base = slug.replace('-fl', '')
        folder_base = re.sub(r'-(cleaning|fl|services)$', '', folder_name)
        if city_base == folder_base:
            return slug
    return None


def build_card(city):
    return (
        f'            <a href="/{city["slug"]}/"'
        f'\n              class="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-br from-pink-50 to-pink-50 '
        f'hover:from-pink-100 hover:to-pink-100 transition-all duration-300 border border-pink-100 hover:shadow-lg group">'
        f'\n              <i class="fa-solid fa-location-dot text-pink-300 text-sm group-hover:scale-110 transition-transform"></i>'
        f'\n              <span class="font-semibold text-gray-800 text-sm">{city["name"]}</span>'
        f'\n            </a>'
    )


def build_nav_link(city):
    return (
        f'<a href="https://sweetmaidcleaning.com/{city["slug"]}/" '
        f'class="block px-3 py-2 rounded-xl hover:bg-pink-50 text-gray-700 hover:text-pink-400 '
        f'font-medium text-sm transition">{city["name"]}</a>'
    )


# SAFE grid pattern: only matches the CONTENTS inside the grid div, not surrounding tags
# Matches: <div class="grid grid-cols-2 md:grid-cols-4 gap-3">...CONTENT...</div>
# Uses a non-greedy match that stops at the first </div> that closes the opening grid div
SAFE_GRID_PATTERN = re.compile(
    r'(<div class="grid grid-cols-2 md:grid-cols-4 gap-3">)'
    r'(.*?)'
    r'(</div>)',
    re.DOTALL
)

# NAV: Only match the content between the id div tags, stop at first </div>
SAFE_NAV_PATTERN = re.compile(
    r'(<div id="nearby-locations-list"[^>]*>)'
    r'(.*?)'
    r'(</div>)',
    re.DOTALL
)


def repair_page(folder_name, html_path):
    slug = resolve_slug(folder_name)
    if not slug:
        return False

    with open(html_path, 'r', encoding='utf-8') as f:
        content = f.read()

    nearest_body = get_nearest(slug, NUM_NEARBY_BODY)
    nearest_nav  = get_nearest(slug, NUM_NEARBY_NAV)
    if not nearest_body:
        return False

    changed = False
    new_cards = '\n'.join(build_card(c) for c in nearest_body)
    new_nav_links = '\n'.join(build_nav_link(c) for c in nearest_nav)

    # --- Fix body grid: replace only the CONTENTS inside the grid div ---
    def replace_grid(m):
        return m.group(1) + '\n' + new_cards + '\n          ' + m.group(3)

    new_content, n = SAFE_GRID_PATTERN.subn(replace_grid, content, count=1)
    if n:
        content = new_content
        changed = True

    # --- Fix nav: replace only the CONTENTS inside nearby-locations-list ---
    def replace_nav(m):
        return m.group(1) + '\n' + new_nav_links + '\n' + m.group(3)

    new_content, n = SAFE_NAV_PATTERN.subn(replace_nav, content, count=1)
    if n:
        content = new_content
        changed = True

    if changed:
        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'  [FIXED] {folder_name}')
    else:
        print(f'  [SKIP]  {folder_name} (no matching sections)')

    return changed


def main():
    all_index = glob.glob(os.path.join(BASE_DIR, '*/index.html'))
    folders = []
    for path in all_index:
        folder = os.path.basename(os.path.dirname(path))
        if folder.endswith('-fl') or folder.endswith('-cleaning'):
            folders.append(folder)
    folders.sort()

    print(f'Repairing {len(folders)} location pages...')
    ok = 0
    for folder in folders:
        html_path = os.path.join(BASE_DIR, folder, 'index.html')
        if not os.path.exists(html_path):
            continue
        if repair_page(folder, html_path):
            ok += 1

    print(f'\nDone: {ok}/{len(folders)} pages repaired.')


if __name__ == '__main__':
    main()
