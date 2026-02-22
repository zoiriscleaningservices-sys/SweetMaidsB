import os
import math
from datetime import datetime

def generate_sitemap(root_dir, base_url):
    pages = []
    
    # 1. Walk the directory
    for root, dirs, files in os.walk(root_dir):
        if 'index.html' in files:
            # Skip images, git, and other irrelevant folders
            if any(x in root for x in ['images', '.git', 'node_modules', '.gemini']):
                continue
            
            # Get the relative path
            rel_path = os.path.relpath(root, root_dir)
            
            if rel_path == '.':
                # Root index.html
                url = base_url + "/"
                priority = "1.0"
            else:
                # Subdirectory index.html
                # Clean up path for URL
                clean_path = rel_path.replace('\\\\', '/').replace('\\\\', '/')
                url = f"{base_url}/{clean_path}/"
                
                # Dynamic priority calculation
                if clean_path in ['about', 'services', 'blog', 'gallery']:
                    priority = "0.9" # Main supplementary pages
                elif clean_path.count('/') == 0:
                    priority = "0.8" # City Hubs / Master Location pages
                elif clean_path.count('/') == 1:
                    priority = "0.7" # Service pages under City Hubs
                else:
                    priority = "0.6" # Deep supplementary pages
            
            # Get last modified time
            file_path = os.path.join(root, 'index.html')
            lastmod = datetime.fromtimestamp(os.path.getmtime(file_path)).strftime('%Y-%m-%d')
            
            pages.append({
                'loc': url,
                'lastmod': lastmod,
                'changefreq': 'weekly',
                'priority': priority
            })
            
    # Sort pages for deterministic sitemaps
    pages = sorted(pages, key=lambda x: x['loc'])
    
    # Google limits to 50,000 URLs per sitemap. Chunk at 45,000 for safety.
    CHUNK_SIZE = 45000
    num_chunks = math.ceil(len(pages) / CHUNK_SIZE)
    
    if num_chunks <= 1:
        # Single sitemap
        write_sitemap(os.path.join(root_dir, 'sitemap.xml'), pages)
        print(f"Sitemap generated with {len(pages)} URLs in sitemap.xml.")
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
            f.write('\\n'.join(index_lines))
            
        print(f"Generated Sitemap Index 'sitemap.xml' pointing to {num_chunks} sitemaps for {len(pages)} total URLs.")

def write_sitemap(path, pages):
    xmlLines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    
    for page in pages:
        xmlLines.append('  <url>')
        xmlLines.append(f'    <loc>{page["loc"]}</loc>')
        xmlLines.append(f'    <lastmod>{page["lastmod"]}</lastmod>')
        xmlLines.append(f'    <changefreq>{page["changefreq"]}</changefreq>')
        xmlLines.append(f'    <priority>{page["priority"]}</priority>')
        xmlLines.append('  </url>')
        
    xmlLines.append('</urlset>')
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write('\\n'.join(xmlLines))

generate_sitemap('.', 'https://sweetmaidcleaning.com')
