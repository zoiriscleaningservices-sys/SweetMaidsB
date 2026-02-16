import os
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
                clean_path = rel_path.replace('\\', '/')
                url = f"{base_url}/{clean_path}/"
                priority = "0.9" if clean_path in ['about', 'services', 'blog', 'gallery'] else "0.8"
            
            # Get last modified time
            file_path = os.path.join(root, 'index.html')
            lastmod = datetime.fromtimestamp(os.path.getmtime(file_path)).strftime('%Y-%m-%d')
            
            pages.append({
                'loc': url,
                'lastmod': lastmod,
                'changefreq': 'weekly',
                'priority': priority
            })

    # 2. Build XML
    xmlLines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    
    for page in sorted(pages, key=lambda x: x['loc']):
        xmlLines.append('  <url>')
        xmlLines.append(f'    <loc>{page["loc"]}</loc>')
        xmlLines.append(f'    <lastmod>{page["lastmod"]}</lastmod>')
        xmlLines.append(f'    <changefreq>{page["changefreq"]}</changefreq>')
        xmlLines.append(f'    <priority>{page["priority"]}</priority>')
        xmlLines.append('  </url>')
        
    xmlLines.append('</urlset>')
    
    # 3. Write to file
    with open(os.path.join(root_dir, 'sitemap.xml'), 'w', encoding='utf-8') as f:
        f.write('\n'.join(xmlLines))
        
    print(f"Sitemap generated with {len(pages)} URLs.")

if __name__ == "__main__":
    root = "c:\\Users\\lucia\\OneDrive\\Desktop\\SweetMaidsB"
    base = "https://sweetmaidcleaning.com"
    generate_sitemap(root, base)
