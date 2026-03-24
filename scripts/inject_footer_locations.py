#!/usr/bin/env python3
"""
inject_footer_locations.py
--------------------------
Updates footer location links on all location pages to show geo-proximity 
nearest cities using Haversine distance.

Targets TWO footer sections:
1. Lateral SEO cross-links row  (flex flex-wrap justify-center)
2. "Locations We Serve" grid   (grid grid-cols-2 sm:grid-cols-4)

Run from the SweetMaidsB root directory:
    python scripts/inject_footer_locations.py
"""

import os, re, json, math, glob

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COORDS_FILE = os.path.join(BASE_DIR, 'js', 'city_coords.json')
NUM_LATERAL = 10   # small inline SEO cross-links row
NUM_FOOTER  = 28   # "Locations We Serve" grid

with open(COORDS_FILE, 'r', encoding='utf-8') as f:
    CITY_COORDS = json.load(f)


def haversine(lat1, lng1, lat2, lng2):
    R = 3958.8
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = (math.sin(dlat/2)**2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlng/2)**2)
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))


def get_nearest(slug, count):
    if slug not in CITY_COORDS:
        return []
    cur = CITY_COORDS[slug]
    dists = []
    for s, c in CITY_COORDS.items():
        if s == slug: continue
        dists.append({'slug': s, 'name': c['name'],
                      'dist': haversine(cur['lat'], cur['lng'], c['lat'], c['lng'])})
    dists.sort(key=lambda x: x['dist'])
    return dists[:count]


def resolve_slug(folder):
    if folder in CITY_COORDS: return folder
    if folder.endswith('-cleaning'):
        cand = folder[:-len('-cleaning')] + '-fl'
        if cand in CITY_COORDS: return cand
    for slug in CITY_COORDS:
        base = slug.replace('-fl', '')
        fb   = re.sub(r'-(cleaning|fl|services)$', '', folder)
        if base == fb: return slug
    return None


# ── HTML builders ──────────────────────────────────────────────────────────

def build_lateral_links(nearest):
    """Inline SEO row: City • City • City ..."""
    parts = []
    for city in nearest:
        parts.append(
            f'<a href="/{city["slug"]}/" '
            f'class="text-gray-500 hover:text-pink-400 text-sm transition-colors">'
            f'{city["name"]}</a>'
            f'<span class="text-pink-200 mx-2 last:hidden">•</span>'
        )
    return ''.join(parts)


def build_footer_grid_links(nearest):
    """Footer grid: one <a> per line."""
    lines = []
    for city in nearest:
        lines.append(
            f'            <a href="/{city["slug"]}/" '
            f'class="hover:text-pink-400 transition-colors">'
            f'{city["name"]}</a>'
        )
    return '\n'.join(lines)


# ── Regex patterns ─────────────────────────────────────────────────────────

# Pattern 1: Lateral SEO cross-links row
# Matches the contents of <div class="flex flex-wrap justify-center items-center">
LATERAL_PATTERN = re.compile(
    r'(<div class="flex flex-wrap justify-center items-center">)'
    r'(.*?)'
    r'(</div>)',
    re.DOTALL
)

# Pattern 2: Footer "Locations We Serve" grid
# Matches the contents of <div class="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 text-xs">
FOOTER_GRID_PATTERN = re.compile(
    r'(<div class="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 text-xs">)'
    r'(.*?)'
    r'(</div>)',
    re.DOTALL
)


def inject_page(folder, html_path):
    slug = resolve_slug(folder)
    if not slug:
        return False

    with open(html_path, 'r', encoding='utf-8') as f:
        content = f.read()

    nearest_lat    = get_nearest(slug, NUM_LATERAL)
    nearest_footer = get_nearest(slug, NUM_FOOTER)
    if not nearest_lat:
        return False

    changed = False

    # 1. Lateral SEO row
    lateral_html = build_lateral_links(nearest_lat)
    new_content, n = LATERAL_PATTERN.subn(
        lambda m: m.group(1) + lateral_html + m.group(3),
        content, count=1
    )
    if n:
        content = new_content
        changed = True

    # 2. Footer "Locations We Serve" grid
    footer_html = build_footer_grid_links(nearest_footer)
    new_content, n = FOOTER_GRID_PATTERN.subn(
        lambda m: m.group(1) + '\n' + footer_html + '\n          ' + m.group(3),
        content, count=1
    )
    if n:
        content = new_content
        changed = True

    if changed:
        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'  [OK]   {folder}')
    else:
        print(f'  [SKIP] {folder}')

    return changed


def main():
    all_index = glob.glob(os.path.join(BASE_DIR, '*/index.html'))
    folders = sorted(
        os.path.basename(os.path.dirname(p))
        for p in all_index
        if os.path.basename(os.path.dirname(p)).endswith(('-fl', '-cleaning'))
    )

    print(f'Processing {len(folders)} pages...')
    ok = 0
    for folder in folders:
        html_path = os.path.join(BASE_DIR, folder, 'index.html')
        if os.path.exists(html_path) and inject_page(folder, html_path):
            ok += 1

    print(f'\nDone: {ok}/{len(folders)} pages updated.')


if __name__ == '__main__':
    main()
