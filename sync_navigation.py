import os
import re

source_file = 'index.html'

def get_master_blocks(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except: return None, None, None
    
    header = re.search(r'(?s)<header.*?</header>', content)
    menu = re.search(r'(?s)<!-- Mobile Menu -->.*?<!-- ================================================\s+HERO', content)
    footer = re.search(r'(?s)<footer.*?</footer>', content)
    
    h = header.group(0) if header else ""
    m = menu.group(0) if menu else ""
    if m:
        m = re.sub(r'(?s)<!-- ================================================\s+HERO.*', '', m).strip()
    f_block = footer.group(0) if footer else ""
    
    return h, m, f_block

H_MASTER, M_MASTER, F_MASTER = get_master_blocks(source_file)
script_tag = '<script src="/js/navigation-dynamic.js" defer></script>'

SERVICES = [
    'house-cleaning', 'deep-cleaning', 'airbnb-cleaning', 'move-in-out-cleaning',
    'commercial-cleaning', 'office-janitorial-services', 'janitorial-cleaning-services',
    'medical-dental-facility-cleaning', 'industrial-warehouse-cleaning', 'gym-fitness-center-cleaning',
    'school-daycare-cleaning', 'church-worship-center-cleaning', 'property-management-janitorial',
    'post-construction-cleaning', 'pressure-washing', 'carpet-cleaning', 'window-cleaning',
    'floor-stripping-waxing', 'solar-panel-cleaning', 'gutter-cleaning', 'property-maintenance',
    'home-watch-services', 'luxury-estate-cleaning', 'luxury-estate-management', 'airbnb-vacation-rental-management',
    'about', 'blog', 'gallery', 'contact'
]

SERVICE_RE = re.compile(r'href="/(' + '|'.join(re.escape(s) for s in SERVICES) + r')/"')

SUBPAGE_FILES = {
    'about': 'about/index.html',
    'blog': 'blog/index.html',
    'gallery': 'gallery/index.html'
}

def get_location_slug(filepath):
    rel = os.path.relpath(filepath, '.')
    parts = rel.split(os.sep)
    if not parts or parts[0] in ['index.html', '.', 'about', 'blog', 'gallery', 'contact', 'css', 'js', 'images', '.git']: return None
    first_folder = parts[0]
    if '-cleaning' in first_folder or '-fl' in first_folder:
        return first_folder
    return None

def slug_to_name(slug):
    name = slug.replace('-cleaning', '').replace('-fl', '').replace('-', ' ')
    return name.title()

def localize_content(content, slug):
    if not slug: return content
    city_name = slug_to_name(slug)
    
    # 1. Links Localization
    content = content.replace('href="/"', f'href="/{slug}/"')
    content = content.replace('href="/home/"', f'href="/{slug}/"')
    content = content.replace('href="/index.html"', f'href="/{slug}/"')
    content = content.replace('href="/Florida-cleaning/"', f'href="/{slug}/"')
    
    # Service/Subpage localization
    content = SERVICE_RE.sub(r'href="/' + slug + r'/\1/"', content)
    
    # 2. Textual Localization - Aggressive Bradenton and placeholder replacement
    # Global replacement for Bradenton (case-insensitive where appropriate)
    content = re.sub(r'\bBradenton\b', city_name, content)
    
    # Placeholder city "About" often found in sub-pages
    content = content.replace('About, FL', f'{city_name}, FL')
    content = content.replace('About FL', f'{city_name}, FL')
    content = content.replace('About fl', f'{city_name}, FL')
    content = re.sub(r'\bin About\b', f'in {city_name}', content, flags=re.IGNORECASE)
    
    # Southwest Florida -> Hub City
    content = content.replace('Southwest Florida', city_name)
    
    # Generic "Florida" cleaning service references -> City
    content = content.replace('Florida Cleaning Service', f'{city_name} Cleaning Service')
    content = content.replace('Florida\'s highest-rated', f'{city_name}\'s highest-rated')

    # 3. Map and Encoded URLs
    content = content.replace("Bradenton%2C%20FL", city_name.replace(" ", "%20") + "%2C%20FL")
    
    # 4. Logo alt fix
    content = content.replace('alt="Sweet Maid Cleaning Service - Bradenton, FL"', f'alt="Sweet Maid Cleaning Service - {city_name}, FL"')

    return content

def sync_file(filepath):
    rel = os.path.relpath(filepath, '.')
    parts = rel.split(os.sep)
    slug = get_location_slug(filepath)
    is_subpage = False
    master_source = source_file
    
    if slug and len(parts) >= 2:
        sub_type = parts[1]
        if sub_type in SUBPAGE_FILES:
            is_subpage = True
            master_source = SUBPAGE_FILES[sub_type]

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            file_content = f.read()
    except: return False
    
    if is_subpage:
        try:
            with open(master_source, 'r', encoding='utf-8') as f:
                master_content = f.read()
            file_content = localize_content(master_content, slug)
            file_content = file_content.replace('href="css/', 'href="/css/')
            file_content = file_content.replace('src="js/', 'src="/js/')
            file_content = file_content.replace('src="images/', 'src="/images/') 
            file_content = file_content.replace('href="images/', 'href="/images/')
            
            # Sub-page links local isolation
            for s in SERVICES:
                file_content = file_content.replace(f'href="/{s}/"', f'href="/{slug}/{s}/"')

            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(file_content)
            return True
        except: return False

    changed = False
    
    if H_MASTER and '<header' in file_content:
        local_header = localize_content(H_MASTER, slug)
        new_content = re.sub(r'(?s)<header.*?</header>', local_header, file_content)
        if new_content != file_content: file_content = new_content; changed = True
            
    pattern_menu = r'(?s)<!-- Mobile Menu.*?-->.*?<!-- ================================================'
    if M_MASTER and re.search(pattern_menu, file_content):
        local_menu = localize_content(M_MASTER, slug)
        new_content = re.sub(pattern_menu, local_menu + '\n    <!-- ================================================', file_content)
        if new_content != file_content: file_content = new_content; changed = True
            
    if F_MASTER and '<footer' in file_content:
        local_footer = localize_content(F_MASTER, slug)
        new_content = re.sub(r'(?s)<footer.*?</footer>', local_footer, file_content)
        if new_content != file_content: file_content = new_content; changed = True

    if slug:
        new_content = localize_content(file_content, slug)
        if new_content != file_content:
            file_content = new_content
            changed = True
        
        if 'src="js/' in file_content: file_content = file_content.replace('src="js/', 'src="/js/'); changed = True
        if 'href="css/' in file_content: file_content = file_content.replace('href="css/', 'href="/css/'); changed = True
        if 'src="images/' in file_content: file_content = file_content.replace('src="images/', 'src="/images/'); changed = True

    if script_tag not in file_content and '</head>' in file_content:
        file_content = file_content.replace('</head>', f'  {script_tag}\n</head>')
        changed = True
        
    if changed:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(file_content)
        return True
    return False

print("Starting Personalization Sync v6 (Aggressive)...")
synced_count = 0
total_processed = 0

for root, dirs, files in os.walk('.'):
    if any(skip in root for skip in ['.git', 'node_modules', 'js', 'images', 'css']): continue
    for name in files:
        if name == 'index.html':
            filepath = os.path.join(root, name)
            if os.path.abspath(filepath) in [os.path.abspath(f) for f in [source_file] + list(SUBPAGE_FILES.values())]: continue
            total_processed += 1
            if sync_file(filepath):
                synced_count += 1
            if total_processed % 5000 == 0:
                print(f"Processed {total_processed} files... ({synced_count} updated)")

print(f"\nFinal Personalization Sync complete! Total: {total_processed}, Updated: {synced_count}")
