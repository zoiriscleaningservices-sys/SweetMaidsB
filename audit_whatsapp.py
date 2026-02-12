import os
import re

def audit_whatsapp(directory):
    whatsapp_pattern = re.compile(r'wa\.me/(\d+)')
    
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.html'):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()
                        matches = whatsapp_pattern.findall(content)
                        if matches:
                            print(f"File: {filepath}")
                            for match in matches:
                                print(f"  Found number: {match}")
                except Exception as e:
                    print(f"Error reading {filepath}: {e}")

if __name__ == "__main__":
    audit_whatsapp('.')
