import os
import re
import json
import shutil
import urllib.parse
from concurrent.futures import ThreadPoolExecutor

# Load Data
with open('florida_master_matrix.json', 'r') as f:
    florida_data = json.load(f)

# The 25 Services
service_slugs = [
    "house-cleaning", "deep-cleaning", "move-in-out-cleaning", "airbnb-cleaning", "commercial-cleaning",
    "post-construction-cleaning", "carpet-cleaning", "pressure-washing", "window-cleaning",
    "home-watch-services", "office-janitorial-services", "janitorial-cleaning-services",
    "medical-dental-facility-cleaning", "industrial-warehouse-cleaning", "floor-stripping-waxing",
    "gym-fitness-center-cleaning", "school-daycare-cleaning", "church-worship-center-cleaning",
    "property-management-janitorial", "luxury-estate-cleaning", "solar-panel-cleaning",
    "gutter-cleaning", "property-maintenance", "airbnb-vacation-rental-management",
    "luxury-estate-management"
]

# Load Templates
templates = {}

with open('home/index.html', 'r', encoding='utf-8') as f:
    templates['home'] = f.read()

try:
    with open('about/index.html', 'r', encoding='utf-8') as f:
        templates['about'] = f.read()
except:
    templates['about'] = None

try:
    with open('gallery/index.html', 'r', encoding='utf-8') as f:
        templates['gallery'] = f.read()
except:
    templates['gallery'] = None

# Load all 25 service templates
for s in service_slugs:
    try:
        with open(f'{s}/index.html', 'r', encoding='utf-8') as f:
            templates[s] = f.read()
    except Exception as e:
        print(f"Missing template for {s}")
        templates[s] = None

# Extract Header/Footer macros from home
home_content = templates['home']
head_match = re.search(r'(?s)<head.*?>.*?</head>', home_content)
source_head = head_match.group(0) if head_match else ''
source_head = re.sub(r'(?s)<title>.*?</title>', '', source_head)
source_head = re.sub(r'(?s)<meta name="description".*?>', '', source_head)
source_head = re.sub(r'(?s)<meta name="keywords".*?>', '', source_head)
source_head = re.sub(r'(?s)<link rel="canonical".*?>', '', source_head)
source_head = re.sub(r'(?s)<script type="application/ld\+json">.*?</script>', '', source_head)
source_head = re.sub(r'(?i)<head.*?>|</head>', '', source_head).strip()

header_match = re.search(r'(?s)<header.*?</header>', home_content)
source_header = header_match.group(0) if header_match else ''

menu_start_idx = home_content.find('<!-- Mobile Menu Expansion -->')
if menu_start_idx == -1:
    menu_start_idx = home_content.find('<!-- Mobile Menu -->')
hero_marker = re.search(r'(?s)<!-- ================================================\s+HERO', home_content)
source_menu = home_content[menu_start_idx:hero_marker.start()].strip() if menu_start_idx >= 0 and hero_marker else ''

footer_match = re.search(r'(?s)<footer.*?>', home_content)
footer_start_idx = footer_match.start() if footer_match else len(home_content)
footer_end_idx = home_content.find('</footer>', footer_start_idx) + 9
source_footer = home_content[footer_start_idx:footer_end_idx]

source_main = home_content[hero_marker.start():footer_start_idx].strip() if hero_marker else ''

post_footer = home_content[footer_end_idx:]
source_scripts = "\n".join(m.group(0) for m in re.finditer(r'(?s)<script>.*?</script>', post_footer))


def format_name(name):
    return name.title()

