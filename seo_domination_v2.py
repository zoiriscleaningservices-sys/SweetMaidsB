import os
import re
import json
import random

ROOT_DIR = r"C:\Users\lucia\OneDrive\Desktop\SweetMaidsB"
CITIES_FILE = os.path.join(ROOT_DIR, "florida_all_cities.json")

# Load cities for internal linking
try:
    with open(CITIES_FILE, 'r', encoding='utf-8') as f:
        ALL_FLORIDA_CITIES = json.load(f)
except Exception as e:
    print(f"Error loading cities file: {e}")
    ALL_FLORIDA_CITIES = ["Tampa", "Miami", "Orlando", "Jacksonville", "Sarasota", "Bradenton", "Naples"]

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
    "home-watch-services": "HomeAndConstructionBusiness",
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
    "solar-panel-cleaning": "CleaningFee", # Fallback
    "gutter-cleaning": "RoofingContractor",
    "property-maintenance": "HomeAndConstructionBusiness",
    "airbnb-vacation-rental-management": "RealEstateAgent",
    "luxury-estate-management": "RealEstateAgent"
}

def generate_spun_content(service_name, location):
    # Synonyms and structures for spinning
    intros = [
        f"As the premier provider of <strong>{service_name}</strong> in <strong>{location}</strong> and surrounding regions, Sweet Maid is committed to delivering unparalleled cleanliness.",
        f"Sweet Maid stands out as the leading choice for <strong>{service_name}</strong> throughout <strong>{location}</strong>. We bring top-tier sanitation standards directly to your property.",
        f"When you need meticulous <strong>{service_name}</strong> in <strong>{location}</strong>, Sweet Maid is the undisputed industry leader, ensuring every corner of your space is pristine.",
        f"For residents and businesses seeking extreme detail, our <strong>{service_name}</strong> solutions in <strong>{location}</strong> represent the absolute gold standard in property care.",
        f"Recognized globally for our meticulous approach, Sweet Maid is proud to offer exceptional <strong>{service_name}</strong> to our neighbors here in <strong>{location}</strong>."
    ]
    
    bodies = [
        f"Whether your property sits in the bustling heart of downtown {location} or a quiet suburban street, our fully bonded and insured teams are ready. We customize our approach to meet the exact hygiene demands of {location} locals, delivering a consistently spotless environment.",
        f"Our trained specialists understand the unique environmental challenges of properties in {location}. Equipped with eco-friendly products and advanced techniques, we guarantee a flawless finish that {location} homeowners continually rely upon.",
        f"We don't just clean; we restore. From comprehensive sanitization to detailed touch-ups, our {location} crews treat your property with the utmost respect, guaranteeing a 5-star experience every single visit.",
        f"Living and working in {location} means you deserve an environment that promotes health and peace of mind. Our rigorous vetting process ensures that only the most qualified professionals enter your {location} home or business.",
        f"We believe that a clean space elevates your entire lifestyle. That's why our dedicated {location} personnel utilize military-grade precision and environmentally sustainable chemicals to protect your investment."
    ]
    
    outros = [
        f"Refuse to compromise on the appearance of your {location} property. Join thousands of thrilled clients who lean on our professional cleaners. <a href=\"#quote\" class=\"text-pink-500 font-semibold hover:text-pink-600 underline\">Secure your free {location} cleaning estimate now!</a>",
        f"Elevate your {location} space today. Experience the Sweet Maid difference and see why we are the top-rated cleaning company in the region. <a href=\"#quote\" class=\"text-pink-500 font-semibold hover:text-pink-600 underline\">Get your instant {location} quote right here.</a>",
        f"Don't let dust and grime dictate your comfort in {location}, FL. Reach out to our award-winning staff to schedule a consultation. <a href=\"#quote\" class=\"text-pink-500 font-semibold hover:text-pink-600 underline\">Claim your free {location} service quote today!</a>",
        f"Ready for a transformation? Let our {location} experts handle the mess while you enjoy your free time. <a href=\"#quote\" class=\"text-pink-500 font-semibold hover:text-pink-600 underline\">Request your personalized {location} cleaning quote today.</a>",
        f"Stop settling for average cleaning companies in {location}. Upgrade to the Sweet Maid standard of excellence. <a href=\"#quote\" class=\"text-pink-500 font-semibold hover:text-pink-600 underline\">Grab your fast, free {location} quote online.</a>"
    ]
    
    return f"""
      <!-- HYPER-LOCAL SEO BLOCK V2 -->
      <section class="py-12 bg-white border-t border-pink-50">
        <div class="max-w-4xl mx-auto px-6 text-center">
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-6 font-serif">Exceptional {service_name} in {location}, FL</h2>
            <p class="text-gray-600 leading-relaxed mb-4">
                {random.choice(intros)} {random.choice(bodies)}
            </p>
            <p class="text-gray-600 leading-relaxed">
                {random.choice(outros)}
            </p>
        </div>
      </section>
      <!-- END HYPER-LOCAL SEO BLOCK V2 -->
"""

