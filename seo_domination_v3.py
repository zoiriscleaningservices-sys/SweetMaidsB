import os
import re
import json
import random
import glob

ROOT_DIR = r"C:\Users\lucia\OneDrive\Desktop\SweetMaidsB"

# Advanced Service Taxonomy for deep spinning
SERVICE_TAXONOMY = {
    "house-cleaning": {
        "keywords": ["residential cleaning", "maid service", "home cleaners", "domestic hygiene", "housekeeping", "regular maid service"],
        "schema": "HouseCleaning",
    },
    "deep-cleaning": {
        "keywords": ["intensive sanitization", "spring cleaning", "detailed property scrubbing", "thorough deep clean", "top-to-bottom cleaning", "baseboard and blind detailing"],
        "schema": "HouseCleaning",
    },
    "move-in-out-cleaning": {
        "keywords": ["end of tenancy clean", "relocation sanitization", "turnkey moving service", "deposit recovery cleaning", "empty home cleaning", "new home presentation"],
        "schema": "HouseCleaning",
    },
    "airbnb-cleaning": {
        "keywords": ["vacation rental turnover", "short-term rental maintenance", "guest-ready sanitization", "five-star host cleaning", "bnb management", "rapid turnover service"],
        "schema": "HouseCleaning",
    },
    "luxury-estate-cleaning": {
        "keywords": ["high-end property preservation", "mansion care", "bespoke estate detailing", "white-glove housekeeping", "fine interior sanitization"],
        "schema": "HouseCleaning",
    },
    "commercial-cleaning": {
        "keywords": ["corporate facility management", "workspace sanitization", "business sanitation", "office building maintenance", "enterprise hygiene solutions"],
        "schema": "CommercialCleaning",
    },
    "office-janitorial-services": {
        "keywords": ["nightly janitorial sweeps", "workspace trash removal", "corporate restroom sanitization", "professional desk cleaning", "daily office upkeep"],
        "schema": "CommercialCleaning",
    },
    "post-construction-cleaning": {
        "keywords": ["builder dust removal", "post-renovation polishing", "contractor site cleanup", "debris clearing", "new build detailing"],
        "schema": "CommercialCleaning",
    },
    "carpet-cleaning": {
        "keywords": ["deep steam extraction", "stain and odor removal", "upholstery washing", "rug revitalization", "professional fabric care"],
        "schema": "CarpetCleaning",
    },
    "pressure-washing": {
        "keywords": ["exterior power washing", "driveway concrete cleaning", "siding soft wash", "patio grime removal", "exterior property restoration"],
        "schema": "PressureWashing",
    },
    "window-cleaning": {
        "keywords": ["streak-free glass washing", "exterior pane detailing", "skylight polishing", "screen and track cleaning", "crystal clear windows"],
        "schema": "WindowCleaning",
    }
}

# Fallback generic keywords if service is unmapped
GENERIC_KEYWORDS = ["professional sanitation", "top-rated service", "expert local crew", "trusted professionals"]

def get_service_data(service_slug):
    if service_slug in SERVICE_TAXONOMY:
        return SERVICE_TAXONOMY[service_slug]
    return {
        "keywords": GENERIC_KEYWORDS,
        "schema": "LocalBusiness"
    }

def generate_spun_seo_meta(service_name, location, location_state, service_data):
    # Dynamic Title Generation
    title_structures = [
        f"#{random.randint(1,3)} Rated {service_name} in {location}, {location_state} | Sweet Maid",
        f"Best {service_name} {location} {location_state} | Top Rated & Reliable",
        f"Expert {service_name} in {location} | Affordable & Trusted",
        f"{location}'s Premier {service_name} | Guaranteed Satisfaction",
        f"Top {service_name} Near Me in {location}, {location_state} | Book Today"
    ]
    title = random.choice(title_structures)

    # Dynamic Description Generation
    desc_intros = [
        f"Searching for the absolute best {service_name} in {location}, {location_state}?",
        f"Need reliable {service_name} near {location}?",
        f"Sweet Maid is {location}'s top-rated provider of expert {service_name}."
    ]
    
    kw1, kw2 = random.sample(service_data["keywords"], 2)
    desc_bodies = [
        f"We specialize in {kw1} and {kw2}. Our licensed and insured crews guarantee 100% satisfaction.",
        f"From affordable {kw1} to premium {kw2}, our local cleaners deliver flawless results.",
        f"Offering highly-rated {kw1} for all properties. Fully vetted professionals, transparent pricing, and instant booking."
    ]
    
    desc_outros = [
        "Request your free quote today!",
        "Secure your property's shine now.",
        "Book online in under 60 seconds."
    ]
    
    description = f"{random.choice(desc_intros)} {random.choice(desc_bodies)} {random.choice(desc_outros)}"

    # Dynamic H1
    h1_options = [
        f"Elite {service_name} in <br><span class=\"text-gradient\">{location}, {location_state}</span>",
        f"Top-Rated {service_name} in <br><span class=\"text-gradient\">{location}</span>",
        f"The Best {service_name} in <br><span class=\"text-gradient\">{location}, {location_state}</span>",
        f"Award-Winning {service_name} <br><span class=\"text-gradient\">{location}</span>"
    ]
    h1_text = random.choice(h1_options)

    return title, description, h1_text

