import os

file_path = r"c:\Users\lucia\OneDrive\Desktop\SweetMaidsB\home\index.html"

# Specific corrupted lines we found in scanning
TARGET_OOPS = "Oops!" # We'll look for lines containing this and 'Ã'

def fix_master():
    print(f"Cleaning {file_path}...")
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            lines = f.readlines()
        
        new_lines = []
        fixed_count = 0
        for i, line in enumerate(lines):
            original = line
            # Fix Oops corruption
            if "Oops!" in line and ("Ã" in line or "Â" in line):
                line = "            ⚠️ Oops!\n"
                print(f"  Fixed Oops at line {i+1}")
                fixed_count += 1
            
            # Fix 'Impeccable Detail' dashes/boxes
            if "We focus on the hidden details" in line:
                line = line.replace("—", " &mdash; ") # Standardize em-dash
                print(f"  Standardized em-dash at line {i+1}")
                fixed_count += 1
            
            if "fans—" in line:
                line = line.replace("—", " &mdash; ")
                print(f"  Standardized em-dash at line {i+1}")
                fixed_count += 1

            # Fix any other stray Mojibake residues in the master
            if "Ã" in line or "Â" in line:
                # We'll be more surgical if we see others, but for now just the known ones
                # Actually, let's replace stray control characters too if any
                pass
            
            new_lines.append(line)
        
        if fixed_count > 0:
            with open(file_path, "w", encoding="utf-8", newline='') as f:
                f.writelines(new_lines)
            print(f"  Successfully fixed {fixed_count} items in master.")
        else:
            print("  No items fixed.")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    fix_master()
