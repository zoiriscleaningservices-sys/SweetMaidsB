import os
import re

def update_phone_numbers(directory):
    # Replacements for the business phone number
    # New number: 941-222-2080
    # Old number: 645-217-6738
    
    replacements = [
        # Format: (645) 217-6738 -> (941) 222-2080
        (re.compile(r'\(645\) 217-6738'), '(941) 222-2080'),
        # Format: 645-217-6738 -> 941-222-2080
        (re.compile(r'645-217-6738'), '941-222-2080'),
        # Format: 645.217.6738 -> 941.222.2080
        (re.compile(r'645\.217\.6738'), '941.222.2080'),
        # Format: tel:16452176738 -> tel:19412222080
        (re.compile(r'tel:1?6452176738'), 'tel:19412222080'),
        # Format: tel:+16452176738 -> tel:+19412222080
        (re.compile(r'tel:\+16452176738'), 'tel:+19412222080'),
        # Raw number in schema or other places: 16452176738 -> 19412222080
        # Be careful not to match WA links here, handled by exclusion below
        (re.compile(r'(?<!wa\.me/)(?<!phone=)16452176738'), '19412222080'),
    ]

    files_modified = 0
    
    for root, dirs, files in os.walk(directory):
        # Skip .git and brain directories
        if '.git' in dirs:
            dirs.remove('.git')
        if '.gemini' in dirs:
            dirs.remove('.gemini')
            
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
                            # Special logic: only replace if NOT part of a WhatsApp link
                            # However, the regex above already uses negative lookbehind for simple cases.
                            # We'll do a refined substitution.
                            
                            def replace_func(match):
                                # Check the context of the match if needed, 
                                # but the negative lookbehinds should cover it.
                                return replacement

                            content = pattern.sub(replace_func, content)
                            modified = True
                    
                    if modified and content != original_content:
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(content)
                        print(f"Updated: {filepath}")
                        files_modified += 1
                        
                except Exception as e:
                    print(f"Error processing {filepath}: {e}")
    
    print(f"Total files updated: {files_modified}")

if __name__ == "__main__":
    update_phone_numbers('.')