def replace_head_seo(content, new_title, new_desc):
    # Rip out old Title
    content = re.sub(r'(?si)<title>.*?</title>', f"<title>{new_title}</title>", content)
    # Rip out old Description
    content = re.sub(r'(?si)<meta\s+name=["\']description["\']\s+content=["\'].*?["\'].*?>', f'<meta name="description" content="{new_desc}" />', content)
    # OG Title update
    content = re.sub(r'(?si)<meta\s+property=["\']og:title["\']\s+content=["\'].*?["\'].*?>', f'<meta property="og:title" content="{new_title}">', content)
    # Ensure OG description isn't generic
    content = re.sub(r'(?si)<meta\s+property=["\']og:description["\']\s+content=["\'].*?["\'].*?>', f'<meta property="og:description" content="{new_desc}">', content)
    return content

def process_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        return False
        
    original = content
    
    folder_name = os.path.basename(os.path.dirname(filepath))
    parent_folder = os.path.basename(os.path.dirname(os.path.dirname(filepath)))
    
    # Determine Context safely using exact splits
    location = ""
    service_slug = ""
    
    # 3 options:
    # 1: root/home/index.html
    # 2: root/bradenton-cleaning/index.html (or bradenton-fl)
    # 3: root/bradenton-cleaning/house-cleaning/index.html (or bradenton-fl/house-cleaning)
    
    # Sanitize inputs
    if folder_name.lower() in ["home", "sweetmaidsb"]:
        location = "Bradenton"
        service_slug = "house-cleaning"
    
    # If the parent folder contains the location string (-cleaning or -fl)
    elif "-cleaning" in parent_folder.lower() or "-fl" in parent_folder.lower():
        location = parent_folder.lower().replace("-cleaning", "").replace("-fl", "").replace("-", " ").title()
        service_slug = folder_name.lower() # e.g. house-cleaning
        
    # If the folder itself is the location string (the city hub page)
    elif "-cleaning" in folder_name.lower() or "-fl" in folder_name.lower():
        location = folder_name.lower().replace("-cleaning", "").replace("-fl", "").replace("-", " ").title()
        service_slug = "house-cleaning" # Default for the hub pages

    else:
        # Fallback
        location = "Bradenton"
        service_slug = "house-cleaning"
        
    if not location:
        location = "Bradenton"
        
    service_name = service_slug.replace("-", " ").title()
    service_data = get_service_data(service_slug)
    
    # Generate Spun Meta Output
    title, desc, h1 = generate_spun_seo_meta(service_name, location, "FL", service_data)
    
    # 1. Update Head
    content = replace_head_seo(content, title, desc)
    
    # 2. Update H1 in Hero section
    # Usually it looks like: <h1 class="...">Best Cleaning Services in <br> <span class="text-gradient">Tampa, FL</span> </h1>
    content = re.sub(r'(?si)<h1([^>]*)>.*?</h1>', f'<h1\\1>{h1}</h1>', content, count=1) 
    
    # Optional enhancement: update the paragraph under the H1 to include the specific keywords 
    kw1, kw2 = random.sample(service_data["keywords"], 2)
    hero_p_replacement = f"Leading provider of <strong>{service_name} in {location} fl</strong>. We specialize in {kw1} and {kw2}. Looking for the best <strong>{location} {service_name}</strong>? You found us! We deliver guaranteed <strong>{service_name} {location} fl</strong>."
    
    content = re.sub(r'(?si)<p class="text-xl text-gray-600 mb-10 max-w-lg leading-relaxed">.*?</p>', f'<p class="text-xl text-gray-600 mb-10 max-w-lg leading-relaxed">{hero_p_replacement}</p>', content, count=1)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def run():
    print("Starting SEO Domination V3 DRY RUN (Limits to 5 random files)...")
    target_dirs = []
    
    for item in os.listdir(ROOT_DIR):
        item_path = os.path.join(ROOT_DIR, item)
        if os.path.isdir(item_path) and ("-fl" in item.lower() or "-cleaning" in item.lower()):
            target_dirs.append(item_path)
            
            for sub in os.listdir(item_path):
                sub_path = os.path.join(item_path, sub)
                if os.path.isdir(sub_path):
                    target_dirs.append(sub_path)
                    
    print(f"Discovered {len(target_dirs)} potential target directories. Starting modification...")
    
    modified_count = 0
    for directory in target_dirs:
        index_file = os.path.join(directory, "index.html")
        if os.path.exists(index_file):
            if process_file(index_file):
                modified_count += 1
                if modified_count % 1000 == 0:
                    print(f"Processed {modified_count} static pages with SEO spinning...")
                
    print(f"COMPLETED. Modified {modified_count} static pages with V3 Spun Content.")

if __name__ == "__main__":
    run()
