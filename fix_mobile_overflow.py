import os
import re

def fix_mobile_overflow(directory):
    count = 0
    files_modified = 0
    
    # Regex to find body tag with class
    body_class_pattern = re.compile(r'<body([^>]*)class="([^"]*)"([^>]*)>')
    # Regex to find body tag without class
    body_no_class_pattern = re.compile(r'<body([^>]*)>')
    
    # Regex to find html tag (to add to html as well if needed, but let's stick to body for now or both)
    # The plan said body and html. Let's do body first as it's the direct container of content.
    # Actually, often overflow-x-hidden on body is enough. 
    # Let's add it to body.
    
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.html'):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()
                    
                    original_content = content
                    modified = False
                    
                    # Check if already has overflow-x-hidden
                    if 'overflow-x-hidden' in content:
                        # print(f"Skipping {filepath}, already has fix.")
                        continue

                    # 1. Try modifying existing class attribute on body
                    # This is complex because we don't want to mess up other attributes
                    
                    def replace_class(match):
                        before = match.group(1)
                        classes = match.group(2)
                        after = match.group(3)
                        if 'overflow-x-hidden' not in classes:
                            return f'<body{before}class="{classes} overflow-x-hidden"{after}>'
                        return match.group(0)

                    new_content = body_class_pattern.sub(replace_class, content)
                    
                    if new_content == content:
                        # 2. If no class attribute found, look for plain body tag
                        # But wait, body_class_pattern might fail if checking strictly.
                        # Let's separate the logic.
                        
                        # Find the body tag
                        body_match = re.search(r'<body.*?>', content, re.IGNORECASE)
                        if body_match:
                            body_tag = body_match.group(0)
                            
                            if 'class="' in body_tag:
                                # Has class, add to it
                                new_body_tag = re.sub(r'class="([^"]*)"', r'class="\1 overflow-x-hidden"', body_tag)
                                new_content = content.replace(body_tag, new_body_tag)
                            else:
                                # No class, add it
                                new_body_tag = body_tag.replace('>', ' class="overflow-x-hidden">')
                                new_content = content.replace(body_tag, new_body_tag)
                    
                    
                    # Also add to html tag if requested, but let's test body first.
                    # User asked to "fix it", usually body overflow-x-hidden is the key.
                    # Some resets might require it on html too.
                    # Let's do body only first.
                    
                    if new_content != original_content:
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        print(f"Fixed: {filepath}")
                        files_modified += 1
                        
                except Exception as e:
                    print(f"Error processing {filepath}: {e}")
    
    print(f"Total files updated: {files_modified}")

if __name__ == "__main__":
    fix_mobile_overflow('.')
