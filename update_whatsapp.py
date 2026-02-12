import os
import re

def update_whatsapp_files(directory):
    # Pattern to find: wa.me/19412222080
    # Replacement: wa.me/16452176738
    
    # Also look for the formatted number in text if present near the link, though the request specifically mentioned "on the forms" which likely refers to the link.
    # The grep check showed matches for 19412222080.
    
    old_number_pattern = re.compile(r'wa\.me/19412222080')
    new_number_link = 'wa.me/16452176738'
    
    count = 0
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.html'):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()
                    
                    if old_number_pattern.search(content):
                        new_content = old_number_pattern.sub(new_number_link, content)
                        
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        print(f"Updated: {filepath}")
                        count += 1
                except Exception as e:
                    print(f"Error processing {filepath}: {e}")
    
    print(f"Total files updated: {count}")

if __name__ == "__main__":
    update_whatsapp_files('.')
