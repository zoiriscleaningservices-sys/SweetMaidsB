import os
import re
import random

ROOT_DIR = r"C:\Users\lucia\OneDrive\Desktop\SweetMaidsB"

# Pool of valid high-quality images found in the /images/ folder
VALID_IMAGES = [
    "whatsapp-image-2026-02-10-at-11.17.58-pm.jpeg",
    "whatsapp-image-2026-02-10-at-11.17.59-pm.jpeg",
    "whatsapp-image-2026-02-10-at-11.18.06-pm.jpeg",
    "whatsapp-image-2026-02-10-at-11.18.07-pm-1.jpeg",
    "whatsapp-image-2026-02-10-at-11.18.08-pm-1.jpeg",
    "whatsapp-image-2026-02-10-at-11.18.08-pm-4.jpeg",
    "whatsapp-image-2026-02-10-at-11.18.09-pm-1.jpeg",
    "whatsapp-image-2026-02-10-at-3.46.50-pm.jpeg",
    "whatsapp-image-2026-02-11-at-12.07.26-pm.jpeg"
]

def fix_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        return False

    original = content
    
    # Check if the bad image URL is in the file
    bad_url = "https://i.ibb.co/QSD3Ydt/image.jpg"
    if bad_url not in content:
        return False
        
    # Calculate relative depth to the root /images/ folder
    # Assuming filepath is something like C:\...\SweetMaidsB\bradenton-fl\house-cleaning\index.html
    rel_path = os.path.relpath(filepath, ROOT_DIR)
    depth = rel_path.count(os.sep)
    
    # If depth is 2 (e.g. city/service/index.html), we need ../../images/
    # If depth is 1 (e.g. city/index.html), we need ../images/
    # If depth is 0 (e.g. root/index.html), we need ./images/
    
    if depth == 2:
        prefix = "../../images/"
    elif depth == 1:
        prefix = "../images/"
    else:
        prefix = "./images/"
        
    # Select a random image
    new_img = random.choice(VALID_IMAGES)
    new_src = f"{prefix}{new_img}"
    
    # Replace it
    content = content.replace(bad_url, new_src)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
        
    return False

def run():
    print("Starting Hero Image Fixer...")
    
    target_dirs = []
    
    # Add root dir for index.html
    target_dirs.append(ROOT_DIR)
    
    # Add all subdirectories
    for item in os.listdir(ROOT_DIR):
        item_path = os.path.join(ROOT_DIR, item)
        if os.path.isdir(item_path):
            target_dirs.append(item_path)
            for sub in os.listdir(item_path):
                sub_path = os.path.join(item_path, sub)
                if os.path.isdir(sub_path):
                    target_dirs.append(sub_path)
                    
    modified_count = 0
    for directory in target_dirs:
        index_file = os.path.join(directory, "index.html")
        if os.path.exists(index_file):
            if fix_file(index_file):
                modified_count += 1
                if modified_count % 1000 == 0:
                    print(f"Fixed hero images in {modified_count} static pages...")
                    
    print(f"COMPLETED. Replaced broken hero images in {modified_count} static pages.")

if __name__ == "__main__":
    run()
