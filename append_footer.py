import os

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
    
    # Target files
    target_pages = [
        "about/index.html",
        "blog/index.html",
        "gallery/index.html"
    ]
    
    for relative_path in target_pages:
        target_path = os.path.join(repo_dir, relative_path)
        with open(target_path, "r", encoding="utf-8") as f:
            target_content = f.read()
            
        # Check if the footer is already present (e.g., matching the FOOTER comment)
        if "<!-- FOOTER -->" in target_content or "</body>" in target_content:
            print(f"File {relative_path} already seems to have the footer. Skipping.")
            continue
            
        # Append to target page
        with open(target_path, "a", encoding="utf-8") as f:
            f.write("\n" + footer_lines)
            
        print(f"Successfully appended footer to {relative_path}")

if __name__ == "__main__":
    main()
