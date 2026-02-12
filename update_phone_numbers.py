import os
import re

def update_phone_numbers(directory):
    # Replacements map
    replacements = [
             # tel: links
        (re.compile(r'tel:1?9412222080'), 'tel:16452176738'),
        (re.compile(r'tel:\+19412222080'), 'tel:+16452176738'),
        
        # WhatsApp links
        (re.compile(r'(wa\.me/|api\.whatsapp\.com/send/?\?phone=)1?9412222080'), r'\g<1>16452176738'),
        
        # Text formats
        (re.compile(r'\(941\) 222-2080'), '(645) 217-6738'),
        (re.compile(r'941-222-2080'), '645-217-6738'),
        (re.compile(r'941\.222\.2080'), '645.217.6738'),
        (re.compile(r'9412222080'), '16452176738'),
    ]

    count = 0
    files_modified = 0
    
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.html'):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()
                    
                    original_content = content
                    modified = False
                    
                    for pattern, replacement in replacements:
                        if pattern.search(content):
                            content = pattern.sub(replacement, content)
                            modified = True
                    
                    if modified:
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(content)
                        print(f"Updated: {filepath}")
                        files_modified += 1
                        
                except Exception as e:
                    print(f"Error processing {filepath}: {e}")
    
    print(f"Total files updated: {files_modified}")

if __name__ == "__main__":
    update_phone_numbers('.')
