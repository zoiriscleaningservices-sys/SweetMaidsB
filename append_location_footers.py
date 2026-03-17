import os
import glob

def main():
    repo_dir = r"c:\Users\lucia\OneDrive\Desktop\SweetMaidsB"
    index_html_path = os.path.join(repo_dir, "index.html")
    
    with open(index_html_path, "r", encoding="utf-8") as f:
        lines = f.readlines()
        
    start_line = 0
    # Find the line with "</section>" and the following whitespace indicating the end of the WhatsApp section.
    for i, line in enumerate(lines):
        if line.strip() == "</section>" and i > 2400 and i < 2500:
            start_line = i + 1
            break
            
    if start_line == 0:
        print("Could not find the start line in index.html")
        return
        
    footer_lines = "".join(lines[start_line:])
    
    # Target files: all subdirectories except root about, blog, gallery
    # We are looking for location_dir/about/index.html, etc.
    search_patterns = [
        "*/about/index.html",
        "*/blog/index.html",
        "*/gallery/index.html"
    ]
    
    targets = []
    for pattern in search_patterns:
        full_pattern = os.path.join(repo_dir, pattern)
        targets.extend(glob.glob(full_pattern))
    
    print(f"Found {len(targets)} location pages to process.")
    
    updated_count = 0
    skipped_count = 0
    
    for target_path in targets:
        with open(target_path, "r", encoding="utf-8") as f:
            target_content = f.read()
            
        # Check if the footer is already present (e.g., matching the FOOTER comment) or </body>
        if "<!-- FOOTER -->" in target_content or "</body>" in target_content:
            skipped_count += 1
            continue
            
        # Append to target page
        with open(target_path, "a", encoding="utf-8") as f:
            f.write("\n" + footer_lines)
            
        updated_count += 1

    print(f"Successfully appended footer to {updated_count} location pages.")
    print(f"Skipped {skipped_count} pages that already had a footer.")

if __name__ == "__main__":
    main()