def create_page(path, html_content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(html_content)

def localized_replace(content, clean_name, loc_slug, is_sub_page=False):
    # Perform standard replacements
    content = content.replace("Bradenton’s", f"{clean_name}'s").replace("Bradenton's", f"{clean_name}'s")
    content = content.replace("across Bradenton and Southwest Florida", f"across {clean_name} and Southwest Florida")
    content = content.replace("in Bradenton home", f"in {clean_name} home")
    content = content.replace("Favorite Cleaners in Bradenton", f"Favorite Cleaners in {clean_name}")
    content = content.replace("Top Rated in Bradenton", f"Top Rated in {clean_name}")
    content = content.replace("Cleaning Service in Bradenton", f"Cleaning Service in {clean_name}")
    content = content.replace("house cleaning Bradenton", f"house cleaning {clean_name}")
    content = content.replace("maid service Bradenton", f"maid service {clean_name}")
    content = content.replace("Bradenton, FL", f"{clean_name}, FL")
    content = content.replace("Bradenton", clean_name)
    
    # Update navigation links from /slug/ to /loc_slug/slug/
    for s_slug in service_slugs:
        content = content.replace(f'href="/{s_slug}/"', f'href="/{loc_slug}/{s_slug}/"')
        content = content.replace(f'href="https://sweetmaidcleaning.com/{s_slug}/"', f'href="https://sweetmaidcleaning.com/{loc_slug}/{s_slug}/"')
        
    content = content.replace('href="/home/"', f'href="/{loc_slug}/"')
    content = content.replace('href="/about/"', f'href="/{loc_slug}/about/"')
    content = content.replace('href="/gallery/"', f'href="/{loc_slug}/gallery/"')

    # Fix relative image paths
    if is_sub_page: # files in loc_slug/about/ or loc_slug/service/
        content = content.replace('src="/images/', 'src="../../images/').replace('url("/images/', 'url("../../images/")').replace("url('/images/", "url('../../images/")
        content = content.replace('src="images/', 'src="../../images/').replace('url("images/', 'url("../../images/")').replace("url('images/", "url('../../images/")
        content = content.replace('src="../images/', 'src="../../images/').replace('url("../images/', 'url("../../images/")').replace("url('../images/", "url('../../images/")
    else: # files in loc_slug/
        content = content.replace('src="/images/', 'src="../images/').replace('url("/images/', 'url("../images/")').replace("url('/images/", "url('../images/")
        content = content.replace('src="images/', 'src="../images/').replace('url("images/', 'url("../images/")').replace("url('images/", "url('../images/")

    # Fix the map - Use enhanced parameters for better location matching
    loc_query = urllib.parse.quote(f"{clean_name}, Florida")
    map_url = f"https://maps.google.com/maps?width=100%25&height=600&hl=en&q={loc_query}+()&t=&z=13&ie=UTF8&iwloc=B&output=embed"
    content = content.replace("https://www.google.com/maps/embed?pb=MAP_PLACEHOLDER", map_url)
    
    # Also catch and fix any already-generated `&t=&z=13...` ones from the previous run
    content = re.sub(r'https://maps\.google\.com/maps\?q=[^&]+&t=&z=13&ie=UTF8&iwloc=&output=embed', map_url, content)
    
    # Fix the zip codes text at the bottom of the map
    content = re.sub(r'Servicing entire 34205, 34209, 34208, 34210 areas', f'Servicing {clean_name} and surrounding areas', content)

    return content

def generate_location_pages(loc_name, loc_slug, neighborhoods=None, is_city=True, parent_city=None):
    clean_name = format_name(loc_name)
    
    #################
    # 1. HOME PAGE  #
    #################
    if neighborhoods:
        n_links_html = f"""
        <!-- ================================================
             NEIGHBORHOODS SECTION
        ================================================ -->
        <section class="py-16 bg-gray-50 border-t border-pink-100">
            <div class="max-w-7xl mx-auto px-6 lg:px-8 text-center">
                <h3 class="text-3xl font-bold mb-8 text-gray-900 font-playfair">Neighborhoods We Serve in {clean_name}</h3>
                <div class="flex flex-wrap justify-center gap-3">
                    {''.join([f'<a href="/{n.lower().replace(" ", "-")}-fl/" class="px-4 py-2 bg-white shadow-sm border border-gray-100 text-pink-500 rounded-full hover:bg-pink-500 hover:text-white transition-colors text-sm font-semibold">{n}</a>' for n in neighborhoods])}
                </div>
            </div>
        </section>
        """
    else:
        n_links_html = ""

    local_header = localized_replace(source_header, clean_name, loc_slug, False)
    local_menu = localized_replace(source_menu, clean_name, loc_slug, False)
    local_footer = localized_replace(source_footer, clean_name, loc_slug, False)
    
    local_main_home = localized_replace(source_main, clean_name, loc_slug, False)
    
    if is_city:
        local_main_home = re.sub(r'(?s)<h1.*?>.*?</h1>', f'''
              <h1 class="text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 text-gray-900">
                Best Cleaning Services in <br>
                <span class="text-gradient">{clean_name}, FL</span>
              </h1>
    ''', local_main_home)
        local_main_home = re.sub(r'(?s)<p class="text-xl text-gray-600 mb-10 max-w-lg leading-relaxed">.*?</p>', f'''
              <p class="text-xl text-gray-600 mb-10 max-w-lg leading-relaxed">
                Leading house cleaning and professional maid services in {clean_name}, FL. We bring the sparkle back to your {clean_name} home.
              </p>
    ''', local_main_home)
    else:
        local_main_home = re.sub(r'(?s)<h1.*?>.*?</h1>', f'''
              <h1 class="text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 text-gray-900">
                Best Cleaners in <br>
                <span class="text-gradient">{clean_name}</span>
              </h1>
    ''', local_main_home)
        local_main_home = re.sub(r'(?s)<p class="text-xl text-gray-600 mb-10 max-w-lg leading-relaxed">.*?</p>', f'''
              <p class="text-xl text-gray-600 mb-10 max-w-lg leading-relaxed">
                Proudly serving {parent_city}, FL in the luxury {clean_name} neighborhood. We bring the sparkle back to your home.
              </p>
    ''', local_main_home)

    if n_links_html:
        local_main_home = local_main_home.replace("<!-- ================================================\n       AREAS & MAP", n_links_html + "\n<!-- ================================================\n       AREAS & MAP")

    title = f"Best House Cleaning Services in {clean_name}, FL | Top Rated & Reliable" if is_city else f"Top-Rated Cleaning Services in {clean_name}, {parent_city} FL"
    desc = f"Looking for the best house cleaning in {clean_name}? Sweet Maid provides top-rated, reliable, and affordable maid services. 100% Satisfaction Guaranteed."
    keywords = f"best house cleaning {clean_name}, top rated maid service {clean_name}, cleaning services {clean_name}"
    
    page_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <meta name="description" content="{desc}">
    <meta name="keywords" content="{keywords}">
    <link rel="canonical" href="https://sweetmaidcleaning.com/{loc_slug}/" />
    <meta property="og:url" content="https://sweetmaidcleaning.com/{loc_slug}/">
    <meta property="og:title" content="{title}">
    <meta property="og:description" content="{desc}">
    <meta property="og:image" content="https://i.ibb.co/QSD3Ydt/image.jpg">
    {localized_replace(source_head, clean_name, loc_slug, False)[0:0]} <!-- Empty for now to skip duplicate head elements -->
    {source_head}
    <script type="application/ld+json">
    {{
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Sweet Maid Cleaning Service - {clean_name}",
      "image": "https://i.ibb.co/QSD3Ydt/image.jpg",
      "telephone": "(941) 222-2080",
      "email": "info@sweetmaidcleaning.com",
      "address": {{
        "@type": "PostalAddress",
        "addressLocality": "{clean_name}",
        "addressRegion": "FL",
        "addressCountry": "US"
      }},
      "url": "https://sweetmaidcleaning.com/{loc_slug}/",
      "priceRange": "$$",
      "areaServed": {{
        "@type": "Place",
        "name": "{clean_name}, FL"
      }},
      "aggregateRating": {{
        "@type": "AggregateRating",
        "ratingValue": "5.0",
        "reviewCount": "150"
      }}
    }}
    </script>
</head>
<body class="antialiased">
    {local_header}
    {local_menu}
    {local_main_home}
    {local_footer}
    {source_scripts}
</body>
</html>"""
    create_page(f"{loc_slug}/index.html", page_html)

    #################
    # Inner Pages   #
    #################
    
    def render_inner_page(t_html, route):
        content = localized_replace(t_html, clean_name, loc_slug, True)
        create_page(f"{loc_slug}/{route}", content)

    if templates.get('about'):
        render_inner_page(templates['about'], 'about/index.html')
        
    if templates.get('gallery'):
        render_inner_page(templates['gallery'], 'gallery/index.html')

    for s in service_slugs:
        if templates.get(s):
            render_inner_page(templates[s], f'{s}/index.html')


# Run Generation
def process_city(item):
    city, neighborhoods = item
    city_slug = f"{city.lower().replace(' ', '-')}-fl"
    
    # 1. Generate City
    generate_location_pages(city, city_slug, neighborhoods, is_city=True)
    
    # 2. Generate all Neighborhoods inside that city
    for n in neighborhoods:
        n_slug = f"{n.lower().replace(' ', '-')}-fl"
        generate_location_pages(n, n_slug, None, is_city=False, parent_city=format_name(city))

print(f"Starting Extreme Generation for {len(florida_data)} Cities and all Neighborhoods...")
print("This will generate roughly 28 pages per location. Standby...")

# Process sequentially or multi-thread
with ThreadPoolExecutor(max_workers=16) as executor:
    executor.map(process_city, florida_data.items())

print("Extreme Mass Matrix Generation Complete!")
