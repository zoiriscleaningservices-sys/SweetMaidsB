import urllib.request
import json
import time

with open('florida_matrix.json', 'r') as f:
    florida_matrix_old = json.load(f)

# keys are the 450+ cities in florida
all_cities = list(florida_matrix_old.keys())

results = {}

major_cities = [
    'Miami', 'Tampa', 'Orlando', 'Jacksonville', 'St. Petersburg', 'Sarasota',
    'Fort Lauderdale', 'Tallahassee', 'Boca Raton', 'West Palm Beach', 'Gainesville',
    'Bradenton', 'Naples', 'Clearwater', 'Miami Beach', 'Hollywood', 'Pensacola',
    'Cape Coral', 'Port St. Lucie', 'Hialeah', 'Pembroke Pines', 'Miramar', 'Coral Springs',
    'Pompano Beach', 'Miami Gardens', 'Port Charlotte', 'Jupiter', 'Delray Beach',
    'Lakeland', 'Daytona Beach', 'Kissimmee', 'Boynton Beach'
]

def fetch_wiki_category(cat):
    url = f'https://en.wikipedia.org/w/api.php?action=query&list=categorymembers&cmtitle={cat}&cmlimit=500&format=json'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            return data.get('query', {}).get('categorymembers', [])
    except Exception as e:
        print(f"Error fetching {cat}: {e}")
        return []

for city in all_cities:
    city_str = city.replace(" ", "_")
    neighborhoods = []
    
    if city in major_cities:
        # Try both '_Florida' and without
        members = fetch_wiki_category(f'Category:Neighborhoods_in_{city_str},_Florida')
        if not members:
            members = fetch_wiki_category(f'Category:Neighborhoods_in_{city_str}')
            
        for c in members:
            title = c['title']
            if not title.startswith('Category:') and not title.startswith('Template:') and not title.startswith('List '):
                clean_title = title.split(',')[0].strip()
                if clean_title not in neighborhoods:
                    neighborhoods.append(clean_title)
                    
        time.sleep(0.1) # Rate limit protection
        
    results[city] = neighborhoods

with open('florida_neighborhoods.json', 'w') as f:
    json.dump(results, f, indent=4)
    
print(f'Done. Total cities: {len(results)}. Cities with neighborhoods: {sum(1 for v in results.values() if v)}')
