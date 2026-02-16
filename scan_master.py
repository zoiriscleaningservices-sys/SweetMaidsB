import sys

file_path = r"c:\Users\lucia\OneDrive\Desktop\SweetMaidsB\home\index.html"

try:
    with open(file_path, "r", encoding="utf-8") as f:
        lines = f.readlines()
    
    for i, line in enumerate(lines):
        if any(ord(c) > 127 for c in line):
            # Show the line if it contains non-ASCII characters, but filter out common ones like emoji
            # Actually, let's just show lines with Ã or Â
            if "Ã" in line or "Â" in line:
                print(f"Line {i+1}: {line.strip()}")
except Exception as e:
    print(f"Error: {e}")
