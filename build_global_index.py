import json
import re

# File paths
CITIES_FILE = r'C:\Users\lucia\OneDrive\Desktop\SweetMaidsB\florida_all_cities.json'
TEMPLATE_FILE = r'C:\Users\lucia\OneDrive\Desktop\SweetMaidsB\home\index.html'
OUTPUT_FILE = r'C:\Users\lucia\OneDrive\Desktop\SweetMaidsB\index.html'

def generate_global_index():
    # Load cities
    try:
        with open(CITIES_FILE, 'r', encoding='utf-8') as f:
            cities = json.load(f)
            # Sort alphabetically
            cities.sort()
    except Exception as e:
        print(f"Error reading cities file: {e}")
        return

    # Load template
    try:
        with open(TEMPLATE_FILE, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading template file: {e}")
        return

    # --- UPDATING METADATA & HERO ---
    
    # 1. Update Title and Meta Tags
    content = re.sub(r'<title>.*?</title>', '<title>#1 Rated Cleaning Service In Your Area | Sweet Maid Cleaning</title>', content)
    content = re.sub(r'<meta property="og:title" content=".*?">', '<meta property="og:title" content="#1 Rated Cleaning Service In Your Area | Sweet Maid Cleaning">', content)
    
    desc = "Looking for the best cleaning service near you? Sweet Maid offers top-rated house cleaning, deep cleaning, and move-out services across Florida. Licensed, insured, and 100% satisfaction guaranteed. Book your sparkle today!"
    content = re.sub(r'<meta name="description"\s+content="[^"]*"', f'<meta name="description"\n    content="{desc}"', content)
    
    keywords = "best cleaning service florida, top rated maids, house cleaning near me, local cleaners, residential cleaning, move out cleaning"
    content = re.sub(r'<meta name="keywords"\s+content="[^"]*"', f'<meta name="keywords"\n    content="{keywords}"', content)

    # 2. Update Top Bar and Hero text
    content = content.replace("Rated Cleaning Service in Bradenton", "Rated Cleaning Service In Your Area")
    content = content.replace("Florida's Top-Rated", "Your Area's Top-Rated")
    content = content.replace("Bradenton's Top-Rated", "Your Area's Top-Rated")
    content = content.replace("For Bradenton & Surrounding Areas", "For Your Local Area")
    
    content = content.replace("Best House Cleaning Services in Bradenton", "Best Cleaning Services in Your Area")
    content = content.replace("Bradenton, FL", "Florida") 
    content = content.replace("Best Cleaning Services in <br>\n            <span class=\"text-gradient\">Florida</span>", "Best Cleaning Services in <br>\n            <span class=\"text-gradient\">Your Area</span>")

    # 3. Fix the "Home" link to point to absolute root "/" (Since this is the global index)
    content = re.sub(r'<a href="#" onclick="window.scrollTo\(\{top: 0, behavior: \'smooth\'\}\); return false;"(.*?>Home</a>)', r'<a href="/"\1', content)

    # --- BUILD THE GLOBAL SEARCH UI ---
    # Constructing a beautiful, interactive search bar to replace the old Hero Buttons and City Grid
    
    cities_json_string = json.dumps(cities)

    search_html = f"""
          <div class="mt-8 relative w-full max-w-2xl" id="global-search-container">
            <h3 class="text-xl font-bold text-gray-800 mb-4 drop-shadow-sm">Find Services In Your City:</h3>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i class="fa-solid fa-magnifying-glass text-pink-400 group-focus-within:text-pink-600 transition-colors"></i>
              </div>
              <input type="text" id="global-city-search" autocomplete="off" placeholder="Type your city (e.g., Miami, Tampa...)" 
                class="w-full pl-12 pr-4 py-4 md:py-5 border-2 border-pink-100 rounded-2xl text-lg md:text-xl text-gray-800 focus:outline-none focus:ring-4 focus:ring-pink-200 focus:border-pink-400 shadow-xl transition-all font-medium placeholder:text-gray-400">
              
              <!-- Clean Input Button -->
              <button id="clear-search" class="absolute inset-y-0 right-0 pr-4 flex items-center hidden hover:text-pink-600 text-gray-400 transition-colors">
                <i class="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            
            <!-- Floating Autocomplete Dropdown -->
            <div id="search-dropdown" class="absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-xl border border-pink-100 rounded-2xl shadow-2xl max-h-80 overflow-y-auto hidden overscroll-contain transform origin-top transition-all scale-95 opacity-0">
              <ul id="search-results" class="py-2">
                <!-- Javascript will populate <li> elements here dynamically -->
              </ul>
            </div>
            
            <p class="text-sm text-gray-500 font-medium mt-3 flex items-center gap-2">
              <i class="fa-solid fa-bolt text-yellow-400"></i> Serving <span class="font-bold text-gray-800">{len(cities)}</span> locations across Florida
            </p>
          </div>

          <!-- Interactive Search Script -->
          <script>
            document.addEventListener('DOMContentLoaded', () => {{
                const searchInput = document.getElementById('global-city-search');
                const searchDropdown = document.getElementById('search-dropdown');
                const searchResults = document.getElementById('search-results');
                const clearSearch = document.getElementById('clear-search');
                
                // Load all Florida cities statically from the generator 
                const allCities = {cities_json_string};
                
                function formatSlug(cityName) {{
                    return "/" + cityName.toLowerCase().replace(/\s+/g, '-') + "-fl/";
                }}

                function renderResults(matches) {{
                    searchResults.innerHTML = '';
                    
                    if (matches.length === 0) {{
                        searchResults.innerHTML = '<li class="px-6 py-4 text-gray-500 text-center italic">No cities found. Try another search.</li>';
                    }} else {{
                        matches.forEach(city => {{
                            const li = document.createElement('li');
                            const a = document.createElement('a');
                            a.href = formatSlug(city);
                            // Highlight matching text logic
                            const regex = new RegExp(`(${{searchInput.value}})`, 'gi');
                            const highlightedCity = city.replace(regex, '<span class="text-pink-500 font-bold">$1</span>');
                            
                            a.innerHTML = `<div class="flex items-center gap-3"><i class="fa-solid fa-location-dot text-pink-300"></i> ${{highlightedCity}}</div> <i class="fa-solid fa-chevron-right text-gray-300 text-sm group-hover:translate-x-1 transition-transform"></i>`;
                            a.className = "flex items-center justify-between px-6 py-3 hover:bg-pink-50 text-gray-800 text-lg transition-colors cursor-pointer border-b border-gray-50 last:border-0 group";
                            
                            li.appendChild(a);
                            searchResults.appendChild(li);
                        }});
                    }}
                    
                    // Show dropdown with animation
                    searchDropdown.classList.remove('hidden');
                    // Tiny delay to allow display:block to apply before animating opacity
                    setTimeout(() => {{
                        searchDropdown.classList.remove('scale-95', 'opacity-0');
                        searchDropdown.classList.add('scale-100', 'opacity-100');
                    }}, 10);
                }}

                searchInput.addEventListener('input', (e) => {{
                    const query = e.target.value.toLowerCase().trim();
                    
                    if (query.length > 0) {{
                        clearSearch.classList.remove('hidden');
                        // Filter cities that START WITH or INCLUDES the query (Prioritize starts with)
                        const startsWith = allCities.filter(city => city.toLowerCase().startsWith(query));
                        const includes = allCities.filter(city => city.toLowerCase().includes(query) && !city.toLowerCase().startsWith(query));
                        
                        // Limit to top 20 results for performance
                        let matches = [...startsWith, ...includes].slice(0, 20);
                        renderResults(matches);
                    }} else {{
                        clearSearch.classList.add('hidden');
                        searchDropdown.classList.add('scale-95', 'opacity-0');
                        searchDropdown.classList.remove('scale-100', 'opacity-100');
                        setTimeout(() => searchDropdown.classList.add('hidden'), 200);
                    }}
                }});

                // Clear button logic
                clearSearch.addEventListener('click', () => {{
                    searchInput.value = '';
                    searchInput.focus();
                    clearSearch.classList.add('hidden');
                    searchDropdown.classList.add('scale-95', 'opacity-0');
                    searchDropdown.classList.remove('scale-100', 'opacity-100');
                    setTimeout(() => searchDropdown.classList.add('hidden'), 200);
                }});

                // Close dropdown when clicking outside
                document.addEventListener('click', (e) => {{
                    if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {{
                        searchDropdown.classList.add('scale-95', 'opacity-0');
                        searchDropdown.classList.remove('scale-100', 'opacity-100');
                        setTimeout(() => searchDropdown.classList.add('hidden'), 200);
                    }}
                }});
                
                // Show dropdown again if input is focused and has text
                searchInput.addEventListener('focus', () => {{
                    if (searchInput.value.trim().length > 0) {{
                        searchDropdown.classList.remove('hidden');
                        setTimeout(() => {{
                            searchDropdown.classList.remove('scale-95', 'opacity-0');
                            searchDropdown.classList.add('scale-100', 'opacity-100');
                        }}, 10);
                    }}
                }});
            }});
          </script>
"""

    # 4. Inject Search into Hero, replacing the "Get Quote / View Services" buttons and subsequent badge
    hero_pattern = r'<div class="flex flex-col sm:flex-row gap-4">.*?</div>\s*<div class="mt-12 flex items-center gap-8 text-gray-500 text-sm font-medium">.*?</div>'
    
    # We must replace \ with \\ in the replacement string to prevent re.sub from parsing escapes
    safe_search_html = search_html.replace('\\', '\\\\')

    if re.search(hero_pattern, content, flags=re.DOTALL):
        content = re.sub(hero_pattern, safe_search_html, content, flags=re.DOTALL)
    else:
        print("Warning: Could not find exactly hero button block to replace. Attempting fallback replacement.")
        # Fallback - find just the button div
        fallback_pattern = r'<div class="flex flex-col sm:flex-row gap-4">.*?</div>'
        content = re.sub(fallback_pattern, safe_search_html, content, flags=re.DOTALL)

    # 5. REMOVE the old "Areas We Serve" grid entirely
    old_areas_pattern = r'<!-- Areas Section -->.*?</section>'
    if re.search(old_areas_pattern, content, flags=re.DOTALL):
        content = re.sub(old_areas_pattern, '', content, flags=re.DOTALL)
    
    # Also remove our dynamically generated grid from the previous build script if it exists
    old_grid_pattern = r'<!-- Global Areas Section -->.*?</section>'
    if re.search(old_grid_pattern, content, flags=re.DOTALL):
        content = re.sub(old_grid_pattern, '', content, flags=re.DOTALL)

    # Write the output file
    try:
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Successfully generated sleek search index at: {OUTPUT_FILE}")
        print(f"Total cities integrated into autocomplete: {len(cities)}")
    except Exception as e:
        print(f"Error writing output file: {e}")

if __name__ == "__main__":
    generate_global_index()
