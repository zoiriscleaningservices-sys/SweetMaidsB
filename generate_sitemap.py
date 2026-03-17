import os
import math
import html
from datetime import datetime

def generate_sitemap(root_dir, base_url):
    pages = []
    
    print(f"Scanning {root_dir} for index.html files...")
    
    # 1. Walk the directory
    for root, dirs, files in os.walk(root_dir):
        if 'index.html' in files:
            # Skip irrelevant folders
            if any(x in root.lower() for x in ['images', '.git', 'node_modules', '.gemini', 'brain', 'css', 'js']):
                continue
            
            # Get the relative path
            rel_path = os.path.relpath(root, root_dir)
            
            if rel_path == '.':
                # Root index.html
                url = base_url + "/"
                priority = "1.0"
            else:
                # Subdirectory index.html
                # Clean up path for URL (Windows uses \, URL uses /)
                clean_path = rel_path.replace(os.sep, '/')
                url = f"{base_url}/{clean_path}/"
                
                # Priority Logic
                if clean_path.endswith('-cleaning') or clean_path.endswith('-services'):
                    priority = "0.8"
                elif '/' not in clean_path:
                    if clean_path in ['about', 'services', 'blog', 'gallery', 'home']:
                        priority = "0.9"
                        if clean_path == 'home': priority = "1.0"
                    else:
                        priority = "0.9"
                else:
                    priority = "0.7"
            
            # Get last modified time
            file_path = os.path.join(root, 'index.html')
            try:
                lastmod = datetime.fromtimestamp(os.path.getmtime(file_path)).strftime('%Y-%m-%d')
            except:
                lastmod = datetime.now().strftime('%Y-%m-%d')
            
            pages.append({
                'loc': url,
                'lastmod': lastmod,
                'changefreq': 'weekly',
                'priority': priority
            })
            
    # Sort pages for deterministic sitemaps
    pages = sorted(pages, key=lambda x: x['loc'])
    
    total_urls = len(pages)
    print(f"Found {total_urls} pages.")
    
    # Google limits to 50,000 URLs per sitemap. Chunk at 40,000 for safety.
    CHUNK_SIZE = 40000
    num_chunks = math.ceil(total_urls / CHUNK_SIZE)
    
    if num_chunks <= 1 and total_urls <= 50000:
        # Single sitemap
        write_sitemap(os.path.join(root_dir, 'sitemap.xml'), pages)
        print(f"Sitemap generated with {total_urls} URLs in sitemap.xml.")
    else:
        # Multiple sitemaps + sitemap index
        index_lines = [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
        ]
        
        for i in range(num_chunks):
            chunk = pages[i*CHUNK_SIZE:(i+1)*CHUNK_SIZE]
            filename = f"sitemap{i+1}.xml"
            write_sitemap(os.path.join(root_dir, filename), chunk)
            
            index_lines.append('  <sitemap>')
            index_lines.append(f'    <loc>{base_url}/{filename}</loc>')
            index_lines.append(f'    <lastmod>{chunk[0]["lastmod"]}</lastmod>')
            index_lines.append('  </sitemap>')
            
        index_lines.append('</sitemapindex>')
        
        with open(os.path.join(root_dir, 'sitemap.xml'), 'w', encoding='utf-8') as f:
            f.write('\n'.join(index_lines))
            
        print(f"Generated Sitemap Index 'sitemap.xml' pointing to {num_chunks} sitemaps for {total_urls} total URLs.")

def write_sitemap(path, pages):
    xmlLines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    
    for page in pages:
        # Escape special characters for XML
        safe_loc = html.escape(page["loc"])
        xmlLines.append('  <url>')
        xmlLines.append(f'    <loc>{safe_loc}</loc>')
        xmlLines.append(f'    <lastmod>{page["lastmod"]}</lastmod>')
        xmlLines.append(f'    <changefreq>{page["changefreq"]}</changefreq>')
        xmlLines.append(f'    <priority>{page["priority"]}</priority>')
        xmlLines.append('  </url>')
        
    xmlLines.append('</urlset>')
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(xmlLines))

if __name__ == "__main__":
    generate_sitemap('.', 'https://sweetmaidcleaning.com')
