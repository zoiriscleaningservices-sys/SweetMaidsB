import os
import re

def check_html_files(directory):
    html_files = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(".html"):
                html_files.append(os.path.join(root, file))

    files_needing_update = []
    files_with_forms = 0

    # Regex to find forms
    form_pattern = re.compile(r'<form.*?>.*?</form>', re.DOTALL | re.IGNORECASE)
    # Regex to find inputs/selects/textareas within form
    field_pattern = re.compile(r'<(input|select|textarea)([^>]*)>', re.IGNORECASE)
    # Regex to extract attributes
    attr_pattern = re.compile(r'([a-zA-Z0-9_-]+)(?:=["\']([^"\']*)["\'])?', re.IGNORECASE)

    print(f"Checking {len(html_files)} HTML files...")

    for file_path in html_files:
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
        except Exception as e:
            print(f"Error reading {file_path}: {e}")
            continue

        forms = form_pattern.findall(content)
        if forms:
            files_with_forms += 1
            file_needs_update = False
            missing_required_list = []

            for i, form_html in enumerate(forms):
                field_matches = field_pattern.finditer(form_html)
                
                for match in field_matches:
                    tag_name = match.group(1).lower()
                    attributes_content = match.group(2)
                    
                    # Manual attribute parsing to handle boolean attributes like 'required'
                    attrs = {}
                    # Simple split by space might fail for values with spaces, so use regex
                    # The regex finds key="value" OR key='value' OR key
                    # Note: My regex above `attr_pattern` catches key="value" but not boolean key alone?
                    # Let's use a better regex for python's re module
                    
                    # Boolean attributes usually don't have =value
                    # We can check for 'required' separately
                    
                    is_required = bool(re.search(r'\brequired\b', attributes_content, re.IGNORECASE))
                    
                    # Parse name and type for filtering
                    name_match = re.search(r'name=["\']([^"\']*)["\']', attributes_content, re.IGNORECASE)
                    name = name_match.group(1).lower() if name_match else ""
                    
                    type_match = re.search(r'type=["\']([^"\']*)["\']', attributes_content, re.IGNORECASE)
                    type_attr = type_match.group(1).lower() if type_match else ""

                    if type_attr == 'hidden':
                        continue
                    if type_attr == 'submit':
                        continue
                    if type_attr == 'button': # Button inputs
                        continue
                    if type_attr == 'image':
                        continue
                    
                    # Exclude message field
                    if 'message' in name:
                        continue
                    
                    if not is_required:
                        missing_required_list.append(f"Form {i+1}: <{tag_name} name='{name}'>")
                        file_needs_update = True

            if file_needs_update:
                print(f"\n[FAIL] {file_path}")
                for msg in missing_required_list:
                    print(f"  - {msg}")
                files_needing_update.append(file_path)

    print(f"\nTotal files checked: {len(html_files)}")
    print(f"Files with forms: {files_with_forms}")
    print(f"Files needing updates: {len(files_needing_update)}")

    return files_needing_update

if __name__ == "__main__":
    check_html_files(os.getcwd())
