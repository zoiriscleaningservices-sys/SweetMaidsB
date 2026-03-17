import os
import re
from pathlib import Path
import time
import concurrent.futures

def get_image_prefix(depth):
    if depth == 0:
        return "images/"
    return ("../" * depth) + "images/"

def process_file(file_path, root_dir):
    try:
        rel_path = os.path.relpath(file_path, root_dir)
        depth = len(Path(rel_path).parts) - 1
        prefix = get_image_prefix(depth)
        
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        new_content = content
        
        # Replace variations of broken image paths
        # First, match src="/images/
        new_content = re.sub(r'src=["\']/images/', f'src="{prefix}', new_content)
        
        if depth > 0:
            # Match src="images/
            new_content = re.sub(r'src=["\']images/', f'src="{prefix}', new_content)
            # Match incorrectly set relative paths
            new_content = re.sub(r'src=["\'](?:\.\./)+images/', f'src="{prefix}', new_content)
            
        if new_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            return True
        return False
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

def process_sample(files_to_test, root_dir):
    for f in files_to_test:
        changed = process_file(f, root_dir)
        print(f"Tested {f}: Changed={changed}")

def main():
    root_dir = r"c:\Users\lucia\OneDrive\Desktop\SweetMaidsB"
    html_files = []
    
    for root, _, files in os.walk(root_dir):
        if '.git' in root or '.venv' in root:
            continue
        for file in files:
            if file.endswith(".html"):
                html_files.append(os.path.join(root, file))

    print(f"Found {len(html_files)} HTML files. Processing...")

    updated_count = 0
    start_time = time.time()
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=32) as executor:
        futures = {executor.submit(process_file, f, root_dir): f for f in html_files}
        for i, future in enumerate(concurrent.futures.as_completed(futures)):
            if future.result():
                updated_count += 1
            if (i + 1) % 5000 == 0:
                print(f"Processed {i + 1}/{len(html_files)} files...")

    end_time = time.time()
    print(f"Done! Updated {updated_count} files in {end_time - start_time:.2f} seconds.")

if __name__ == "__main__":
    main()
