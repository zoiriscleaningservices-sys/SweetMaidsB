import os
import re

home_file = r"c:\Users\lucia\OneDrive\Desktop\SweetMaidsB\home\index.html"
target_file = r"c:\Users\lucia\OneDrive\Desktop\SweetMaidsB\bradenton-fl\index.html"

with open(home_file, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update logo links to stay on page
content = content.replace('href="#" onclick="window.scrollTo({top: 0, behavior: \'smooth\'}); return false;"', 'href="/bradenton-fl/"')

# Wait, we want the logo to scroll to top? The user's prompt originally said "fix Logo Links across all other pages - modify the logo <a> tag to use href=\"#\" onclick=\"window.scrollTo...". 
# But for the *new* bradenton-fl home page, scrolling to top is fine too! 
# Let's keep it as is.

# 2. Fix the service links
services = [
    "airbnb-cleaning", "airbnb-vacation-rental-management", "carpet-cleaning", 
    "church-worship-center-cleaning", "commercial-cleaning", "deep-cleaning", 
    "floor-stripping-waxing", "gutter-cleaning", "gym-fitness-center-cleaning", 
    "home-watch-services", "house-cleaning", "industrial-warehouse-cleaning", 
    "janitorial-cleaning-services", "luxury-estate-cleaning", "luxury-estate-management", 
    "medical-dental-facility-cleaning", "move-in-out-cleaning", "office-janitorial-services", 
    "post-construction-cleaning", "pressure-washing", "property-maintenance", 
    "property-management-janitorial", "school-daycare-cleaning", "solar-panel-cleaning", 
    "window-cleaning"
]

for srv in services:
    # replace href="/service/" with href="/bradenton-fl/service/"
    content = content.replace(f'href="/{srv}/"', f'href="/bradenton-fl/{srv}/"')

# also fix gallery and about
content = content.replace('href="/about/"', 'href="/bradenton-fl/about/"')
content = content.replace('href="/gallery/"', 'href="/bradenton-fl/gallery/"')

# 3. Add the All Services grid before the Reviews section
services_grid = """
  <!-- ================================================
     ALL SERVICES 
=============================================== -->
  <section overflow-hidden id="all-services" class="py-24 bg-white relative">
    <div class="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
      <div class="text-center mb-16" data-aos="fade-up">
        <span class="text-pink-300 font-bold tracking-widest uppercase text-xs">Complete Cleaning Solutions</span>
        <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-6">All Services We Offer in Bradenton</h2>
        <p class="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
          Explore our full range of 25+ professional cleaning and property management services.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-aos="fade-up" data-aos-delay="100">
"""

def format_name(key):
    # e.g. "airbnb-vacation-rental-management" -> "Airbnb Vacation Rental Management"
    return " ".join([word.capitalize() for word in key.split("-")])

for srv in services:
    name = format_name(srv).replace(" And ", " & ").replace("In Out", "In/Out")
    services_grid += f"""
        <a href="/bradenton-fl/{srv}/" class="group flex items-center p-5 bg-slate-50 rounded-2xl border border-pink-50 hover:border-pink-300 hover:shadow-lg transition-all transform hover:-translate-y-1">
          <div class="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-500 mr-4 group-hover:bg-pink-300 group-hover:text-white transition-colors">
            <i class="fa-solid fa-sparkles"></i>
          </div>
          <span class="text-base font-bold text-gray-800 group-hover:text-pink-600 transition-colors">{name}</span>
        </a>
"""

services_grid += """
      </div>
    </div>
  </section>
"""

# Find where to inject (right before reviews)
insert_marker = "<!-- ================================================\n     REVIEWS\n=============================================== -->"
if insert_marker in content:
    content = content.replace(insert_marker, services_grid + "\n" + insert_marker)
else:
    print("Warning: Could not find Reviews marker to insert All Services.")

with open(target_file, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Successfully migrated home/index.html to {target_file}")