def generate_nearby_links(current_location):
    # Pick 4 random cities that are NOT the current location
    available = [c for c in ALL_FLORIDA_CITIES if c.lower() != current_location.lower()]
    if not available:
        return ""
    
    nearby_cities = random.sample(available, min(4, len(available)))
    
    links_html = ""
    for city in nearby_cities:
        slug = f"/{city.lower().replace(' ', '-')}-fl/"
        links_html += f'<a href="{slug}" class="text-gray-500 hover:text-pink-400 text-sm transition-colors">{city}</a><span class="text-pink-200 mx-2 last:hidden">•</span>'

    return f"""
      <!-- LATERAL SEO CROSS-LINKS -->
      <div class="bg-gray-50 py-6 border-t border-pink-50">
        <div class="max-w-7xl mx-auto px-6 text-center">
            <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Explore Nearby Cleaning Service Areas</h4>
            <div class="flex flex-wrap justify-center items-center">
                {links_html}
            </div>
        </div>
      </div>
      <!-- END LATERAL SEO CROSS-LINKS -->
"""

def generate_schema(service_name, location, canonical_url, schema_type):
    # Generates extreme schema payload
    return f"""
  <script type="application/ld+json">
  {{
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "{schema_type}"],
    "name": "Sweet Maid Cleaning Service - {service_name} in {location}",
    "image": "https://i.ibb.co/QSD3Ydt/image.jpg",
    "sameAs": [
        "https://www.facebook.com/sweetmaidcleaning",
        "https://www.instagram.com/sweetmaidcleaning"
    ],
    "telephone": "(941) 222-2080",
    "email": "info@sweetmaidcleaning.com",
    "address": {{
      "@type": "PostalAddress",
      "addressLocality": "{location}",
      "addressRegion": "FL",
      "addressCountry": "US"
    }},
    "url": "{canonical_url}",
    "priceRange": "$$",
    "openingHoursSpecification": [
      {{
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:00",
        "closes": "18:00"
      }},
      {{
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "09:00",
        "closes": "16:00"
      }}
    ],
    "areaServed": {{
      "@type": "Place",
      "name": "{location}, FL"
    }},
    "aggregateRating": {{
      "@type": "AggregateRating",
      "ratingValue": "{round(random.uniform(4.8, 5.0), 1)}",
      "reviewCount": "{random.randint(150, 450)}"
    }}
  }}
  </script>
  <script type="application/ld+json">
  {{
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {{
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://sweetmaidcleaning.com/"
      }},
      {{
        "@type": "ListItem",
        "position": 2,
        "name": "{location} Cleaning Services",
        "item": "{canonical_url}"
      }}
    ]
  }}
  </script>
  <script type="application/ld+json">
  {{
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {{
        "@type": "Question",
        "name": "Why is Sweet Maid the top-rated {service_name} provider in {location}?",
        "acceptedAnswer": {{
          "@type": "Answer",
          "text": "Our team of local {location} cleaners employs eco-friendly products, rigorous quality checks, and top-tier customer service to absolutely guarantee your satisfaction."
        }}
      }},
      {{
        "@type": "Question",
        "name": "How much does {service_name} cost near me in {location}, FL?",
        "acceptedAnswer": {{
          "@type": "Answer",
          "text": "Pricing for {service_name} in {location} is highly competitive and depends on the square footage and specific requirements of your property. Reach out for a fast, free estimate."
        }}
      }}
    ]
  }}
  </script>
"""

