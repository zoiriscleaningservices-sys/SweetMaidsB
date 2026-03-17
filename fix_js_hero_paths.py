import os
import re

ROOT_DIR = r"C:\Users\lucia\OneDrive\Desktop\SweetMaidsB"

def fix_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        return False

    original = content
    
    # Calculate depth
    rel_path = os.path.relpath(filepath, ROOT_DIR)
    depth = rel_path.count(os.sep)
    
    if depth == 2:
        prefix = "../../images/"
    elif depth == 1:
        prefix = "../images/"
    else:
        prefix = "./images/"
        
    # We need to find the JS array for heroImages and fix the paths inside it
    # Find all strings like '/images/whatsapp...' or './images/whatsapp...' inside the JS block
    # A safe way is to replace all occurrences of `'/images/` and `'./images/` inside the file 
    # that are wrapped in quotes, specifically for whatsapp-images.

    # Match: ' or " followed by /images/ or ./images/ followed by whatsapp-image
    # Replace the prefix part with our dynamic prefix.
    
    content = re.sub(r'''(['"])(/|\./)?images/(whatsapp-image-.*?\.jpeg)(['"])''', rf"\1{prefix}\3\4", content)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
        
    return False

def run():
    print("Starting Hero JS Array Path Fixer...")
    
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
                if modified_count % 5000 == 0:
                    print(f"Fixed JS hero array in {modified_count} static pages...")
                    
    print(f"COMPLETED. Replaced broken JS array paths in {modified_count} static pages.")

if __name__ == "__main__":
    run()
