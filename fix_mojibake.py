import os

# Mapping of corrupted sequences to correct characters
# We will sort these by length (longest first) to prevent partial replacements
REPLACEMENTS = {
    "ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢": "'",
    "ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦": "✅",
    "ÃƒÆ’Ã‚Â¢Ãƒâ€šÃ‚Â Ãƒâ€¦Ã¢â‚¬â„¢": "⚠",
    "ÃƒÆ’Ã‚Â¢ Ãƒâ€¦Ã¢â‚¬â„¢": "⚠", # Variant with space
    "ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ": "—",
    "ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“": "“",
    "ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ": "”",
    "ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢": "•",
    "ÃƒÂ¢Ã…â€œÃ¢â‚¬Â¦": "✅",
    "ÃƒÂ¢Ã‚Â Ã…â€™": "⚠",
    "ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â ": "—",
    "ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢": "'",
    "ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œ": "“",
    "ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ": "”",
    "ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢": "•",
    "Ã¢â‚¬â„¢": "'",
    "Ã¢â‚¬â€œ": "—",
    "Ã¢â‚¬Â ": "\"",
    "Ã¢â‚¬Å“": "\"",
    "Ã¢Å“â€¦": "✅",
    "Ã¢Å¡Â": "⚠",
    "ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡": "",
    "ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾Ãƒâ€šÃ‚Â¢": "'",
    "ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã‚Â¡Ãƒâ€šÃ‚Â¬": "$",
    "ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢": "'",
    "ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“": "—",
    "ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œ": "“",
    "ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ": "”",
    "ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢": "•",
    "ÃƒÂ¢Ã¢â‚¬Â¹Ã‚Â®": "🔗",
    "Ãƒâ€šÃ‚Â": "", 
    "ÃƒÆ’Ã¢â‚¬Â ": "à",
    "ÃƒÆ’Ã‚Â©": "é",
    "ÃƒÆ’Ã‚Â": "í",
    "ÃƒÆ’Ã‚Â³": "ó",
    "ÃƒÆ’Ã‚Âº": "ú",
    "ÃƒÆ’Ã‚Â±": "ñ",
    "Ãƒâ€š": "", # Sometimes loose
}

# Sort replacements by length of the key, descending
SORTED_KEYS = sorted(REPLACEMENTS.keys(), key=len, reverse=True)

def fix_file(file_path):
    print(f"Processing {file_path}...")
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except UnicodeDecodeError:
        try:
            with open(file_path, 'r', encoding='latin-1') as f:
                content = f.read()
        except Exception as e:
            print(f"  Error reading {file_path}: {e}")
            return

    original_content = content
    for bad in SORTED_KEYS:
        good = REPLACEMENTS[bad]
        if bad in content:
            content = content.replace(bad, good)
    
    if content != original_content:
        with open(file_path, 'w', encoding='utf-8', newline='') as f:
            f.write(content)
        print(f"  Fixed.")
    else:
        print(f"  No corruption found.")

def main():
    root_dir = r"c:\Users\lucia\OneDrive\Desktop\SweetMaidsB"
    for root, dirs, files in os.walk(root_dir):
        if '.git' in dirs:
            dirs.remove('.git')
        
        for file in files:
            if file.endswith('.html'):
                fix_file(os.path.join(root, file))

if __name__ == "__main__":
    main()