def optimize_images(content, location, service_name):
    # Add loading="lazy" and localized alt texts to images that don't already have them perfectly mapped
    # A bit dangerous with massive regex, so we do targeted replacements for core patterns.
    
    # Simple injection of lazy loading if not present
    # We find <img ...>
    def inject_lazy_alt(match):
        img_tag = match.group(0)
        
        # Don't lazy load the hero image or logo (usually early in the DOM, but difficult to detect safely here without beautifulsoup)
        if "id=\"heroImage\"" in img_tag or "logo" in img_tag.lower():
            return img_tag

        # Add loading lazy
        if "loading=" not in img_tag:
            img_tag = img_tag.replace("<img ", "<img loading=\"lazy\" ")
            
        # Enhance alt tag if it exists but is generic
        if "alt=" in img_tag:
            # We skip extreme alt replacement if it already seems highly descriptive, but we'll append the location
            if location not in img_tag and "cleaning" in img_tag.lower():
                img_tag = re.sub(r'alt="([^"]*)"', f'alt="\\1 - {location}, FL"', img_tag)
        else:
            img_tag = img_tag.replace("<img ", f'<img alt="Professional {service_name} in {location}, FL" ')
            
        return img_tag

    return re.sub(r'<img\s+[^>]*>', inject_lazy_alt, content)

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
    
    # Determine Context
    location = ""
    service_slug = ""
    
    if "-cleaning" in folder_name and ("-cleaning" in parent_folder or "-fl" in parent_folder):
        location = parent_folder.replace("-cleaning", "").replace("-fl", "").replace("-", " ").title()
        service_slug = folder_name
    elif "-fl" in folder_name or "-cleaning" in folder_name:
        location = folder_name.replace("-cleaning", "").replace("-fl", "").replace("-", " ").title()
        service_slug = "house-cleaning"
    else:
        # Fallback or root (we shouldn't process root with this extreme script natively unless needed)
        location = folder_name.replace("-", " ").title()
        service_slug = "house-cleaning"
        
    if not location or location.lower() == "home":
        location = "Bradenton"
        
    service_name = service_slug.replace("-", " ").title()
    schema_type = SERVICES_MAP.get(service_slug, "LocalBusiness")
    
    # Build Canonical
    if parent_folder != "SweetMaidsB" and parent_folder != "home":
        canonical = f"https://sweetmaidcleaning.com/{parent_folder}/{folder_name}/"
    else:
        canonical = f"https://sweetmaidcleaning.com/{folder_name}/"
    canonical = canonical.replace("//", "/").replace("https:/", "https://")

    # 1. Clean existing Schemas and Old Hyper Local Block
    content = re.sub(r'<script\s+type=["\']application/ld\+json["\']>.*?</script>', "", content, flags=re.DOTALL)
    content = re.sub(r'<!-- HYPER-LOCAL SEO BLOCK -->.*?<!-- END HYPER-LOCAL SEO BLOCK -->', "", content, flags=re.DOTALL)
    content = re.sub(r'<!-- HYPER-LOCAL SEO BLOCK V2 -->.*?<!-- END HYPER-LOCAL SEO BLOCK V2 -->', "", content, flags=re.DOTALL)
    content = re.sub(r'<!-- LATERAL SEO CROSS-LINKS -->.*?<!-- END LATERAL SEO CROSS-LINKS -->', "", content, flags=re.DOTALL)

    # 2. Inject Fresh Schema
    new_schema = generate_schema(service_name, location, canonical, schema_type)
    content = re.sub(r'(?i)</head>', f"{new_schema}\n</head>", content)
    
    # 3. Inject Spun Content Block
    spun_content = generate_spun_content(service_name, location)
    if re.search(r'(?i)<footer', content):
        content = re.sub(r'(?i)(<footer)', f"{spun_content}\n\\1", content)
        
    # 4. Inject Cross-Linking
    cross_links = generate_nearby_links(location)
    if re.search(r'(?i)<footer', content):
        content = re.sub(r'(?i)(<footer)', f"{cross_links}\n\\1", content)
        
    # 5. Image Lazy-Load and Alt Tag Enhancement
    content = optimize_images(content, location, service_name)
    
    # Write back
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def run():
    print("Starting SEO Domination 2.0...")
    target_dirs = []
    
    # Crawl level 1 and level 2 for local silos
    for item in os.listdir(ROOT_DIR):
        item_path = os.path.join(ROOT_DIR, item)
        if os.path.isdir(item_path) and ("-fl" in item.lower() or "-cleaning" in item.lower()):
            target_dirs.append(item_path)
            
            # Check for sub-services
            for sub in os.listdir(item_path):
                sub_path = os.path.join(item_path, sub)
                if os.path.isdir(sub_path):
                    target_dirs.append(sub_path)
                    
    print(f"Discovered {len(target_dirs)} potential target directories. Modifying...")
    
    modified_count = 0
    for directory in target_dirs:
        index_file = os.path.join(directory, "index.html")
        if os.path.exists(index_file):
            if process_file(index_file):
                modified_count += 1
                if modified_count % 1000 == 0:
                    print(f"Processed {modified_count} files...")
                    
    print(f"COMPLETED. Modified {modified_count} static pages with extreme SEO logic.")

if __name__ == "__main__":
    run()
